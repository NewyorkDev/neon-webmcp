import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const url = process.env.NEON_URL || 'http://127.0.0.1:5174/';
const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
await mkdir(new URL('../artifacts/screenshots/', import.meta.url), { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ['--enable-blink-features=WebMCP'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof document.modelContext?.getTools === 'function');
  const result = await page.evaluate(async () => {
    const tools = await document.modelContext.getTools();
    const call = async (name, input = {}) => {
      const tool = tools.find((candidate) => candidate.name === name);
      if (!tool) throw new Error(`Missing native tool: ${name}`);
      return JSON.parse(await document.modelContext.executeTool(tool, JSON.stringify(input)));
    };
    const context = await call('get_marketplace_context');
    const profiles = await call('list_customer_profiles');
    const search = await call('personalize_recommendations', { customerProfileId: 'alex-morgan', category: '', date: '2026-09-10' });
    const comparison = await call('compare_providers');
    await call('get_provider_profile', { providerId: 'marco-ruiz' });
    const availability = await call('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-10' });
    await call('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0910-1030' });
    const review = await call('prepare_booking_review');
    let preApprovalBlocked = false;
    try { await call('request_booking', { confirmed: true }); } catch { preApprovalBlocked = true; }
    return { toolNames: tools.map((tool) => tool.name).sort(), context, customerProfiles: profiles.profiles.length, searchCount: search.count, recommendedProviderId: comparison.recommendedProviderId, topMatchScore: comparison.comparison[0].matchScore, slotCount: availability.slots.length, reviewProviderId: review.review.provider.id, preApprovalBlocked };
  });

  await page.locator('#approve-button').click();
  const bookingResult = await page.evaluate(async () => {
    const tools = await document.modelContext.getTools();
    const tool = tools.find((candidate) => candidate.name === 'request_booking');
    return JSON.parse(await document.modelContext.executeTool(tool, JSON.stringify({ confirmed: true })));
  });
  await page.locator('.success-toast').waitFor();
  await page.screenshot({ path: new URL('../artifacts/screenshots/neon-customer-confirmed.png', import.meta.url).pathname, fullPage: true });
  await page.locator('.success-toast [data-role="provider"]').click();
  await page.locator('.new-booking').waitFor();
  await page.screenshot({ path: new URL('../artifacts/screenshots/neon-provider-calendar.png', import.meta.url).pathname, fullPage: true });

  const providerText = await page.locator('.new-booking').innerText();
  const artifact = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    browser: 'Google Chrome with WebMCP enabled',
    url,
    ...result,
    finalBooking: bookingResult.booking,
    providerCalendarUpdated: bookingResult.providerCalendarUpdated,
    providerCalendarText: providerText,
    methodology: 'Discovered and invoked all tools through document.modelContext.getTools() and document.modelContext.executeTool(). The visible customer approval button was clicked between the blocked and successful booking calls.',
  };
  await writeFile(new URL('../artifacts/native-webmcp-verification.json', import.meta.url), `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify(artifact, null, 2));
  if (result.toolNames.length !== 12 || !result.preApprovalBlocked || result.customerProfiles !== 3 || result.searchCount < 5 || result.recommendedProviderId !== 'marco-ruiz' || !bookingResult.providerCalendarUpdated || !providerText.includes('Alex Morgan')) process.exitCode = 1;
} finally {
  await browser.close();
}
