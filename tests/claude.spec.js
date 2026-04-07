// AutomationExercise.com – Login & Delete Account Flow (Fixed)
// File: tests/login_delete.spec.js
// Run: npx playwright test tests/login_delete.spec.js --headed

const { test, expect } = require('@playwright/test');

// ─── Test Data ────────────────────────────────────────────────────────────────
const USER = {
  name    : 'John Tester',           // ← your registered username
  email   : 'johntester@gmail.com',  // ← your registered email
  password: 'Test@1234',             // ← your password
};

// ─── Test ─────────────────────────────────────────────────────────────────────
test('TC_LOGIN_DELETE_001 – Login with valid credentials and delete account', async ({ page }) => {

  // ── STEP 1: Launch browser ──────────────────────────────────────────────────
  console.log('✅ Step 1: Browser launched');


  // ── STEP 2: Navigate to automationexercise.com ──────────────────────────────
  await page.goto('http://automationexercise.com', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✅ Step 2: Navigated to http://automationexercise.com');


  // ── STEP 3: Verify that home page is visible successfully ───────────────────
  await expect(page).toHaveURL(/automationexercise\.com/);
  await expect(
    page.locator('img[src="/static/images/home/logo.png"]')
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ Step 3: Home page is visible successfully');


  // ── STEP 4: Click on 'Signup / Login' button ────────────────────────────────
  await page.locator('a:has-text("Signup / Login")').click();
  await page.waitForURL(/login/, { timeout: 10000 });
  console.log('✅ Step 4: Clicked "Signup / Login" button');


  // ── STEP 5: Verify 'Login to your account' is visible ───────────────────────
  await expect(
    page.locator('h2:has-text("Login to your account")')
  ).toBeVisible({ timeout: 8000 });
  console.log('✅ Step 5: "Login to your account" is visible');


  // ── STEP 6: Enter correct email address and password ────────────────────────
  await page.locator('input[data-qa="login-email"]').fill(USER.email);
  await page.locator('input[data-qa="login-password"]').fill(USER.password);
  console.log(`✅ Step 6: Entered Email="${USER.email}" and Password`);


  // ── STEP 7: Click 'Login' button ────────────────────────────────────────────
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
    page.locator('button[data-qa="login-button"]').click(),
  ]);
  console.log('✅ Step 7: Clicked "Login" button');


  // ── STEP 8: Verify 'Logged in as username' is visible ───────────────────────
  // Actual HTML on site:
  // <li><a href="#"><i class="fa fa-user"></i> Logged in as <b>Username</b></a></li>
  await expect(
    page.locator('li').filter({ hasText: 'Logged in as' })
  ).toBeVisible({ timeout: 10000 });
  console.log(`✅ Step 8: "Logged in as ${USER.name}" is visible`);


  // ── STEP 9: Click 'Delete Account' button ───────────────────────────────────
  await page.locator('a:has-text("Delete Account")').click();
  console.log('✅ Step 9: Clicked "Delete Account" button');


  // ── STEP 10: Verify 'ACCOUNT DELETED!' is visible ───────────────────────────
  await expect(
    page.locator('b:has-text("Account Deleted!")').first()
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ Step 10: "ACCOUNT DELETED!" is visible');

  await page.locator('a[data-qa="continue-button"]').click();
  await expect(page).toHaveURL(/automationexercise\.com/, { timeout: 8000 });
  console.log('✅ Clicked Continue – redirected back to Home page');

});
