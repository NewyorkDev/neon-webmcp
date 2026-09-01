import { performance } from 'node:perf_hooks';
import { writeFile } from 'node:fs/promises';
import { createDatabase } from '../src/database.js';
import { createMarketplaceEngine } from '../src/engine.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

function execute() {
  const engine = createMarketplaceEngine({ database: createDatabase(memoryStorage()) });
  const started = performance.now();
  engine.run('get_marketplace_context');
  engine.run('list_customer_profiles');
  engine.run('get_customer_history', { customerProfileId: 'alex-morgan' });
  engine.run('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
  engine.run('personalize_recommendations', { customerProfileId: 'alex-morgan', category: '', date: '2026-09-03' });
  engine.run('compare_providers');
  engine.run('get_provider_profile', { providerId: 'marco-ruiz' });
  engine.run('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-03' });
  engine.run('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0903-1130' });
  engine.run('prepare_booking_review');
  engine.approve();
  const result = engine.run('request_booking', { confirmed: true });
  const elapsedMs = performance.now() - started;
  const events = engine.getState().events;
  return { elapsedMs, calls: events.length, estimatedInputTokens: events.reduce((sum, event) => sum + event.inputTokensEstimated, 0), estimatedOutputTokens: events.reduce((sum, event) => sum + event.outputTokensEstimated, 0), success: result.booking.status === 'confirmed' && engine.getBookings().length === 1 };
}

execute();
const runs = Array.from({ length: 25 }, execute);
const timings = runs.map((run) => run.elapsedMs).sort((a, b) => a - b);
const representative = runs[0];
const artifact = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  methodology: 'One warm-up plus 25 deterministic engine runs. Timings exclude rendering, networking, native WebMCP transport, and model inference. Token figures are ceil(JSON characters / 4) over serialized tool inputs and outputs, not provider-billed model tokens.',
  iterations: runs.length,
  successful: runs.filter((run) => run.success).length,
  medianElapsedMs: Number(timings[Math.floor(timings.length / 2)].toFixed(3)),
  p95ElapsedMs: Number(timings[Math.floor(timings.length * 0.95)].toFixed(3)),
  calls: representative.calls,
  estimatedInputTokens: representative.estimatedInputTokens,
  estimatedOutputTokens: representative.estimatedOutputTokens,
  estimatedCombinedTokens: representative.estimatedInputTokens + representative.estimatedOutputTokens,
};
await writeFile(new URL('../artifacts/benchmark.json', import.meta.url), `${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify(artifact, null, 2));
if (artifact.successful !== artifact.iterations) process.exitCode = 1;
