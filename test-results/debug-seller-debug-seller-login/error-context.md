# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: debug-seller.spec.js >> debug seller login
- Location: tests\debug-seller.spec.js:3:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('nav')

```

# Test source

```ts
  1  | const { test } = require('@playwright/test');
  2  | 
  3  | test('debug seller login', async ({ page }) => {
  4  |   const logs = [];
  5  |   page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  6  |   page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));
  7  | 
  8  |   // Step 1: Go to login page
  9  |   await page.goto('/login');
  10 |   await page.waitForSelector('button:has-text("Login")', { timeout: 15000 });
  11 |   logs.push(`Step 1 - URL: ${page.url()}`);
  12 | 
  13 |   // Step 2: Fill in seller credentials
  14 |   await page.fill('input[type="email"]', 'seller@example.com');
  15 |   await page.fill('input[type="password"]', 'password123');
  16 |   logs.push('Step 2 - Filled credentials');
  17 | 
  18 |   // Step 3: Click login and wait
  19 |   await page.getByRole('button', { name: 'Login', exact: true }).click();
  20 |   await page.waitForTimeout(5000);
  21 |   logs.push(`Step 3 - URL after login: ${page.url()}`);
  22 | 
  23 |   // Step 4: Check page content
  24 |   const bodyText = await page.locator('body').textContent();
  25 |   logs.push(`Step 4 - Body text: ${bodyText.substring(0, 500)}`);
  26 | 
  27 |   // Check local storage
  28 |   const authUser = await page.evaluate(() => localStorage.getItem('authUser'));
  29 |   const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
  30 |   logs.push(`Step 5 - authUser: ${authUser?.substring(0, 200)}`);
  31 |   logs.push(`Step 5 - authToken: ${authToken?.substring(0, 50)}`);
  32 | 
  33 |   // Step 6: Navigate to homepage and check nav
  34 |   await page.goto('/');
  35 |   await page.waitForTimeout(3000);
> 36 |   const navText = await page.locator('nav').textContent();
     |                                             ^ Error: locator.textContent: Test timeout of 120000ms exceeded.
  37 |   logs.push(`Step 6 - Nav text on homepage: ${navText.substring(0, 200)}`);
  38 | 
  39 |   console.log('\n=== DEBUG LOGS ===');
  40 |   logs.forEach(l => console.log(l));
  41 | });
  42 | 
```