import { test, expect, Page } from '@playwright/test';

test.describe('Contact Form Submission', () => {
    const TARGET_URL = 'https://www.mymondi.net/en/ufp/';
    const CONTACT_FORM_API_ENDPOINT = '**/api/contact/submit'; // The actual API endpoint for form submission

    test('should fill out the contact form and intercept the POST request payload', async ({ page }) => {
        let interceptedRequestPayload: any;

        // 1. Navigate to the target URL
        await page.goto(TARGET_URL);

        // 2. Scroll to the contact form section
        // The contact form is usually at the bottom of the page.
        // We can locate a unique element within the contact section and scroll into view.
        const contactSectionHeading = page.getByRole('heading', { name: 'Contact us' });
        await contactSectionHeading.scrollIntoViewIfNeeded();
        await expect(contactSectionHeading).toBeVisible(); // Ensure the section is visible

        // 3. Set up API route interception for the contact form submission
        // We will intercept the POST request to the contact form API endpoint.
        // The request will be fulfilled with a mock response to prevent actual submission.
        await page.route(CONTACT_FORM_API_ENDPOINT, async route => {
            // Assert that the request method is POST
            expect(route.request().method()).toBe('POST');

            // Store the request payload for later assertions
            interceptedRequestPayload = route.request().postDataJSON();

            // Fulfill the request with a mock success response
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, message: 'Form submitted successfully (mocked)' }),
            });
        });

        // 4. Fill in the Name field
        await page.getByLabel('Name').fill('John Doe');

        // 5. Fill in the Email field
        await page.getByLabel('Email').fill('john.doe@example.com');

        // 6. Fill in the Company field
        await page.getByLabel('Company').fill('Acme Corp');

        // 7. Fill in the Phone field
        await page.getByLabel('Phone').fill('+1234567890');

        // 8. Select a Country from the dropdown
        // The country field is a select element.
        await page.getByLabel('Country').selectOption('United States');

        // 9. Fill in the Message field
        await page.getByLabel('Message').fill('This is a test message from Playwright automation.');

        // 10. Check the Privacy Policy agreement checkbox
        // The checkbox has a label "I agree to the processing of my personal data..."
        await page.getByLabel('I agree to the processing of my personal data').check();

        // 11. Click the Submit button
        await page.getByRole('button', { name: 'Submit' }).click();

        // 12. Wait for the intercepted request to be processed
        // We need to ensure the route handler has executed and captured the payload.
        // A simple way is to wait for the network idle or for a specific response.
        // Since we're fulfilling, we can wait for the mock response to be received.
        // Alternatively, we can use page.waitForRequest or page.waitForResponse if we don't fulfill.
        // For this scenario, since we're fulfilling, the route handler itself captures the payload.
        // We just need to ensure the click action has triggered the request.
        // A short pause or waiting for a UI change (like a success message) can help.
        // For now, we'll rely on the `interceptedRequestPayload` being set.
        await page.waitForTimeout(500); // Small wait to ensure the network request is processed

        // 13. Assert the intercepted request payload structure and values
        expect(interceptedRequestPayload).toBeDefined();
        expect(interceptedRequestPayload).toEqual({
            name: 'John Doe',
            email: 'john.doe@example.com',
            company: 'Acme Corp',
            phone: '+1234567890',
            country: 'United States',
            message: 'This is a test message from Playwright automation.',
            privacyPolicyAccepted: true,
        });

        // 14. Optionally, assert for a success message on the UI (if the mock response triggers one)
        // This depends on how the frontend handles the 200 OK mock response.
        // For this specific site, after submitting, a success message appears in a modal.
        const successMessage = page.getByText('Thank you for your message. We will get back to you shortly.');
        await expect(successMessage).toBeVisible();
    });
});
