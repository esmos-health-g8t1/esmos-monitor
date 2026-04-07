import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Shop Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Shop | My Website');
  });

  test('should have a search bar', async ({ page }) => {
    const searchInput = page.getByRole('search');
    await expect(searchInput).toBeVisible();
  });

  test('should have sorting options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Featured' })).toBeVisible();
    await page.getByRole('button', { name: 'Featured' }).click();

    await expect(
      page.getByRole('menuitem', { name: 'Featured' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Newest Arrivals' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Name (A-Z)' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Price - Low to High' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Price - High to Low' }),
    ).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    const productGrid = page.locator('#products_grid');
    await expect(productGrid).toBeVisible();
  });

  test('should have 13 products on display', async ({ page }) => {
    const products = page.locator('.oe_product');
    await expect(products).toHaveCount(13);
  });

  test('should display correct products', async ({ page }) => {
    const productNames = [
      'Low Carb meal plan',
      'Weight Loss Wonders',
      'Superfood Boost',
      'Plant-Based Meal Plan',
      'Office Lunch Box',
      'Meal Prep Made Simple',
      'Low Carb Meal Plan',
      'Diabetic-Friendly Meal Plan',
      'Detox Plan',
      "Athlete's Power Pack",
      'Gluten-Free Meal Plan',
      'Heart-Healthy Plan',
      'Keto Kickstart Plan',
    ];

    for (const productName of productNames) {
      await expect(page.getByText(productName, { exact: true })).toBeVisible();
    }
  });

  test('should display correct product details for all items', async ({
    page,
  }) => {
    const products = [
      { name: 'Low Carb meal plan', price: '50.00' },
      { name: 'Weight Loss Wonders', price: '47.00' },
      { name: 'Superfood Boost', price: '60.00' },
      { name: 'Plant-Based Meal Plan', price: '42.00' },
      { name: 'Office Lunch Box', price: '70.00' },
      { name: 'Meal Prep Made Simple', price: '39.00' },
      { name: 'Low Carb Meal Plan', price: '50.00' },
      { name: 'Diabetic-Friendly Meal Plan', price: '52.00' },
      { name: 'Detox Plan', price: '50.00' },
      { name: "Athlete's Power Pack", price: '49.00' },
      { name: 'Gluten-Free Meal Plan', price: '43.00' },
      { name: 'Heart-Healthy Plan', price: '45.00' },
      { name: 'Keto Kickstart Plan', price: '36.00' },
    ];

    for (const product of products) {
      await page.goto('/shop');

      await page
        .getByRole('heading', { name: product.name, exact: true })
        .getByRole('link')
        .click();

      // product name
      await expect(
        page.getByRole('heading', { name: product.name }),
      ).toBeVisible();

      // product price
      await expect(page.getByText('$').first()).toBeVisible();
      await expect(page.getByText('$').first()).toContainText(product.price);

      // product img
      await expect(page.getByRole('img', { name: product.name })).toBeVisible();
    }
  });

  test('checkout should be partially successful', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    // select/search for items and add to cart
    // first product
    await page.getByRole('button', { name: 'Featured' }).click();
    await page.getByRole('menuitem', { name: 'Price - Low to High' }).click();
    await page.getByText('Meal Prep Made Simple').click();
    await page.getByRole('button', { name: ' Add to cart' }).click();

    // second product
    await page.getByRole('link', { name: 'All Products' }).click();
    await page.getByRole('button', { name: 'Featured' }).click();
    await page.getByRole('menuitem', { name: 'Price - High to Low' }).click();
    await page.getByText('Office Lunch Box').click();
    await page.getByRole('button', { name: ' Add to cart' }).click();

    // third product
    await page.getByRole('link', { name: 'All Products' }).click();
    await page.getByRole('button', { name: 'Featured' }).click();
    await page.getByRole('menuitem', { name: 'Name (A-Z)' }).click();
    await page.getByText("Athlete's Power Pack").click();
    await page.getByRole('button', { name: ' Add to cart' }).click();

    // view cart
    await page.getByRole('button', { name: 'View cart' }).click();
    await expect(page.locator('#order_total')).toContainText('$ 181.70');
    await page.getByRole('button', { name: 'Checkout ' }).click();

    // fill in checkout from
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john.doe@gmail.com');
    await page.locator('input[name="phone"]').fill('89898989');
    await page.locator('input[name="company_name"]').fill('Microsoft');
    await page.locator('input[name="vat"]').fill('test');
    await page.locator('input[name="street"]').fill('Redmond, Washington');
    await page.locator('input[name="street2"]').fill('Presidential Suite');
    await page.locator('input[name="street"]').click();
    await page.locator('input[name="street"]').fill('10 Bayfront Avenue');
    await page.locator('input[name="company_name"]').fill('Marina Bay Sands');
    await page.locator('input[name="city"]').fill('Singapore');
    await page.locator('input[name="zip"]').fill('100000');
    await page.getByLabel('Country').selectOption('197');
    await page.getByRole('button', { name: 'Continue checkout ' }).click();

    // payment
    await expect(page.locator('#shipping_and_billing')).toContainText(
      '10 Bayfront Avenue, Presidential Suite, Singapore 100000, Singapore',
    );
    await page
      .getByRole('textbox', { name: 'Payment Details (test data)' })
      .fill('8989 8989 8989 8989');
    await page
      .getByRole('checkbox', { name: 'Save my payment details' })
      .check();
    await page
      .getByRole('button', { name: 'Order summary 3  item(s) -  $' })
      .click();
    await expect(
      page.getByRole('img', { name: 'Meal Prep Made Simple' }),
    ).toBeVisible();
    await expect(page.locator('#cart_products')).toContainText(
      '1 x Meal Prep Made Simple',
    );
    await expect(page.locator('#cart_products')).toContainText('$ 39.00');
    await expect(
      page.getByRole('img', { name: 'Office Lunch Box' }),
    ).toBeVisible();
    await expect(page.locator('#cart_products')).toContainText(
      '1 x Office Lunch Box',
    );
    await expect(page.locator('#cart_products')).toContainText('$ 70.00');
    await expect(
      page.getByRole('img', { name: "Athlete's Power Pack" }),
    ).toBeVisible();
    await expect(page.locator('#cart_products')).toContainText(
      "1 x Athlete's Power Pack",
    );
    await expect(page.locator('#cart_products')).toContainText('$ 49.00');
    await expect(page.locator('#order_total')).toContainText('$ 181.70');
    await page.getByRole('button', { name: 'Pay now' }).click();
    // end of checkout, no handler for payments
  });
});
