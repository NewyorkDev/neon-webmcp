import { mkdir, rename } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const sourceUrl = process.env.BOOKSY_RELOADED_URL || 'https://newyorkdev.github.io/neon-webmcp/';
const outputDir = new URL('../artifacts/video/', import.meta.url);
const outputPath = new URL('booksy-reloaded-native-workflow.webm', outputDir);
const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--enable-blink-features=WebMCP'],
});
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outputDir.pathname, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();
await page.route('**tile.openstreetmap.org/**', (route) => route.abort());

const invoke = async (name, input = {}, allowFailure = false) => page.evaluate(async ({ name, input, allowFailure }) => {
  const tools = await document.modelContext.getTools();
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool) throw new Error(`Missing native tool: ${name}`);
  try {
    return JSON.parse(await document.modelContext.executeTool(tool, JSON.stringify(input)));
  } catch (error) {
    if (!allowFailure) throw error;
    return { blocked: true, message: error.message };
  }
}, { name, input, allowFailure });

try {
  await page.goto(sourceUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof document.modelContext?.getTools === 'function');
  await pause(3200);

  await page.locator('#rebook-demo').click();
  await pause(2600);
  await page.locator('#login-form button[type="submit"]').click();
  await pause(4200);

  await page.locator('#account-rebook').click();
  await pause(3600);
  await page.locator('#toggle-activity').click({ force: true });
  await pause(3200);
  await page.locator('#toggle-activity').click({ force: true });
  await pause(1000);

  await invoke('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-04', timePreference: 'lunch' });
  await page.locator('.rebooking-exception').waitFor();
  await pause(4400);

  await page.locator('#exception-same-provider').click();
  await pause(3200);
  await invoke('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0910-1030' });
  await pause(1800);
  await invoke('prepare_booking_review');
  await pause(4200);

  await page.evaluate(() => window.__BOOKSY_RELOADED_WEBMCP__.invoke('request_booking', { confirmed: true }));
  await pause(3800);

  await page.locator('#customer-account-nav').click({ force: true });
  await pause(4200);

  await page.locator('[data-role="provider"]').click({ force: true });
  await pause(3000);
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
  await pause(4200);
} finally {
  const recorded = page.video();
  await context.close();
  const temporaryPath = await recorded.path();
  await browser.close();
  await rename(temporaryPath, outputPath);
  console.log(outputPath.pathname);
}
