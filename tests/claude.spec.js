// AutomationExercise.com – Signup & Delete Account Flow
// Test Case: New User Registration (Steps 1–18)
// File: tests/signup.spec.js
// Run: npx playwright test tests/signup.spec.js --headed

const { test, expect } = require('@playwright/test');

// ─── Test Data ────────────────────────────────────────────────────────────────
const USER = {
  name        : 'John Tester',
  email       : `johntester${Date.now()}@gmail.com`, // unique email every run
  password    : 'Test@1234',
  title       : 'Mr',                 // 'Mr' or 'Mrs'
  day         : '15',
  month       : 'August',
  year        : '1995',
  firstName   : 'John',
  lastName    : 'Tester',
  company     : 'Test Corp',
  address1    : '123 Main Street',
  address2    : 'Apt 4B',
  country     : 'United States',
  state       : 'California',
  city        : 'Los Angeles',
  zipcode     : '90001',
  mobileNumber: '9876543210',
};

// ─── Test ─────────────────────────────────────────────────────────────────────
test('TC_SIGNUP_001 – Register new user and delete account', async ({ page }) => {

  // ── STEP 1: Launch browser ──────────────────────────────────────────────────
  // (Playwright handles browser launch automatically)
  console.log('✅ Step 1: Browser launched');


  // ── STEP 2: Navigate to automationexercise.com ──────────────────────────────
  await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });
  console.log('✅ Step 2: Navigated to http://automationexercise.com');


  // ── STEP 3: Verify Home Page is visible ─────────────────────────────────────
  await expect(page).toHaveURL(/automationexercise\.com/);
  await expect(page.locator('img[src="/static/images/home/logo.png"]')).toBeVisible();
  await expect(page.locator('a:has-text("Home")')).toBeVisible();
  console.log('✅ Step 3: Home page is visible');


  // ── STEP 4: Click 'Signup / Login' button ───────────────────────────────────
  await page.locator('a:has-text("Signup / Login")').click();
  await expect(page).toHaveURL(/login/);
  console.log('✅ Step 4: Clicked Signup / Login button');


  // ── STEP 5: Verify 'New User Signup!' is visible ────────────────────────────
  await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
  console.log('✅ Step 5: "New User Signup!" is visible');


  // ── STEP 6: Enter name and email address ────────────────────────────────────
  await page.locator('input[data-qa="signup-name"]').fill(USER.name);
  await page.locator('input[data-qa="signup-email"]').fill(USER.email);
  console.log(`✅ Step 6: Entered Name="${USER.name}" and Email="${USER.email}"`);


  // ── STEP 7: Click 'Signup' button ───────────────────────────────────────────
  await page.locator('button[data-qa="signup-button"]').click();
  await expect(page).toHaveURL(/signup/);
  console.log('✅ Step 7: Clicked Signup button');


  // ── STEP 8: Verify 'ENTER ACCOUNT INFORMATION' is visible ───────────────────
  await expect(
    page.locator('b:has-text("Enter Account Information"), h2:has-text("Enter Account Information")')
      .first()
  ).toBeVisible({ timeout: 8000 });
  console.log('✅ Step 8: "ENTER ACCOUNT INFORMATION" is visible');


  // ── STEP 9: Fill Title, Name, Email, Password, Date of Birth ────────────────

  // Title (Mr / Mrs radio button)
  if (USER.title === 'Mr') {
    await page.locator('input#id_gender1').check();   // Mr
  } else {
    await page.locator('input#id_gender2').check();   // Mrs
  }

  // Name (pre-filled, verify it)
  await expect(page.locator('input#name')).toHaveValue(USER.name);

  // Email (pre-filled, verify it)
  await expect(page.locator('input#email')).toHaveValue(USER.email);

  // Password
  await page.locator('input#password').fill(USER.password);

  // Date of Birth
  await page.locator('select#days').selectOption(USER.day);
  await page.locator('select#months').selectOption(USER.month);
  await page.locator('select#years').selectOption(USER.year);

  console.log('✅ Step 9: Filled Title, Name, Email, Password, Date of Birth');


  // ── STEP 10: Select 'Sign up for our newsletter!' checkbox ──────────────────
  const newsletterCheckbox = page.locator('input#newsletter');
  if (!(await newsletterCheckbox.isChecked())) {
    await newsletterCheckbox.check();
  }
  await expect(newsletterCheckbox).toBeChecked();
  console.log('✅ Step 10: Checked "Sign up for our newsletter!"');


  // ── STEP 11: Select 'Receive special offers from our partners!' checkbox ─────
  const offersCheckbox = page.locator('input#optin');
  if (!(await offersCheckbox.isChecked())) {
    await offersCheckbox.check();
  }
  await expect(offersCheckbox).toBeChecked();
  console.log('✅ Step 11: Checked "Receive special offers from our partners!"');


  // ── STEP 12: Fill Address Information ───────────────────────────────────────
  await page.locator('input#first_name').fill(USER.firstName);
  await page.locator('input#last_name').fill(USER.lastName);
  await page.locator('input#company').fill(USER.company);
  await page.locator('input#address1').fill(USER.address1);
  await page.locator('input#address2').fill(USER.address2);
  await page.locator('select#country').selectOption(USER.country);
  await page.locator('input#state').fill(USER.state);
  await page.locator('input#city').fill(USER.city);
  await page.locator('input#zipcode').fill(USER.zipcode);
  await page.locator('input#mobile_number').fill(USER.mobileNumber);
  console.log('✅ Step 12: Filled First name, Last name, Company, Address, Country, State, City, Zipcode, Mobile');


  // ── STEP 13: Click 'Create Account' button ──────────────────────────────────
  await page.locator('button[data-qa="create-account"]').click();
  console.log('✅ Step 13: Clicked "Create Account" button');


  // ── STEP 14: Verify 'ACCOUNT CREATED!' is visible ───────────────────────────
  await expect(
    page.locator('b:has-text("Account Created!"), h2:has-text("Account Created!")').first()
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ Step 14: "ACCOUNT CREATED!" is visible');


  // ── STEP 15: Click 'Continue' button ────────────────────────────────────────
  await page.locator('a[data-qa="continue-button"]').click();
  console.log('✅ Step 15: Clicked "Continue" button');


  // ── STEP 16: Verify 'Logged in as <username>' is visible ────────────────────
  await expect(
    page.locator(`a:has-text("Logged in as"), li:has-text("Logged in as")`)
  ).toBeVisible({ timeout: 8000 });

  // Also check the actual username is correct
  await expect(
    page.locator(`a:has-text("${USER.name}"), li:has-text("${USER.name}")`)
  ).toBeVisible({ timeout: 5000 });
  console.log(`✅ Step 16: "Logged in as ${USER.name}" is visible`);


  // ── STEP 17: Click 'Delete Account' button ──────────────────────────────────
  await page.locator('a:has-text("Delete Account")').click();
  console.log('✅ Step 17: Clicked "Delete Account" button');


  // ── STEP 18: Verify 'ACCOUNT DELETED!' and click 'Continue' ─────────────────
  await expect(
    page.locator('b:has-text("Account Deleted!"), h2:has-text("Account Deleted!")').first()
  ).toBeVisible({ timeout: 10000 });
  console.log('✅ Step 18: "ACCOUNT DELETED!" is visible');

  await page.locator('a[data-qa="continue-button"]').click();
  await expect(page).toHaveURL(/automationexercise\.com/);
  console.log('✅ Step 18: Clicked Continue – redirected to Home');

});