import { describe, expect, it } from 'vitest';
import { createDatabase } from '../src/database.js';
import { createMarketplaceEngine } from '../src/engine.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

function prepare(engine) {
  engine.run('search_providers', { category: 'barber', spokenLanguage: 'Spanish', minimumRating: 4.8, accessibleOnly: false });
  engine.run('compare_providers', {});
  engine.run('get_provider_profile', { providerId: 'marco-ruiz' });
  engine.run('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-10' });
  engine.run('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0910-1030' });
  engine.run('prepare_booking_review', {});
}

describe('Neon marketplace engine', () => {
  it('finds the requested bilingual Tampa barber', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    const result = engine.run('search_providers', { category: 'barber', spokenLanguage: 'Spanish', minimumRating: 4.8, accessibleOnly: false });
    expect(result.count).toBe(1);
    expect(result.providers[0].id).toBe('marco-ruiz');
  });

  it('fails closed before visible approval', () => {
    const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
    prepare(engine);
    expect(() => engine.run('request_booking', { confirmed: true })).toThrow(/approve/i);
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
