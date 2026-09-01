# Judge testing guide

Live app: https://newyorkdev.github.io/neon-webmcp/

## Customer flow

1. Open the live URL in ChatGPT's in-app browser or Chrome with WebMCP enabled.
2. Ask the agent to list the three customer profiles.
3. Ask it to rank all six providers for Alex Morgan and explain the score, tradeoffs, distance, reviews, and price.
4. Repeat for Jamie Rivera and Taylor Kim. The winners should change to Luz Skin Room and Soft Set Studio.
5. Ask it to compare Alex's results, including the new-provider launch offer from Gulf Glow Med Spa, then open the recommended provider.
6. Ask it to find availability for Marco Ruiz's Signature haircut.
7. Ask it to select the 10:30 AM appointment and prepare the booking review.
8. Ask it to request the booking before you approve it. The action must fail closed.
9. Click the visible approval button.
10. Ask the agent to request the booking with confirmation.
11. Switch to the Business calendar. Alex Morgan's confirmed appointment appears at 10:30 AM.

## Safety expectations

- Reference begins with `NEON-`.
- Status is `confirmed` in the sandbox only.
- No money is charged.
- No real provider is contacted.
- No production inventory is consumed.
- Repeating the final tool returns the same reference.

## Local verification

```bash
npm install
npm test
npm run build
npm run benchmark
npm run dev -- --host 127.0.0.1
npm run verify:native
```
