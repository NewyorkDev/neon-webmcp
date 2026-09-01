# Project overview

## Name

Booksy Reloaded: Tampa Self-Care at Conversation Speed

## Elevator pitch

Booksy Reloaded lets an AI compare Tampa professionals, securely use a customer's history, book exact matches within preset limits, and ask only when a substitution needs a decision.

## Links

- Live app: https://newyorkdev.github.io/neon-webmcp/
- Source: https://github.com/NewyorkDev/neon-webmcp
- Video: TODO

## Built with

WebMCP imperative API, JavaScript, HTML, CSS, Vite, Vitest, Playwright, Node.js, Google Chrome, GitHub Actions, GitHub Pages

# Project story

## Inspiration

I use Booksy as a real customer. Booking with someone I already know can still mean opening the app, finding the provider again, checking the calendar, and repeating details the marketplace already has. I wanted to see what would happen if I could simply ask AI to book the appointment while the website supplied reliable data and kept the final decision in my hands.

## What we built

Booksy Reloaded is an original bilingual marketplace for six fictional beauty and wellness professionals in Tampa, Florida. Three customer profiles see the same provider pool ranked differently. Returning customers can ask for their usual service in natural language without starting over. An AI agent can use fifteen WebMCP tools to inspect authenticated relationship history, find rebooking options, weigh goals, specialties, proximity, budget, review themes, language, accessibility, promotions, and availability, explain every score and tradeoff, and prepare an appointment.

The customer sets a practical policy: use the usual provider and service, pay in person, and stay at or below $50. Exact matches can be booked when the customer asks. A different provider, service, requested window, or higher price returns a structured exception and requires a new customer choice. The final tool creates one idempotent sandbox appointment. Switching to the provider account shows that same appointment on the professional's calendar and activity feed.

## Why WebMCP

The website owns provider facts, services, prices, availability, and booking policy. The person owns intent, preset limits, and exception choices. The agent handles the tedious comparison across those constraints. WebMCP lets all three responsibilities meet in one shared visible state without making the agent rediscover cards, buttons, and calendars through visual browser automation.

This is not a generic booking form. It is a two-sided marketplace demonstration. The agent's completed action becomes visible to both the customer and the fictional provider, while any material change invalidates stale availability, review, approval, and booking state.

## How we built it

Booksy Reloaded registers fifteen top-level imperative tools through `document.modelContext.registerTool(...)`. Human controls and agent tools call the same deterministic marketplace engine. The recommendation score is inspectable and has no paid placement. A new med spa can compete through price, specialty fit, and availability while its shorter review history remains visible. Returning-customer history is explicit site data, not invisible model memory. Closed JSON schemas limit every input. Read-only actions are annotated, customer history is unavailable before the site-owned demo session is established, and the final booking tool requires `confirmed: true` plus either an exact policy match or explicit exception approval.

The English and Spanish interface uses the same provider and appointment state. All marketplace records and generated portraits are original fictional demo assets. A small browser-local database keeps the public project credentialless and lets a booking created in the customer account appear in the provider calendar without exposing a public production backend.

## Challenges

The main challenge was making the project meaningfully agent-native instead of placing tools around an ordinary appointment form. Provider discovery had to compare real-world tradeoffs such as a strong specialty match versus distance, a promotion versus a shorter track record, and review trust versus budget. The result also needed to cross the marketplace boundary and appear on the business side.

The second challenge was protecting customer control without adding a pointless click to every booking. Booksy Reloaded permits exact matches under a visible preset policy, fails closed on substitutions and price exceptions, and makes the final request idempotent. The third challenge was building a polished two-sided marketplace using original fictional providers, data, appointments, and interface code.

## What we learned

WebMCP is most useful when tools describe product intent instead of browser mechanics. `search_providers`, `compare_providers`, and `find_service_availability` are more reliable and understandable than asking an agent to repeatedly scan cards and click through calendars.

We also learned that shared state can make a marketplace feel genuinely collaborative. The agent does not merely recommend a provider in chat. It follows the customer's visible policy, pauses when a substitution needs a choice, and produces a result the provider side can verify.

## Results

The current policy-aware benchmark uses ten engine calls through final booking status. Across 25 reproducible runs, all 25 completed successfully. The latest artifact measured approximately 84 input plus 1,968 output JSON I/O tokens, for an estimated serialized payload footprint of 2,052 tokens. These are transparent JSON-size estimates, not provider-billed model tokens, and the benchmark excludes rendering, networking, native WebMCP transport, and model inference.

Booksy Reloaded is a sandbox. It contacts no real provider, collects no payment, sends no notification, and consumes no production inventory.

## What was built during the challenge

The Booksy Reloaded application, original interface, fictional marketplace data, generated provider portraits, bilingual experience, personalized and returning-customer flows, customer and provider views, browser-local persistence, fifteen WebMCP tools, tests, native browser verifier, benchmark, and submission materials were created during the challenge.
