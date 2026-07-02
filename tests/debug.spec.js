const { test, expect } = require('@playwright/test');

test('debug basic browser', async ({ page }) => {
  console.log('Starting browser test...');
  try {
    await page.goto('https://e-commerce-mern-tsk.netlify.app', { timeout: 30000, waitUntil: 'domcontentloaded' });
    console.log('Page loaded, URL:', page.url());
    console.log('Title:', await page.title());
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText.length);
    console.log('Body (first 500 chars):', bodyText.substring(0, 500));
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack?.substring(0, 500));
  }
});

test('debug fetch API', async () => {
  // Test backend API directly using fetch
  console.log('Testing API...');
  try {
    const response = await fetch('https://e-commerce-new-n4qx.onrender.com/api/products');
    console.log('API status:', response.status);
    const data = await response.json();
    console.log('Products count:', Array.isArray(data) ? data.length : Object.keys(data));
  } catch (e) {
    console.error('API Error:', e.message);
  }
});
