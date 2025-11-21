import { test, expect } from '@playwright/test';

test('basic sanity check', async ({ page }) => {
  await page.goto('https://www.mymondi.net/en/ufp/');
  await expect(page).toHaveTitle(/Mondi/);
});