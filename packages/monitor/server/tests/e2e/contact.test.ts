import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('menuitem', { name: 'Contact us' }).click();
  });

  test('should load the contact page with correct title and header', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Contact Us | My Website');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Contact us');
  });

  test('should display contact information sidebar and a contact form', async ({
    page,
  }) => {
    await expect(
      page
        .locator('div')
        .filter({ hasText: 'My Company 3575 Fake Buena' })
        .nth(4),
    ).toBeVisible();
    await expect(
      page.locator('section').filter({ hasText: 'Contact us about anything' }),
    ).toBeVisible();
  });

  test('should not be able to submit form with empty fields', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#s_website_form_result')).toContainText(
      'Please fill in the form correctly.',
    );
  });

  test('should be able to submit contact form successfully', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('89898989');
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('john.doe@gmail.com');
    await page.getByRole('textbox', { name: 'Company' }).fill('Microsoft');
    await page
      .getByRole('textbox', { name: 'Subject' })
      .fill('General Inquiry');
    await page
      .getByRole('textbox', { name: 'Question' })
      .fill('How will the ESM teaching team mess up the site?');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForURL(`${process.env.APP_URL}/contactus-thank-you`, {
      timeout: 30000,
    });
    await expect(page.locator('.d-block.fa')).toBeVisible(); // thumbs up graphic
    await expect(page.locator('h1')).toContainText('Thank You!');
    await expect(page.locator('#wrap')).toContainText(
      'Your message has been sent successfully',
    );
    await expect(page.locator('#wrap')).toContainText(
      'We will get back to you shortly.',
    );
  });
});
