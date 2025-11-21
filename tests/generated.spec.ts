import { test, expect } from '@playwright/test';

test('fill out contact form and intercept POST request', async ({ page }) => {
    const targetUrl = 'https://www.mymondi.net/en/ufp/';
    const testName = 'John Doe';
    const testEmail = 'john.doe@example.com';
    const testCompany = 'Acme Corp';
    const testPhone = '+1234567890';
    const testCountry = 'Austria'; // Must be one of the options in the dropdown
    const testMessage = 'This is a test message from Playwright.';

    // 1. Navigate to the homepage and handle the cookie banner
    await page.goto(targetUrl);
    // Attempt to click the "Accept all cookies" button if it appears.
    // Using .catch() and a short timeout prevents the test from failing if the banner is not present.
    await page.getByRole('button', { name: /accept all cookies/i }).click({ timeout: 5000 }).catch(() => {
        console.log('Cookie banner not found or already dismissed.');
    });

    // 2. Set up API route interception for the contact form submission
    // We expect the form to submit to an endpoint like '/api/contact'.
    // We will capture the request and then abort it to prevent actual submission.
    const requestPromise = page.waitForRequest('**/api/contact');
    await page.route('**/api/contact', async (route) => {
        // Abort the request to prevent it from reaching the backend
        await route.abort();
    });

    // 3. Scroll to the contact form section
    // Locate the "Contact Us" heading and scroll it into view to ensure form elements are interactable.
    await page.getByRole('heading', { name: /contact us/i }).scrollIntoViewIfNeeded();

    // 4. Fill out the contact form fields
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/company/i).fill(testCompany);
    await page.getByLabel(/phone/i).fill(testPhone);
    await page.getByLabel(/country/i).selectOption({ label: testCountry });
    await page.getByLabel(/message/i).fill(testMessage);

    // 5. Check the consent checkbox
    await page.getByLabel(/i agree to the processing of my personal data/i).check();

    // 6. Click the submit button
    await page.getByRole('button', { name: /submit/i }).click();

    // 7. Wait for the intercepted request and verify its payload
    const interceptedRequest = await requestPromise;

    // Assert that the request was indeed intercepted
    expect(interceptedRequest).toBeDefined();
    expect(interceptedRequest.method()).toBe('POST');
    expect(interceptedRequest.url()).toContain('/api/contact');

    // Get the JSON payload from the intercepted request
    const postData = interceptedRequest.postDataJSON();

    // Assert the structure and content of the payload
    expect(postData).toBeDefined();
    expect(postData.name).toBe(testName);
    expect(postData.email).toBe(testEmail);
    expect(postData.company).toBe(testCompany);
    expect(postData.phone).toBe(testPhone);
    expect(postData.country).toBe(testCountry);
    expect(postData.message).toBe(testMessage);
    expect(postData.consent).toBe(true); // Assuming the checkbox sends a boolean true

    console.log('Successfully intercepted and verified the contact form POST request payload.');
    console.log('Intercepted Payload:', postData);
});
