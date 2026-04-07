import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';

test.describe('Login Flow', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.describe('Page Elements', () => {
    test('should have a functional sign-in link and valid form fields', async ({
      page,
    }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(`${process.env.APP_URL}/web/login`);
      await expect(page.getByRole('form')).toBeVisible();

      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await expect(emailInput).toHaveAttribute('type', 'text');
      await expect(emailInput).toHaveAttribute('placeholder', 'Email');

      const passwordInput = page.getByRole('textbox', { name: 'Password' });
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Multi-Role Authentication', () => {
    const USERS = [
      { role: 'System Configurator', email: 'sysconfig@esmos.meals.sg' },
      { role: 'Product Manager', email: 'prodmanager@esmos.meals.sg' },
      { role: 'Data Manager', email: 'datamanager@esmos.meals.sg' },
      { role: 'Security Manager', email: 'security@esmos.meals.sg' },
      { role: 'support', email: 'support@esmos.meals.sg' },
    ];

    for (const user of USERS) {
      test(`${user.role} should be able to log in`, async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/web/login');

        await page.getByRole('link', { name: 'Sign in' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
        await page
          .getByRole('textbox', { name: 'Password' })
          .fill(process.env.ADMIN_PASSWORD!);
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.waitForURL(
          `${process.env.APP_URL}/web#action=117&cids=1&menu_id=74`,
          { timeout: 30000 },
        );
        await expect(page.getByTitle('Home Menu')).toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Messages' }),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Activities' }),
        ).toBeVisible();
        await page.getByTitle('Home Menu').click();
        await page.getByRole('menuitem', { name: 'Website' }).click();
        await expect(
          page
            .locator('iframe')
            .nth(1)
            .contentFrame()
            .getByLabel('Main')
            .getByRole('list'),
        ).toContainText(user.role);
      });
    }
  });
});
