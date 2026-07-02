const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[${msg.type()}]`, msg.text()));
  page.on('pageerror', err => console.log('[PAGE ERROR]', err.message));

  try {
    // Step 1: Go to login page
    console.log('\n=== STEP 1: Go to login page ===');
    await page.goto('https://e-commerce-mern-tsk.netlify.app/login', { timeout: 30000, waitUntil: 'networkidle' });
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Step 2: Check for login button
    console.log('\n=== STEP 2: Check login button ===');
    const loginBtn = page.getByRole('button', { name: 'Login', exact: true });
    console.log('Button visible:', await loginBtn.isVisible());
    console.log('Button HTML:', await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn ? btn.outerHTML : 'no button found';
    }));

    // Step 3: Fill credentials
    console.log('\n=== STEP 3: Fill credentials ===');
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Step 4: Click login
    console.log('\n=== STEP 4: Click login ===');
    await loginBtn.click();
    await page.waitForTimeout(5000);
    console.log('URL after login:', page.url());

    // Step 5: Check localStorage
    console.log('\n=== STEP 5: Check localStorage ===');
    const authUser = await page.evaluate(() => localStorage.getItem('authUser'));
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    console.log('authUser:', authUser ? authUser.substring(0, 300) : 'null');
    console.log('authToken:', authToken ? authToken.substring(0, 50) : 'null');

    // Step 6: Check nav text
    console.log('\n=== STEP 6: Check nav text ===');
    const nav = page.locator('nav');
    console.log('Nav visible:', await nav.isVisible());
    console.log('Nav text:', await nav.textContent());

  } catch (e) {
    console.error('ERROR:', e.message);
  }

  await browser.close();
})();
