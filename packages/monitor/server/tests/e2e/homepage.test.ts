import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Homepage', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title and url', async ({ page }) => {
    await expect(page).toHaveTitle('Home | My Website');
    await expect(page).toHaveURL(process.env.APP_URL!);
  });

  test('header should have all elements', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Logo of My Website' }),
    ).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Home' })).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Services' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Contact us' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'eCommerce cart' }),
    ).toBeVisible();
    await expect(page.getByLabel('Main').getByTitle('Search')).toBeVisible();
    await expect(page.getByRole('link', { name: ' +65-' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Contact Us', exact: true }),
    ).toBeVisible();
  });

  test.describe('main content should have complete elements', () => {
    test('hero section', async ({ page }) => {
      // hero section
      await expect(page.locator('h1')).toContainText(
        'Healthy Eating Made Easy',
      );
      await expect(page.locator('#wrap')).toContainText(
        'Explore our diverse menu that caters to various dietary preferences, including vegan, gluten-free, and low-carb options. We believe in providing meals that not only taste great but also nourish your body.',
      );
      await expect(
        page.getByRole('link', { name: 'Get in touch' }),
      ).toBeVisible();
    });

    test('section 2', async ({ page }) => {
      // section 2
      await expect(
        page
          .locator('section')
          .filter({ hasText: 'Your Meal, Your Way We offer' })
          .locator('img'),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Your Meal, Your Way' }),
      ).toBeVisible();
      await expect(page.locator('#wrap')).toContainText(
        'We offer a wide range of meal options, from gourmet dinners to healthy lunches, all prepared with fresh ingredients. Our goal is to make healthy eating accessible and enjoyable for everyone.',
      );
    });

    test('section 3', async ({ page }) => {
      await page.getByText('Start with the flavors –').click();
      await expect(page.locator('#wrap')).toContainText(
        'Start with the flavors – understand what delights your taste buds and deliver it with every meal.',
      );
      await expect(page.locator('#wrap')).toContainText(
        'Ask our GenAI powered ESMOS helpdesk a question about customizing your meals',
      );
      await expect(
        page.getByRole('link', { name: 'Ask us a question' }),
      ).toBeVisible();
    });

    test('carousel', async ({ page }) => {
      await expect(
        page
          .locator('section')
          .filter({ hasText: 'Your Dynamic Snippet will be' }),
      ).toBeVisible();
    });

    test('footer should have complete elements', async ({ page }) => {
      await expect(page.locator('#wrap')).toContainText('Flexible meal plans');
      await expect(page.locator('#wrap')).toContainText('Delicious meals');
      await expect(page.locator('#wrap')).toContainText('Incredible recipes');
      await expect(page.locator('#wrap')).toContainText('Meals delivered');
      await expect(page.getByText('Useful Links Home About us')).toBeVisible();
      await expect(
        page.getByText('About us Everyday Sustainable'),
      ).toBeVisible();
      await expect(page.getByText('Connect with us Contact us')).toBeVisible();
    });
  });
});
