import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Services Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/our-services');
  });

  test('should load the services page with correct title and header', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Services | My Website');
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
  });

  test('should display three cards with correct content', async ({ page }) => {
    await expect(page.locator('img').nth(2)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Fresh Ingredients' }),
    ).toBeVisible();
    await expect(page.locator('#wrap')).toContainText(
      'Customize your meal plan to fit your dietary needs. Choose from a variety of options to suit your lifestyle.',
    );
    await expect(page.locator('img').nth(3)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Seasonal Specials' }),
    ).toBeVisible();
    await expect(page.locator('#wrap')).toContainText(
      'To add a fourth meal option, adjust the sizes of these three options using the right icon. Then, duplicate one of the meal choices to create a new one.',
    );
    await expect(page.locator('img').nth(4)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Quick Meal Prep' }),
    ).toBeVisible();
    await expect(page.locator('#wrap')).toContainText(
      'Replace the above image with a vibrant photo of our delicious meals. Click to adjust the image style.',
    );
  });

  test('should display quotes carousel', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.carousel-item.active');

    await expect(page.getByText('"The best meal delivery')).toBeVisible();
    await expect(page.getByText('Jane DOE • CEO of Gourmet')).toBeVisible();
    await page.locator('.carousel-control-next-icon').click();
    await expect(page.getByText('Jane DOE • CEO of Gourmet')).toBeHidden();

    await expect(page.getByText('" Healthy meals delivered')).toBeVisible();
    await expect(page.getByText('David Johnson • Founder of')).toBeVisible();
    await page.locator('.carousel-control-next-icon').click();
    await expect(page.getByText('David Johnson • Founder of')).toBeHidden();

    await expect(page.getByText('" Perfectly portioned,')).toBeVisible();
    await expect(page.getByText('Iris SMITH • Head Chef at')).toBeVisible();
  });

  test('should display happy customers section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Our Happy Customers' }),
    ).toBeVisible();
    await expect(page.locator('#wrap')).toContainText(
      'Join our community of food lovers.',
    );
    // There are 6 images in the row
    const referencesSection = page.locator('section.s_references');
    await expect(referencesSection).toBeVisible();
    const customerImages = referencesSection.locator('img');
    await expect(customerImages).toHaveCount(6);
  });
});
