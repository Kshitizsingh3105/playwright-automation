const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  workers: 1,
  retries: 0,

  // ✅ Global test timeout — 3 minutes per test
  timeout: 180000,

  reporter: [['html', { open: 'on-failure' }], ['list']],

  use: {
    baseURL: 'https://curatrail-admin-main.vercel.app',
    headless: false,
    launchOptions: {
      slowMo: 500,
    },
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 120000,
    navigationTimeout: 120000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});