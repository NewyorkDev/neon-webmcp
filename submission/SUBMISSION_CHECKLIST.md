# Booksy Reloaded submission checklist

Verified September 1, 2026.

## Public access

- Live app: https://newyorkdev.github.io/neon-webmcp/
- Public repository: https://github.com/NewyorkDev/neon-webmcp
- Repository visibility: public
- Default branch: `main`
- License: MIT, detected by GitHub and present as `LICENSE`
- GitHub Pages response: HTTP 200

## WebMCP proof

- Fifteen imperative tools register through `document.modelContext.registerTool(...)`.
- `artifacts/native-webmcp-verification.json` records all fifteen discovered tool names.
- The verifier fails on browser page errors; the current full workflow completes with none.
- Customer history is unavailable before site-owned sign-in.
- The authenticated session exposes only the customer-history, booking-preference, and sandbox-booking scopes.
- The usual $46 pay-in-person rebooking can proceed under the customer's $50 standing policy.
- An unavailable provider, changed service, changed time window, or price exception requires a new customer choice.
- The final sandbox booking is idempotent and appears in the provider calendar.

## Reproducible verification

- Unit tests: 10 passing
- Production build: passing
- Benchmark: 25 of 25 successful runs
- Benchmark workflow: 10 calls
- Estimated serialized JSON footprint: 2,052 tokens
- HyperFrames composition check: passing with zero errors
- Video master: 1920 by 1080, 60 seconds, silent until the supplied narration is mixed

## Submission fields

- Project name and elevator pitch: `submission/PROJECT_TEXT.md`
- Project story and technical details: `submission/PROJECT_TEXT.md`
- Judge walkthrough: `submission/TESTING.md`
- Timed narration: `videos/neon-demo/VOICE_SCRIPT_LATER.md`
- Video preview: http://localhost:3019/#project/neon-demo
- Final video URL: add after the approved MP4 is rendered and uploaded

## Remaining human gates

- Approve the current video preview.
- Supply or record the final narration audio if audio will be included.
- Render and inspect the final MP4 after approval.
- Upload the final MP4 and replace `Video: TODO` in `submission/PROJECT_TEXT.md`.
- Add every real team member in Devpost and confirm invitations are accepted.
- Open the public repository in an incognito window.
- Open the live app in the exact judge browser and invoke at least one WebMCP tool.
- Confirm the Devpost submission is submitted rather than saved as a draft.
