import { CUSTOMER_PROFILES, DEMO_CUSTOMER, PROVIDERS } from './data.js';
import { createDatabase } from './database.js';

export const initialState = {
  role: 'customer', locale: 'en',
  customerProfileId: 'alex-morgan',
  preferences: { city: 'Tampa', category: 'barber', spokenLanguage: 'Spanish', minimumRating: 4.8, accessibleOnly: false, date: '2026-09-10' },
  results: [], comparison: null, selectedProviderId: null, selectedServiceId: null,
  availability: [], selectedSlotId: null, review: null, approved: false, booking: null,
  events: [], notice: '',
};

const clone = (value) => structuredClone(value);
const estimateTokens = (value) => Math.ceil(JSON.stringify(value ?? {}).length / 4);

function providerById(id) {
  return PROVIDERS.find((provider) => provider.id === id);
}

function customerById(id) {
  return CUSTOMER_PROFILES.find((customer) => customer.id === id);
}

function milesBetween([lat1, lon1], [lat2, lon2]) {
  const toRadians = (value) => value * Math.PI / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function rankProvider(provider, customer, requested) {
  const preferences = { ...customer.preferences, ...requested };
  const priorities = preferences.priorities || customer.preferences.priorities;
  const distance = Number(milesBetween(customer.coordinates, provider.coordinates).toFixed(1));
  const providerWords = [...provider.specialties, ...provider.reviewThemes.map((item) => item.theme)].join(' ').toLowerCase();
  const goals = preferences.goals || [];
  const goalMatches = goals.filter((goal) => providerWords.includes(goal.toLowerCase()));
  const specialtyFit = goals.length ? goalMatches.length / goals.length : 0.5;
  const distanceFit = Math.max(0, 1 - distance / Math.max(preferences.maxDistanceMiles || 8, 1));
  const startingPrice = Math.min(...provider.services.map((service) => service.price));
  const valueFit = Math.max(0, Math.min(1, (preferences.maxPrice || 150) / Math.max(startingPrice, 1)));
  const trustFit = ((provider.rating / 5) * 0.65) + (Math.min(provider.reviews / 400, 1) * 0.2) + (provider.reviewThemes.reduce((sum, item) => sum + item.sentiment, 0) / provider.reviewThemes.length * 0.15);
  const availabilityFit = provider.slots.some((slot) => slot.date === (requested.date || '2026-09-10')) ? 1 : 0.35;
  const weighted = specialtyFit * priorities.specialty + distanceFit * priorities.distance + valueFit * priorities.value + trustFit * priorities.trust + availabilityFit * priorities.availability;
  const languageMatch = !preferences.spokenLanguage || provider.languages.includes(preferences.spokenLanguage);
  const accessibilityMatch = !preferences.accessibleOnly || provider.accessible;
  const score = Math.round(Math.max(0, Math.min(100, weighted - (languageMatch ? 0 : 18) - (accessibilityMatch ? 0 : 25))));
  const reasons = [
    ...(goalMatches.length ? [`Matches ${goalMatches.join(', ')}`] : []),
    ...(languageMatch && preferences.spokenLanguage ? [`Speaks ${preferences.spokenLanguage}`] : []),
    `${distance} miles from ${customer.home}`,
    `${provider.rating} from ${provider.reviews} reviews`,
    `From $${startingPrice}`,
  ];
  const tradeoffs = [
    ...(!languageMatch && preferences.spokenLanguage ? [`Does not list ${preferences.spokenLanguage}`] : []),
    ...(distance > (preferences.maxDistanceMiles || 8) ? [`Outside preferred ${preferences.maxDistanceMiles}-mile radius`] : []),
    ...(startingPrice > (preferences.maxPrice || 150) ? [`Starts above $${preferences.maxPrice} budget`] : []),
    ...(!accessibilityMatch ? ['Does not list wheelchair accessibility'] : []),
  ];
  return { distance, startingPrice, matchScore: score, matchedGoals: goalMatches, reasons, tradeoffs, scoreBreakdown: { specialty: Math.round(specialtyFit * priorities.specialty), distance: Math.round(distanceFit * priorities.distance), value: Math.round(valueFit * priorities.value), trust: Math.round(trustFit * priorities.trust), availability: Math.round(availabilityFit * priorities.availability) } };
}

function invalidate(state) {
  state.availability = [];
  state.selectedSlotId = null;
  state.review = null;
  state.approved = false;
  state.booking = null;
}

export function createMarketplaceEngine({ database = createDatabase(), onChange = () => {} } = {}) {
  let state = clone(initialState);
  const publish = () => onChange(clone(state));
  const output = (action, input, value) => {
    state.events.push({ action, at: new Date().toISOString(), inputTokensEstimated: estimateTokens(input), outputTokensEstimated: estimateTokens(value) });
    publish();
    return clone(value);
  };

  const run = (action, input = {}) => {
    let value;
    switch (action) {
      case 'get_marketplace_context':
        value = { mode: 'sandbox_marketplace', city: 'Tampa', supportedLocales: ['en', 'es'], categories: ['barber', 'hair', 'nails', 'skincare', 'massage', 'medspa'], personalizationSignals: ['goals', 'distance', 'budget', 'review themes', 'language', 'accessibility', 'availability', 'new-provider promotions'], nextBestAction: state.results.length ? 'compare_providers' : 'personalize_recommendations', chargesMoney: false, contactsRealProviders: false };
        break;
      case 'list_customer_profiles':
        value = { profiles: CUSTOMER_PROFILES.map(({ email, phone, ...profile }) => profile), activeProfileId: state.customerProfileId };
        break;
      case 'get_customer_history': {
        const customer = customerById(input.customerProfileId || state.customerProfileId);
        if (!customer) throw new Error('Customer profile not found.');
        const previousProvider = providerById(customer.relationship.lastProviderId);
        const previousService = previousProvider?.services.find((service) => service.id === customer.relationship.lastServiceId);
        value = { customer: { id: customer.id, name: customer.name, home: customer.home }, relationship: customer.relationship, previousProvider: previousProvider ? { id: previousProvider.id, name: previousProvider.name, business: previousProvider.business, languages: previousProvider.languages } : null, previousService: previousService || null, safeToRebookWithoutApproval: false };
        break;
      }
      case 'find_rebooking_options': {
        const customer = customerById(input.customerProfileId || state.customerProfileId);
        if (!customer) throw new Error('Customer profile not found.');
        if (!customer.relationship.returning || !customer.relationship.lastProviderId) throw new Error('This customer has no previous provider to rebook. Use personalized recommendations instead.');
        const provider = providerById(customer.relationship.lastProviderId);
        const service = provider?.services.find((item) => item.id === customer.relationship.lastServiceId);
        if (!provider || !service) throw new Error('Previous provider or service is no longer available.');
        state.customerProfileId = customer.id;
        state.selectedProviderId = provider.id;
        state.selectedServiceId = service.id;
        state.preferences = { ...state.preferences, date: input.requestedDate };
        state.availability = provider.slots.filter((slot) => slot.date === input.requestedDate && (!input.timePreference || input.timePreference === 'any' || (input.timePreference === 'morning' && /AM$/.test(slot.time)) || (input.timePreference === 'lunch' && /11:|12:/.test(slot.time)) || (input.timePreference === 'afternoon' && /PM$/.test(slot.time))));
        state.selectedSlotId = null;
        state.review = null;
        state.approved = false;
        state.booking = null;
        value = { customer: { id: customer.id, name: customer.name }, rememberedRelationship: { visits: customer.relationship.visits, lastVisit: customer.relationship.lastVisit, note: customer.relationship.note }, previousProvider: { id: provider.id, name: provider.name, business: provider.business }, previousService: service, requestedDate: input.requestedDate, timePreference: input.timePreference || 'any', slots: state.availability, fallback: state.availability.length ? null : 'No matching time with the previous provider. Run personalize_recommendations to compare alternatives.', requiresVisibleHumanApproval: true };
        break;
      }
      case 'personalize_recommendations': {
        const customer = customerById(input.customerProfileId || state.customerProfileId);
        if (!customer) throw new Error('Customer profile not found.');
        state.customerProfileId = customer.id;
        const requested = { ...state.preferences, ...customer.preferences, ...input, category: input.category ?? '' };
        state.preferences = requested;
        state.results = PROVIDERS
          .filter((provider) => !requested.category || provider.category === requested.category)
          .map((provider) => {
            const ranking = rankProvider(provider, customer, requested);
            const { services, slots, bio, bioEs, cancellation, ...summary } = provider;
            return { ...summary, ...ranking, nextAvailable: slots[0] };
          })
          .sort((a, b) => b.matchScore - a.matchScore || a.distance - b.distance);
        state.comparison = null;
        state.selectedProviderId = null;
        state.selectedServiceId = null;
        invalidate(state);
        value = { customer: { id: customer.id, name: customer.name, headline: customer.headline, home: customer.home }, count: state.results.length, recommendations: state.results, explanation: 'Scores are deterministic weighted fit, not paid placement.' };
        break;
      }
      case 'set_marketplace_preferences':
        state.preferences = { ...state.preferences, ...input };
        if (input.interfaceLanguage) state.locale = input.interfaceLanguage;
        state.results = [];
        state.comparison = null;
        state.selectedProviderId = null;
        state.selectedServiceId = null;
        invalidate(state);
        value = { preferences: state.preferences, interfaceLanguage: state.locale, invalidated: ['results', 'availability', 'review', 'approval', 'booking'] };
        break;
      case 'search_providers': {
        const requested = { ...state.preferences, ...input };
        state.preferences = requested;
        const customer = customerById(state.customerProfileId) || DEMO_CUSTOMER;
        state.results = PROVIDERS.filter((provider) =>
          (!requested.category || provider.category === requested.category) &&
          (!requested.spokenLanguage || provider.languages.includes(requested.spokenLanguage)) &&
          (!requested.minimumRating || provider.rating >= requested.minimumRating) &&
          (!requested.accessibleOnly || provider.accessible)
        ).map((provider) => {
          const ranking = rankProvider(provider, customer, requested);
          const { services, slots, bio, bioEs, cancellation, ...summary } = provider;
          return { ...summary, ...ranking, nextAvailable: slots[0] };
        }).sort((a, b) => b.matchScore - a.matchScore || a.distance - b.distance);
        state.comparison = null;
        state.selectedProviderId = null;
        state.selectedServiceId = null;
        invalidate(state);
        value = { count: state.results.length, providers: state.results, sandboxAvailability: true };
        break;
      }
      case 'compare_providers': {
        if (!state.results.length) throw new Error('Search providers before comparing them.');
        const ids = input.providerIds?.length ? input.providerIds : state.results.map((item) => item.id);
        const candidates = state.results.filter((item) => ids.includes(item.id));
        state.comparison = candidates.map((item) => ({ id: item.id, name: item.name, business: item.business, matchScore: item.matchScore, rating: item.rating, reviews: item.reviews, distanceMiles: item.distance, startingPrice: item.startingPrice, languages: item.languages, specialties: item.specialties, reviewThemes: item.reviewThemes, reasons: item.reasons, tradeoffs: item.tradeoffs, scoreBreakdown: item.scoreBreakdown, accessible: item.accessible }));
        value = { comparison: state.comparison, recommendedProviderId: [...candidates].sort((a, b) => b.matchScore - a.matchScore)[0]?.id ?? null, recommendationBasis: ['customer goals', 'specialty fit', 'proximity', 'budget', 'review themes', 'language', 'accessibility', 'availability'], paidPlacement: false };
        break;
      }
      case 'get_provider_profile': {
        const provider = providerById(input.providerId);
        if (!provider) throw new Error('Provider not found.');
        state.selectedProviderId = provider.id;
        state.selectedServiceId = null;
        invalidate(state);
        value = { provider: { ...provider, slots: undefined }, sandboxProfile: true };
        break;
      }
      case 'find_service_availability': {
        const provider = providerById(input.providerId || state.selectedProviderId);
        if (!provider) throw new Error('Select a provider first.');
        const service = provider.services.find((item) => item.id === input.serviceId);
        if (!service) throw new Error('That provider does not offer the requested service.');
        state.selectedProviderId = provider.id;
        state.selectedServiceId = service.id;
        state.availability = provider.slots.filter((slot) => !input.date || slot.date === input.date);
        state.selectedSlotId = null;
        state.review = null;
        state.approved = false;
        state.booking = null;
        value = { providerId: provider.id, service, slots: state.availability, liveInventory: false };
        break;
      }
      case 'select_appointment': {
        const provider = providerById(input.providerId || state.selectedProviderId);
        const service = provider?.services.find((item) => item.id === (input.serviceId || state.selectedServiceId));
        const slot = state.availability.find((item) => item.id === input.slotId);
        if (!provider || !service || !slot) throw new Error('Select a current provider, service, and available time.');
        state.selectedProviderId = provider.id;
        state.selectedServiceId = service.id;
        state.selectedSlotId = slot.id;
        state.review = null;
        state.approved = false;
        state.booking = null;
        value = { selection: { providerId: provider.id, serviceId: service.id, slot }, held: false, requiresReview: true };
        break;
      }
      case 'prepare_booking_review': {
        const provider = providerById(state.selectedProviderId);
        const service = provider?.services.find((item) => item.id === state.selectedServiceId);
        const slot = state.availability.find((item) => item.id === state.selectedSlotId);
        if (!provider || !service || !slot) throw new Error('Select an available appointment first.');
        const activeCustomer = customerById(state.customerProfileId) || DEMO_CUSTOMER;
        state.review = { customer: { ...activeCustomer, ...input.customer }, provider: { id: provider.id, name: provider.name, business: provider.business, neighborhood: provider.neighborhood, languages: provider.languages }, service, slot, price: service.price, cancellation: provider.cancellation, paymentDueNow: 0, sandbox: true };
        state.approved = false;
        value = { review: state.review, requiresVisibleHumanApproval: true };
        break;
      }
      case 'request_booking': {
        if (input.confirmed !== true) throw new Error('Caller confirmation must be true.');
        if (!state.review || !state.approved) throw new Error('The customer must approve the exact visible review first.');
        const reference = `NEON-${state.review.slot.id.toUpperCase()}`;
        state.booking ??= database.saveBooking({ reference, status: 'confirmed', createdAt: new Date().toISOString(), ...state.review, contactsRealProvider: false, chargesMoney: false, consumesProductionInventory: false });
        value = { booking: state.booking, providerCalendarUpdated: true };
        break;
      }
      case 'get_booking_status':
        value = { selectedProviderId: state.selectedProviderId, reviewPrepared: Boolean(state.review), customerApproved: state.approved, booking: state.booking };
        break;
      default:
        throw new Error(`Unknown marketplace action: ${action}`);
    }
    return output(action, input, value);
  };

  return {
    run,
    getState: () => clone(state),
    getBookings: () => database.listBookings(),
    approve() {
      if (!state.review) throw new Error('Prepare the exact review before approval.');
      state.approved = true;
      publish();
    },
    setRole(role) {
      if (!['customer', 'provider'].includes(role)) throw new Error('Unknown demo role.');
      state.role = role;
      publish();
    },
    setLocale(locale) {
      if (!['en', 'es'].includes(locale)) throw new Error('Unsupported locale.');
      state.locale = locale;
      publish();
    },
    reset() {
      database.reset();
      state = clone(initialState);
      publish();
    },
  };
}
