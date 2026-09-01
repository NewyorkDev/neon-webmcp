import { DEMO_CUSTOMER, PROVIDERS } from './data.js';
import { createDatabase } from './database.js';

export const initialState = {
  role: 'customer', locale: 'en',
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
        value = { mode: 'sandbox_marketplace', city: 'Tampa', supportedLocales: ['en', 'es'], categories: ['barber', 'hair', 'nails', 'skincare', 'massage'], nextBestAction: state.results.length ? 'compare_providers' : 'search_providers', chargesMoney: false, contactsRealProviders: false };
        break;
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
        state.results = PROVIDERS.filter((provider) =>
          (!requested.category || provider.category === requested.category) &&
          (!requested.spokenLanguage || provider.languages.includes(requested.spokenLanguage)) &&
          (!requested.minimumRating || provider.rating >= requested.minimumRating) &&
          (!requested.accessibleOnly || provider.accessible)
        ).map(({ services, slots, bio, bioEs, cancellation, ...provider }) => ({ ...provider, startingPrice: Math.min(...services.map((service) => service.price)), nextAvailable: slots[0] }));
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
        state.comparison = candidates.map((item) => ({ id: item.id, name: item.name, business: item.business, rating: item.rating, reviews: item.reviews, distanceMiles: item.distance, startingPrice: item.startingPrice, languages: item.languages, accessible: item.accessible }));
        value = { comparison: state.comparison, bestRatedProviderId: [...candidates].sort((a, b) => b.rating - a.rating)[0]?.id ?? null, recommendationBasis: ['requested category', 'spoken language', 'minimum rating', 'distance', 'starting price'] };
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
        state.review = { customer: { ...DEMO_CUSTOMER, ...input.customer }, provider: { id: provider.id, name: provider.name, business: provider.business, neighborhood: provider.neighborhood, languages: provider.languages }, service, slot, price: service.price, cancellation: provider.cancellation, paymentDueNow: 0, sandbox: true };
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
