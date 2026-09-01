# Neon

Neon is a bilingual, agent-ready Tampa beauty and wellness marketplace built for the WebMCP Challenge. A customer and an AI agent share the same provider search, comparison, availability, review, and booking state. The final sandbox appointment requires visible customer approval and appears immediately in the fictional provider's business calendar.

**Live demo:** https://newyorkdev.github.io/neon-webmcp/

Neon is an original project inspired by the general appointment marketplace category. It is not affiliated with Booksy and does not use Booksy branding, code, data, or screenshots.

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

In a WebMCP-capable browser, Neon registers ten tools through `document.modelContext.registerTool(...)`. Unsupported browsers retain the complete human demo.

The repository includes a public native-browser verification artifact showing all ten tools discovered and invoked on the deployed HTTPS page.

## Demo safety

- All providers and appointments are fictional.
- No payment is collected.
- No real provider is contacted.
- No production inventory is consumed.
- Appointment data remains in browser-local storage.
- The customer must approve the exact visible review.

The generated fictional provider portraits are original project assets created for Neon during the challenge.
