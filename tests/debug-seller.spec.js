const { test } = require('@playwright/test');

test('debug seller login', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));

  // Step 1: Go to login page
  await page.goto('/login');
  await page.waitForSelector('button:has-text("Login")', { timeout: 15000 });
  logs.push(`Step 1 - URL: ${page.url()}`);

  // Step 2: Fill in seller credentials
  await page.fill('input[type="email"]', 'seller@example.com');
  await page.fill('input[type="password"]', 'password123');
  logs.push('Step 2 - Filled credentials');

  // Step 3: Click login and wait
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.waitForTimeout(5000);
  logs.push(`Step 3 - URL after login: ${page.url()}`);

  // Step 4: Check page content
  const bodyText = await page.locator('body').textContent();
  logs.push(`Step 4 - Body text: ${bodyText.substring(0, 500)}`);

  // Check local storage
  const authUser = await page.evaluate(() => localStorage.getItem('authUser'));
  const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
  logs.push(`Step 5 - authUser: ${authUser?.substring(0, 200)}`);
  logs.push(`Step 5 - authToken: ${authToken?.substring(0, 50)}`);

  // Step 6: Navigate to homepage and check nav
  await page.goto('/');
  await page.waitForTimeout(3000);
  const navText = await page.locator('nav').textContent();
  logs.push(`Step 6 - Nav text on homepage: ${navText.substring(0, 200)}`);

  console.log('\n=== DEBUG LOGS ===');
  logs.forEach(l => console.log(l));
});
