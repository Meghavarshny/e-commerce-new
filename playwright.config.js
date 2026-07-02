const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: 'https://e-commerce-mern-tsk.netlify.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    launchOptions: {
      channel: 'chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
});
