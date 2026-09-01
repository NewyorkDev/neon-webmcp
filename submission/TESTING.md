# Judge testing guide

## Customer flow

1. Open the live URL in ChatGPT's in-app browser or Chrome with WebMCP enabled.
2. Ask the agent to find a Spanish-speaking Tampa barber rated at least 4.8 for September 10.
3. Ask it to compare the results and open the best-rated provider.
4. Ask it to find availability for Marco Ruiz's Signature haircut.
5. Ask it to select the 10:30 AM appointment and prepare the booking review.
6. Ask it to request the booking before you approve it. The action must fail closed.
7. Click the visible approval button.
8. Ask the agent to request the booking with confirmation.
9. Switch to the Business calendar. Alex Morgan's confirmed appointment appears at 10:30 AM.

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
