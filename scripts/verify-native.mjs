import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const url = process.env.NEON_URL || 'http://127.0.0.1:5174/';
const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
await mkdir(new URL('../artifacts/screenshots/', import.meta.url), { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath, args: ['--enable-blink-features=WebMCP'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log('verify: page loaded');
  await page.waitForFunction(() => typeof document.modelContext?.getTools === 'function');
  const signedOutStatus = await page.evaluate(async () => {
    const tools = await document.modelContext.getTools();
    const tool = tools.find((candidate) => candidate.name === 'get_authentication_status');
    return JSON.parse(await document.modelContext.executeTool(tool, '{}'));
  });
  console.log('verify: signed-out status');
  await page.locator('#account-button').click();
  await page.locator('#login-form button[type="submit"]').click();
  await page.locator('.booking-policy').waitFor();
  console.log('verify: signed in');
  await page.locator('#home-button').click();
  await page.locator('.modern-hero').waitFor();
  const result = await page.evaluate(async () => {
    const tools = await document.modelContext.getTools();
    const call = async (name, input = {}) => {
      const tool = tools.find((candidate) => candidate.name === name);
      if (!tool) throw new Error(`Missing native tool: ${name}`);
      return JSON.parse(await document.modelContext.executeTool(tool, JSON.stringify(input)));
    };
    const context = await call('get_marketplace_context');
    const authentication = await call('get_authentication_status');
    const profiles = await call('list_customer_profiles');
    const history = await call('get_customer_history', { customerProfileId: 'alex-morgan' });
    const rebooking = await call('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    const unavailable = await call('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-04', timePreference: 'lunch' });
    await call('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    const search = await call('personalize_recommendations', { customerProfileId: 'alex-morgan', category: '', date: '2026-09-03' });
    const comparison = await call('compare_providers');
    await call('get_provider_profile', { providerId: 'marco-ruiz' });
    const availability = await call('find_service_availability', { providerId: 'marco-ruiz', serviceId: 'signature-cut', date: '2026-09-03' });
    await call('find_rebooking_options', { customerProfileId: 'alex-morgan', requestedDate: '2026-09-03', timePreference: 'lunch' });
    await call('select_appointment', { providerId: 'marco-ruiz', serviceId: 'signature-cut', slotId: 'mr-0903-1130' });
    const review = await call('prepare_booking_review');
    return { toolNames: tools.map((tool) => tool.name).sort(), context, authentication, customerProfiles: profiles.profiles.length, previousProviderId: history.previousProvider.id, rememberedServiceId: history.previousService.id, rebookingSlotCount: rebooking.slots.length, substitutionRequiresCustomerChoice: unavailable.substitution?.requiresCustomerChoice === true, searchCount: search.count, recommendedProviderId: comparison.recommendedProviderId, topMatchScore: comparison.comparison[0].matchScore, slotCount: availability.slots.length, reviewProviderId: review.review.provider.id, authorizationMode: review.authorizationMode };
  });
  console.log('verify: native planning tools complete');

  const bookingResult = await page.evaluate(() => window.__BOOKSY_RELOADED_WEBMCP__.invoke('request_booking', { confirmed: true }));
  console.log('verify: standing-policy booking executed');
  await page.locator('.success-toast').waitFor({ timeout: 5000 });
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
    signedOutStatus,
    ...result,
    finalBooking: bookingResult.booking,
    providerCalendarUpdated: bookingResult.providerCalendarUpdated,
    providerCalendarText: providerText,
    methodology: 'Discovered and invoked the read and planning tools through document.modelContext.getTools() and document.modelContext.executeTool(). Verified authentication_required before the site-owned login, signed_in scope afterward, exact-match standing permission under the customer policy, and an unavailable-provider substitution that requires customer choice. CI invoked the same final booking handler through the installed project bridge so it does not depend on host-level consequential-tool approval UI.',
  };
  await writeFile(new URL('../artifacts/native-webmcp-verification.json', import.meta.url), `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify(artifact, null, 2));
  if (pageErrors.length) throw new Error(`Browser page errors: ${pageErrors.join(' | ')}`);
  if (result.toolNames.length !== 15 || signedOutStatus.status !== 'authentication_required' || result.authentication.status !== 'signed_in' || result.authorizationMode !== 'standing_exact_match_permission' || !result.substitutionRequiresCustomerChoice || result.customerProfiles !== 3 || result.previousProviderId !== 'marco-ruiz' || result.rememberedServiceId !== 'signature-cut' || result.rebookingSlotCount !== 2 || result.searchCount < 5 || result.recommendedProviderId !== 'marco-ruiz' || !bookingResult.providerCalendarUpdated || !providerText.includes('Alex Morgan')) process.exitCode = 1;
} finally {
  await browser.close();
}
