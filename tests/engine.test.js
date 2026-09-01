import { describe, expect, it } from 'vitest';
import { createDatabase } from '../src/database.js';
import { createMarketplaceEngine } from '../src/engine.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

function prepare(engine) {
  engine.authenticate('alex-morgan');
  engine.run('search_providers', { category: 'barber', spokenLanguage: 'Spanish', minimumRating: 4.8, accessibleOnly: false });
  engine.run('compare_providers', {});
  engine.run('get_provider_profile', { providerId: 'marco-ruiz' });
  engine.run('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-10' });
  engine.run('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0910-1030' });
  engine.run('prepare_booking_review', {});
}

describe('Neon marketplace engine', () => {
  it('changes the recommendation for three different customer profiles', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    const winners = ['alex-morgan', 'jamie-rivera', 'taylor-kim'].map((customerProfileId) => engine.run('personalize_recommendations', { customerProfileId, category: '', date: '2026-09-10' }).recommendations[0].id);
    expect(winners).toEqual(['marco-ruiz', 'sofia-alvarez', 'mei-chen']);
  });

  it('keeps a new promoted provider competitive without hiding the short track record', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    engine.run('personalize_recommendations', { customerProfileId: 'jamie-rivera', category: '', date: '2026-09-10' });
    const comparison = engine.run('compare_providers');
    const newcomer = comparison.comparison.find((item) => item.id === 'amaya-patel');
    expect(newcomer.matchScore).toBeGreaterThan(50);
    expect(newcomer.reviews).toBe(11);
    expect(comparison.paidPlacement).toBe(false);
  });

  it('uses a returning customer relationship to find the usual service around lunch', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    engine.authenticate('alex-morgan');
    const history = engine.run('get_customer_history', { customerProfileId: 'alex-morgan' });
    const options = engine.run('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    expect(history.previousProvider.id).toBe('marco-ruiz');
    expect(history.previousService.id).toBe('signature-cut');
    expect(options.slots.map((slot) => slot.id)).toEqual(['mr-0903-1130', 'mr-0903-1230']);
    expect(options.canBookExactMatchUnderStandingPermission).toBe(true);
    expect(options.substitution).toBeNull();
  });

  it('protects customer history behind the site-owned session', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    expect(engine.run('get_authentication_status').status).toBe('authentication_required');
    expect(() => engine.run('get_customer_history', { customerProfileId: 'alex-morgan' })).toThrow(/Authentication required/i);
    engine.authenticate('alex-morgan');
    expect(engine.run('get_authentication_status').status).toBe('signed_in');
  });

  it('asks the customer when the usual provider is unavailable', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    engine.authenticate('alex-morgan');
    const options = engine.run('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-04', timePreference: 'lunch' });
    expect(options.slots).toHaveLength(0);
    expect(options.substitution.requiresCustomerChoice).toBe(true);
    expect(options.nextBestAction).toBe('ask_customer_about_substitution');
  });

  it('finds the requested bilingual Tampa barber', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    const result = engine.run('search_providers', { category: 'barber', spokenLanguage: 'Spanish', minimumRating: 4.8, accessibleOnly: false });
    expect(result.count).toBe(1);
    expect(result.providers[0].id).toBe('marco-ruiz');
  });

  it('uses standing permission only for an exact rebook within the customer policy', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    engine.authenticate('alex-morgan');
    engine.run('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    engine.run('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0903-1130' });
    const review = engine.run('prepare_booking_review', {});
    expect(review.authorizationMode).toBe('standing_exact_match_permission');
    expect(review.requiresVisibleHumanApproval).toBe(false);
    expect(engine.run('request_booking', { confirmed: true }).booking.reference).toBe('BR-MR-0903-1130');
  });

  it('lets the customer change the automatic booking price ceiling', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    engine.authenticate('alex-morgan');
    engine.setBookingPolicy({ maxServicePrice: 35 });
    engine.run('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    engine.run('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0903-1130' });
    const review = engine.run('prepare_booking_review', {});
    expect(review.authorizationMode).toBe('explicit_review');
    expect(review.review.authorizationReason).toBe('price_above_customer_limit');
  });

  it('persists one idempotent booking for the provider calendar', () => {
    const storage = memoryStorage();
    const database = createDatabase(storage);
    const engine = createMarketplaceEngine({ database });
    prepare(engine);
    engine.approve();
    const first = engine.run('request_booking', { confirmed: true });
    const second = engine.run('request_booking', { confirmed: true });
    expect(first.booking.reference).toBe(second.booking.reference);
    expect(database.listBookings()).toHaveLength(1);
    expect(database.listBookings()[0].provider.id).toBe('marco-ruiz');
  });

  it('invalidates stale approval after preferences change', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    prepare(engine);
    engine.approve();
    engine.run('set_marketplace_preferences', { category: 'nails' });
    expect(engine.getState().approved).toBe(false);
    expect(engine.getState().review).toBeNull();
  });
});
