# Booksy Reloaded

Booksy Reloaded is a bilingual, agent-ready Tampa beauty and wellness marketplace built for the WebMCP Challenge. A customer and an AI agent share the same provider search, comparison, availability, policy, and booking state. Exact pay-in-person rebooks under the signed-in customer's $50 limit can use standing permission. Any provider, service, time-window, or price substitution pauses for a new customer choice.

**Live demo:** https://newyorkdev.github.io/neon-webmcp/

Booksy Reloaded is an independent WebMCP prototype inspired by my experience as a Booksy customer. It is not affiliated with or endorsed by Booksy. The application code, provider records, appointments, interface, and generated provider portraits are original fictional demo materials.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
npm run benchmark
npm run verify:native
```

In a WebMCP-capable browser, Booksy Reloaded registers fifteen tools through `document.modelContext.registerTool(...)`. Personalization tools rank the same provider pool using goals, specialty fit, proximity, budget, review themes, language, accessibility, promotions, and availability. Returning-customer tools can inspect a prior relationship only after the site-owned demo session is established, then apply the customer's visible booking policy. Unsupported browsers retain the complete human demo.

The repository includes a native-browser verification artifact showing all fifteen tools discovered, customer history protected before login, authenticated scope afterward, an exact-match booking under standing permission, and an unavailable-provider substitution that requires customer choice.

## Demo safety

- All providers and appointments are fictional.
- No payment is collected.
- No real provider is contacted.
- No production inventory is consumed.
- Appointment data remains in browser-local storage.
- Exact matches must satisfy the signed-in customer's visible policy; substitutions and price exceptions require a new customer choice.

The generated fictional provider portraits are original project assets created for Booksy Reloaded during the challenge.
