import { test, expect } from '@playwright/test';

test('HubSpot contact form – intercept POST and verify payload', async ({ page }) => {
  const targetUrl = 'https://www.mymondi.net/en/ufp/contact/';

  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    message: 'This is a test message from Playwright.',
  };

  await page.goto(targetUrl);

  // Cookie banner, if any
  try {
    await page.getByRole('button', { name: /accept/i }).click({ timeout: 5000 });
  } catch {}

  // 1) Work inside the HubSpot iframe
  const formFrame = page.frameLocator('iframe.hs-form-iframe');

  // 2) Intercept HubSpot form POST (adjust pattern after you check Network tab)
  const hubspotPattern = '**/hsforms.com/**'; // or more specific like **/submissions/v3/integration/submit/**
  let interceptedPayload: string | null = null;

  await page.route(hubspotPattern, async (route) => {
    const req = route.request();
    interceptedPayload = req.postData() || '';

    // Pretend HubSpot accepted it
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ inlineMessage: 'Thanks!', redirectUrl: null }),
    });
  });

  // 3) Fill inputs inside the iframe.
  // These *names* are typical for HubSpot, but you MUST confirm them once in DevTools.
  await formFrame.locator('input[name="firstname"]').fill(testData.firstName);
  await formFrame.locator('input[name="lastname"]').fill(testData.lastName);
  await formFrame.locator('input[name="email"]').fill(testData.email);
  await formFrame.locator('input[name="company"]').fill(testData.company);
  await formFrame.locator('textarea[name="message"]').fill(testData.message);

  // Consent checkbox if present (inspect name or label locally):
  // await formFrame.getByLabel(/I agree/i).check();

  const requestPromise = page.waitForRequest(hubspotPattern);
  await formFrame.getByRole('button', { name: /submit|send|contact/i }).click();
  await requestPromise;

  expect(interceptedPayload).not.toBeNull();
  console.log('Raw HubSpot payload:', interceptedPayload);

  // You can parse the payload if it’s urlencoded:
  if (interceptedPayload) {
    const params = new URLSearchParams(interceptedPayload);
    expect(params.get('firstname')).toBe(testData.firstName);
    expect(params.get('lastname')).toBe(testData.lastName);
    expect(params.get('email')).toBe(testData.email);
    expect(params.get('company')).toBe(testData.company);
    expect(params.get('message')).toBe(testData.message);
  }
});
