export const TOOL_DEFINITIONS = [
  ['get_marketplace_context', 'Start here. Read Booksy Reloaded marketplace policy, categories, supported languages, current progress, and the safest next action. This never books an appointment.', {}, [], true],
  ['get_authentication_status', 'Check whether the browser has a site-owned customer session and which scopes are available. The agent never receives or submits the customer password.', {}, [], true],
  ['list_customer_profiles', 'List the three fictional customer profiles and their goals, constraints, location, budget, and priority weights.', {}, [], true],
  ['get_customer_history', 'Read one fictional customer relationship history, including whether they are returning, their prior provider, prior service, last visit, and booking habits. This never books.', { customerProfileId: { type: 'string', enum: ['alex-morgan', 'jamie-rivera', 'taylor-kim'] } }, ['customerProfileId'], true],
  ['find_rebooking_options', 'For a returning customer, use their prior provider and service to find matching sandbox availability on a requested date and time window. If unavailable, return a clear fallback to personalized comparison. This never selects or books a slot.', { customerProfileId: { type: 'string', enum: ['alex-morgan', 'jamie-rivera', 'taylor-kim'] }, requestedDate: { type: 'string' }, timePreference: { type: 'string', enum: ['any', 'morning', 'lunch', 'afternoon'] } }, ['customerProfileId', 'requestedDate'], true],
  ['personalize_recommendations', 'Rank at least five Tampa providers for one customer using goals, specialties, proximity, budget, review themes, language, accessibility, promotions, and availability. Returns an explainable score, reasons, tradeoffs, and score breakdown without paid placement.', { customerProfileId: { type: 'string', enum: ['alex-morgan', 'jamie-rivera', 'taylor-kim'] }, category: { type: 'string', enum: ['', 'barber', 'hair', 'nails', 'skincare', 'massage', 'medspa'] }, goals: { type: 'array', uniqueItems: true, items: { type: 'string' } }, spokenLanguage: { type: 'string', enum: ['', 'English', 'Spanish', 'Mandarin'] }, maxDistanceMiles: { type: 'number', minimum: 0.5, maximum: 30 }, maxPrice: { type: 'number', minimum: 1, maximum: 1000 }, minimumRating: { type: 'number', minimum: 0, maximum: 5 }, accessibleOnly: { type: 'boolean' }, date: { type: 'string' } }, ['customerProfileId'], true],
  ['set_marketplace_preferences', 'Set or revise the visible Tampa marketplace search preferences. Changes invalidate stale results, availability, reviews, approvals, and bookings.', { city: { type: 'string', enum: ['Tampa'] }, category: { type: 'string', enum: ['', 'barber', 'hair', 'nails', 'skincare', 'massage', 'medspa'] }, spokenLanguage: { type: 'string', enum: ['', 'English', 'Spanish', 'Mandarin'] }, minimumRating: { type: 'number', minimum: 0, maximum: 5 }, accessibleOnly: { type: 'boolean' }, date: { type: 'string' }, interfaceLanguage: { type: 'string', enum: ['en', 'es'] } }],
  ['search_providers', 'Filter fictional Tampa providers using category, spoken language, rating, and accessibility constraints, then rank the survivors for the active customer.', { category: { type: 'string', enum: ['', 'barber', 'hair', 'nails', 'skincare', 'massage', 'medspa'] }, spokenLanguage: { type: 'string', enum: ['', 'English', 'Spanish', 'Mandarin'] }, minimumRating: { type: 'number', minimum: 0, maximum: 5 }, accessibleOnly: { type: 'boolean' } }, [], true],
  ['compare_providers', 'Explainably compare current results by match score, specialty fit, proximity, price, reviews, language, accessibility, promotion, and availability. This ranking has no paid placement.', { providerIds: { type: 'array', uniqueItems: true, items: { type: 'string' } } }, [], true],
  ['get_provider_profile', 'Open one provider in the shared visible marketplace and read services, policies, languages, and profile details.', { providerId: { type: 'string', minLength: 1 } }, ['providerId'], true],
  ['find_service_availability', 'Find sandbox appointment times for one provider service without holding or consuming real inventory.', { providerId: { type: 'string', minLength: 1 }, serviceId: { type: 'string', minLength: 1 }, date: { type: 'string' } }, ['providerId', 'serviceId'], true],
  ['select_appointment', 'Select a current provider, service, and time for visible review. This does not hold or book the appointment.', { providerId: { type: 'string', minLength: 1 }, serviceId: { type: 'string', minLength: 1 }, slotId: { type: 'string', minLength: 1 } }, ['providerId', 'serviceId', 'slotId']],
  ['prepare_booking_review', 'Evaluate an exact provider, service, price, and time against the signed-in customer policy. Exact pay-in-person rebooks under the saved price limit may use standing permission; substitutions require a new customer choice.', { customer: { type: 'object', properties: { name: { type: 'string', maxLength: 100 }, email: { type: 'string', maxLength: 120 }, phone: { type: 'string', maxLength: 40 } }, additionalProperties: false } }],
  ['request_booking', 'Consequential final step. Create one idempotent sandbox appointment after explicit approval or a matching signed-in customer policy. No money is charged and no real provider is contacted.', { confirmed: { type: 'boolean', const: true } }, ['confirmed']],
  ['get_booking_status', 'Read the current selection, approval, and sandbox booking status without changing state.', {}, [], true],
].map(([name, description, properties, required = [], readOnlyHint = false]) => ({
  name, description,
  inputSchema: { type: 'object', properties, required, additionalProperties: false },
  annotations: { readOnlyHint, destructiveHint: false, idempotentHint: name === 'request_booking' },
}));

export async function installWebMcp(engine) {
  const registered = [];
  const modelContext = document.modelContext;
  window.__BOOKSY_RELOADED_WEBMCP__ = window.__NEON_WEBMCP_TEST__ = {
    definitions: TOOL_DEFINITIONS,
    invoke: (name, input = {}) => engine.run(name, input),
    getState: engine.getState,
  };
  for (const definition of TOOL_DEFINITIONS) {
    if (!modelContext?.registerTool) continue;
    await modelContext.registerTool({ ...definition, execute: async (input = {}) => {
      try { return JSON.stringify(engine.run(definition.name, input)); }
      catch (error) { engine.recordFailure(definition.name, input, error); throw error; }
    } });
    registered.push(definition.name);
  }
  return registered;
}
