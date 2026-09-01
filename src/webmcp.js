export const TOOL_DEFINITIONS = [
  ['get_marketplace_context', 'Start here. Read Neon marketplace policy, categories, supported languages, current progress, and the safest next action. This never books an appointment.', {}, [], true],
  ['set_marketplace_preferences', 'Set or revise the visible Tampa marketplace search preferences. Changes invalidate stale results, availability, reviews, approvals, and bookings.', { city: { type: 'string', enum: ['Tampa'] }, category: { type: 'string', enum: ['barber', 'hair', 'nails', 'skincare', 'massage'] }, spokenLanguage: { type: 'string', enum: ['English', 'Spanish', 'Mandarin'] }, minimumRating: { type: 'number', minimum: 0, maximum: 5 }, accessibleOnly: { type: 'boolean' }, date: { type: 'string' }, interfaceLanguage: { type: 'string', enum: ['en', 'es'] } }],
  ['search_providers', 'Search fictional Tampa providers using category, spoken language, rating, and accessibility constraints. Results use sandbox data.', { category: { type: 'string', enum: ['barber', 'hair', 'nails', 'skincare', 'massage'] }, spokenLanguage: { type: 'string', enum: ['English', 'Spanish', 'Mandarin'] }, minimumRating: { type: 'number', minimum: 0, maximum: 5 }, accessibleOnly: { type: 'boolean' } }, [], true],
  ['compare_providers', 'Compare current provider results by rating, reviews, distance, price, language, and accessibility.', { providerIds: { type: 'array', uniqueItems: true, items: { type: 'string' } } }, [], true],
  ['get_provider_profile', 'Open one provider in the shared visible marketplace and read services, policies, languages, and profile details.', { providerId: { type: 'string', minLength: 1 } }, ['providerId'], true],
  ['find_service_availability', 'Find sandbox appointment times for one provider service without holding or consuming real inventory.', { providerId: { type: 'string', minLength: 1 }, serviceId: { type: 'string', minLength: 1 }, date: { type: 'string' } }, ['providerId', 'serviceId'], true],
  ['select_appointment', 'Select a current provider, service, and time for visible review. This does not hold or book the appointment.', { providerId: { type: 'string', minLength: 1 }, serviceId: { type: 'string', minLength: 1 }, slotId: { type: 'string', minLength: 1 } }, ['providerId', 'serviceId', 'slotId']],
  ['prepare_booking_review', 'Prepare the exact customer-facing provider, service, price, time, and policy review. The customer must approve it visibly.', { customer: { type: 'object', properties: { name: { type: 'string', maxLength: 100 }, email: { type: 'string', maxLength: 120 }, phone: { type: 'string', maxLength: 40 } }, additionalProperties: false } }],
  ['request_booking', 'Consequential final step. Create one idempotent sandbox appointment only after visible customer approval. No money is charged and no real provider is contacted.', { confirmed: { type: 'boolean', const: true } }, ['confirmed']],
  ['get_booking_status', 'Read the current selection, approval, and sandbox booking status without changing state.', {}, [], true],
].map(([name, description, properties, required = [], readOnlyHint = false]) => ({
  name, description,
  inputSchema: { type: 'object', properties, required, additionalProperties: false },
  annotations: { readOnlyHint, destructiveHint: false, idempotentHint: name === 'request_booking' },
}));

export async function installWebMcp(engine) {
  const registered = [];
  const modelContext = document.modelContext;
  window.__NEON_WEBMCP_TEST__ = {
    definitions: TOOL_DEFINITIONS,
    invoke: (name, input = {}) => engine.run(name, input),
    getState: engine.getState,
  };
  for (const definition of TOOL_DEFINITIONS) {
    if (!modelContext?.registerTool) continue;
    await modelContext.registerTool({ ...definition, execute: async (input = {}) => JSON.stringify(engine.run(definition.name, input)) });
    registered.push(definition.name);
  }
  return registered;
}
