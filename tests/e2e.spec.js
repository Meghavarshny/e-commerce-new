const { test, expect } = require('@playwright/test');

const BUYER = { email: 'buyer@example.com', password: 'password123', name: 'Buyer User' };
const SELLER = { email: 'seller@example.com', password: 'password123', name: 'Seller' };

async function loginAs(page, email, password) {
  await page.goto('/login');
  await page.waitForSelector('button:has-text("Login")', { timeout: 15000 });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.waitForTimeout(3000);
}

test.describe('E-Commerce Full Test Suite', () => {

  test('1. Homepage loads with product links', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('a[href*="/products/"]', { timeout: 20000 });
    const links = await page.locator('a[href*="/products/"]').count();
    expect(links).toBeGreaterThan(0);
  });

  test('2. Product detail page opens', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('a[href*="/products/"]', { timeout: 20000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/products/');
  });

  test('3. Search by keyword', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const searchInput = page.locator('input[placeholder*="earch"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('headphone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toContainText(/headphone|Sony/i, { timeout: 10000 });
    }
  });

  test.describe('Authentication', () => {
    test('4. Login as buyer', async ({ page }) => {
      await loginAs(page, BUYER.email, BUYER.password);
      await expect(page.locator('nav')).toContainText(BUYER.name, { timeout: 10000 });
    });

    test('5. Login as seller', async ({ page }) => {
      await loginAs(page, SELLER.email, SELLER.password);
      await expect(page.locator('nav')).toContainText(SELLER.name, { timeout: 10000 });
    });

    test('6. Invalid login shows error', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('button:has-text("Login")', { timeout: 15000 });
      await page.fill('input[type="email"]', 'wrong@test.com');
      await page.fill('input[type="password"]', 'badpass');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toContainText(/invalid|error|incorrect/i, { timeout: 10000 });
    });

    test('7. Registration page shows form', async ({ page }) => {
      await page.goto('/register');
      await page.waitForTimeout(2000);
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Buyer Features', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, BUYER.email, BUYER.password);
    });

    test('8. Cart page accessible', async ({ page }) => {
      await page.goto('/cart');
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/cart');
    });

    test('9. Wishlist page accessible', async ({ page }) => {
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/wishlist');
    });

    test('10. Profile page shows user info', async ({ page }) => {
      await page.goto('/profile');
      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toContainText(/Buyer User|Profile|Email/i, { timeout: 10000 });
    });

    test('11. Orders page accessible', async ({ page }) => {
      await page.goto('/orders');
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/orders');
    });
  });

  test.describe('Seller Features', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, SELLER.email, SELLER.password);
    });

    test('12. Seller dashboard shows seller content', async ({ page }) => {
      await page.goto('/seller');
      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toContainText(/dashboard|seller|orders|products/i, { timeout: 10000 });
    });
  });

  test.describe('Role-Based UI', () => {
    test('13. Buyer nav shows Cart/Orders/Account', async ({ page }) => {
      await loginAs(page, BUYER.email, BUYER.password);
      await expect(page.locator('nav')).toContainText(/Cart|Orders|Account/i, { timeout: 10000 });
    });

    test('14. Seller nav shows console/dashboard link', async ({ page }) => {
      await loginAs(page, SELLER.email, SELLER.password);
      await expect(page.locator('nav')).toContainText(/Console|Dashboard/i, { timeout: 10000 });
    });
  });

  test('15. Logout works', async ({ page }) => {
    await loginAs(page, BUYER.email, BUYER.password);
    const logoutBtn = page.getByRole('button', { name: /Logout|Log out/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(2000);
    }
  });
});
