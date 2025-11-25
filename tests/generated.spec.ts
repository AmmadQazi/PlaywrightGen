import { test, expect } from '@playwright/test';

test('Alokai contact form – intercept POST and verify payload', async ({ page }) => {
  const targetUrl = 'https://www.mymondi.net/en/ufp/contact/';

  const testData = {
    contactType: 'SEND_EMAIL',      // MondiContactType enum code
    title: 'mr',                    // depends on your titles list
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    companyName: 'Acme Corp',
    message: 'This is a test message from Playwright.',
    country: 'AT',
  };

  // 1. Go to the contact page
  await page.goto(targetUrl);

  // 2. Cookie banner (best effort)
  try {
    await page.getByRole('button', { name: /accept/i }).click({ timeout: 5000 });
  } catch {
    // ignore if not present
  }

  // 3. Set up interception for the real backend endpoint
  const submitPattern = '**/myMondiGrowth/contact/submit';
  let interceptedPayload: Record<string, string> | null = null;

  await page.route(submitPattern, async (route) => {
    const request = route.request();
    const rawPostData = request.postData() || ''; // form-encoded string

    const params = new URLSearchParams(rawPostData);
    interceptedPayload = Object.fromEntries(params.entries());

    // Mock the real controller response: plain "success"
    await route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: 'success',
    });
  });

  // 4. Fill out the form (adjust labels to match your UI)
  await page.getByLabel(/contact type/i).selectOption(testData.contactType);
  await page.getByLabel(/title/i).selectOption(testData.title);
  await page.getByLabel(/first name/i).fill(testData.firstName);
  await page.getByLabel(/last name/i).fill(testData.lastName);
  await page.getByLabel(/country/i).selectOption(testData.country);
  await page.getByLabel(/company/i).fill(testData.companyName);
  await page.getByLabel(/email/i).fill(testData.email);
  await page.getByLabel(/message/i).fill(testData.message);

  // If you have a consent checkbox:
  // await page.getByLabel(/processing of my personal data/i).check();

  // 5. Click submit and wait for the request we are routing
  const requestPromise = page.waitForRequest(submitPattern);
  await page.getByRole('button', { name: /send|submit|contact/i }).click();
  await requestPromise;

  // 6. Assert we actually captured the payload
  expect(interceptedPayload).not.toBeNull();

  // 7. Assert key fields (using actual backend field names)
  expect(interceptedPayload!.firstName).toBe(testData.firstName);
  expect(interceptedPayload!.lastName).toBe(testData.lastName);
  expect(interceptedPayload!.email).toBe(testData.email);
  expect(interceptedPayload!.companyName).toBe(testData.companyName);
  expect(interceptedPayload!.message).toBe(testData.message);

  // You can add more assertions as needed:
  // expect(interceptedPayload!.contactType).toBe(testData.contactType);
  // expect(interceptedPayload!.country).toBe(testData.country);

  console.log('Contact form POST intercepted and payload verified (Alokai controller).');
});
