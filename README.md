# Booksy Reloaded

Booksy Reloaded is a bilingual, agent-ready Tampa beauty and wellness marketplace built for the WebMCP Challenge. A customer and an AI agent share the same provider search, comparison, availability, review, and booking state. The final sandbox appointment requires visible customer approval and appears immediately in the fictional provider's business calendar.

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

In a WebMCP-capable browser, Booksy Reloaded registers fourteen tools through `document.modelContext.registerTool(...)`. Personalization tools rank the same provider pool using goals, specialty fit, proximity, budget, review themes, language, accessibility, promotions, and availability. Returning-customer tools can inspect a prior relationship and find the usual provider and service for a requested date and time window. Unsupported browsers retain the complete human demo.

The repository includes a public native-browser verification artifact showing all fourteen tools discovered on the deployed HTTPS page and the returning-customer booking path invoked through the native browser API.

## Demo safety

- All providers and appointments are fictional.
- No payment is collected.
- No real provider is contacted.
- No production inventory is consumed.
- Appointment data remains in browser-local storage.
- The customer must approve the exact visible review.

The generated fictional provider portraits are original project assets created for Booksy Reloaded during the challenge.
