# Judge testing guide

Live app: https://newyorkdev.github.io/neon-webmcp/

## Customer flow

1. Open the live URL in ChatGPT's in-app browser or Chrome with WebMCP enabled.
2. Ask the agent to list the three customer profiles.
3. Ask what Alex Morgan usually books, then ask for his usual haircut on September 3 around lunch. Booksy Reloaded should return Marco Ruiz, the Signature haircut, 11:30 AM and 12:30 PM.
4. Ask it to rank all six providers for Alex Morgan and explain the score, tradeoffs, distance, reviews, and price.
5. Repeat for Jamie Rivera and Taylor Kim. The winners should change to Luz Skin Room and Soft Set Studio.
6. Ask it to compare Alex's results, including the new-provider launch offer from Gulf Glow Med Spa, then open the recommended provider.
7. Ask it to select the 11:30 AM rebooking option and prepare the booking review.
8. Ask it to request the booking before you approve it. The action must fail closed.
9. Click the visible approval button.
10. Ask the agent to request the booking with confirmation.
11. Switch to the Business calendar. Alex Morgan's confirmed appointment appears at 11:30 AM.

## Safety expectations

- Reference begins with `BR-`.
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
