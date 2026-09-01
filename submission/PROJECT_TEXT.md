# Project overview

## Name

Neon: Tampa Self-Care at Conversation Speed

## Elevator pitch

Neon lets an AI compare Tampa beauty professionals, find the right service and time, and prepare a booking while the customer approves the exact appointment and the provider sees it arrive.

## Links

- Live app: https://newyorkdev.github.io/neon-webmcp/
- Source: https://github.com/NewyorkDev/neon-webmcp
- Video: TODO

## Built with

WebMCP imperative API, JavaScript, HTML, CSS, Vite, Vitest, Playwright, Node.js, Google Chrome, GitHub Actions, GitHub Pages

# Project story

## Inspiration

Appointment marketplaces are useful, but finding one good appointment can still mean opening provider after provider, comparing ratings and prices, checking which languages they speak, and reopening calendars until the details line up. I use this category of product myself and wanted to see what it would look like if the marketplace gave an AI a reliable way to help without taking the final decision away from the customer.

## What we built

Neon is an original bilingual marketplace for six fictional beauty and wellness professionals in Tampa, Florida. Three customer profiles see the same provider pool ranked differently. An AI agent can use twelve WebMCP tools to weigh goals, specialties, proximity, budget, review themes, language, accessibility, promotions, and availability, explain every score and tradeoff, inspect services, find sandbox availability, and prepare an exact appointment review.

The customer sees every choice and must approve the exact provider, service, price, date, time, and cancellation policy. After approval, the final tool creates one idempotent sandbox appointment. Switching to the provider account shows that same appointment on the professional's calendar and activity feed.

## Why WebMCP

The website owns provider facts, services, prices, availability, and booking policy. The person owns intent and approval. The agent handles the tedious comparison across those constraints. WebMCP lets all three responsibilities meet in one shared visible state without making the agent rediscover cards, buttons, and calendars through visual browser automation.

This is not a generic booking form. It is a two-sided marketplace demonstration. The agent's completed action becomes visible to both the customer and the fictional provider, while any material change invalidates stale availability, review, approval, and booking state.

## How we built it

Neon registers twelve top-level imperative tools through `document.modelContext.registerTool(...)`. Human controls and agent tools call the same deterministic marketplace engine. The recommendation score is inspectable and has no paid placement. A new med spa can compete through price, specialty fit, and availability while its shorter review history remains visible. Closed JSON schemas limit every input. Read-only actions are annotated, and the final booking tool requires both `confirmed: true` from the caller and a separate visible approval from the customer.

The English and Spanish interface uses the same provider and appointment state. All marketplace records and generated portraits are original fictional demo assets. A small browser-local database keeps the public project credentialless and lets a booking created in the customer account appear in the provider calendar without exposing a public production backend.

## Challenges

The main challenge was making the project meaningfully agent-native instead of placing tools around an ordinary appointment form. Provider discovery had to compare real-world tradeoffs such as a strong specialty match versus distance, a promotion versus a shorter track record, and review trust versus budget. The result also needed to cross the marketplace boundary and appear on the business side.

The second challenge was protecting customer control. Neon fails closed before visible approval, keeps the exact review on screen, and makes the final request idempotent. The third challenge was building a polished marketplace with original fictional providers and imagery without copying a real marketplace's branding, data, or interface.

## What we learned

WebMCP is most useful when tools describe product intent instead of browser mechanics. `search_providers`, `compare_providers`, and `find_service_availability` are more reliable and understandable than asking an agent to repeatedly scan cards and click through calendars.

We also learned that shared state can make a marketplace feel genuinely collaborative. The agent does not merely recommend a provider in chat. It prepares a visible appointment, waits for the person, and produces a result the provider side can verify.

## Results

The full customer workflow uses nine WebMCP calls through booking. Across 25 reproducible engine runs, all 25 completed successfully. The workflow measured approximately 115 input plus 1,008 output JSON I/O tokens, for an estimated serialized payload footprint of 1,123 tokens. These are transparent JSON-size estimates, not provider-billed model tokens.

Neon is a sandbox. It contacts no real provider, collects no payment, sends no notification, and consumes no production inventory.

## What was built during the challenge

The Neon application, original interface, fictional marketplace data, generated provider portraits, bilingual experience, personalized customer and provider views, browser-local persistence, twelve WebMCP tools, tests, native browser verifier, benchmark, and submission materials were created during the challenge.
