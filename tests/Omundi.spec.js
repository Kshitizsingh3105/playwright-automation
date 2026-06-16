const { test, expect } = require('@playwright/test');

// ─── CONFIG ───────────────────────────────────────────────
const URL      = 'https://omundi-supplier-frontend.vercel.app/login?redirect=%2F';
const EMAIL    = 'sudhanshu+505@wartinlabs.com';
const PASSWORD = 'Test@123';

// ─── SELECTORS ────────────────────────────────────────────
const EMAIL_FIELD    = 'input[placeholder="supplier@example.com"]';
const PASSWORD_FIELD = 'input[type="password"]';
const LOGIN_BUTTON   = 'button:has-text("Login")';
const REMEMBER_ME    = 'input[type="checkbox"]';

// ─── OPEN LOGIN PAGE BEFORE EACH TEST ─────────────────────
test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
});

// ══════════════════════════════════════════════════════════
//  PAGE LOAD TESTS
// ══════════════════════════════════════════════════════════

test('TC01 - Login page loads with all elements', async ({ page }) => {
  await expect(page).toHaveTitle(/Omundi/i);
  await expect(page.locator(EMAIL_FIELD)).toBeVisible();
  await expect(page.locator(PASSWORD_FIELD)).toBeVisible();
  await expect(page.locator(LOGIN_BUTTON)).toBeVisible();
  await expect(page.locator(REMEMBER_ME)).toBeVisible();
  await expect(page.getByText('Forgot Password?')).toBeVisible();
  await expect(page.getByText('Create Account')).toBeVisible();

  console.log('✅ TC01 PASSED - All login page elements visible');
});

test('TC02 - Page title and branding is correct', async ({ page }) => {
  const title = await page.title();
  console.log('   Page title:', title);
  expect(title).toMatch(/Omundi/i);

  await expect(page.locator('img').first()).toBeVisible();
  console.log('✅ TC02 PASSED - Branding correct');
});

// ══════════════════════════════════════════════════════════
//  LOGIN TESTS
// ══════════════════════════════════════════════════════════

test('TC03 - Valid credentials login successfully', async ({ page }) => {
  await page.fill(EMAIL_FIELD, EMAIL);
  await page.fill(PASSWORD_FIELD, PASSWORD);

  await expect(page.locator(LOGIN_BUTTON)).toBeEnabled({ timeout: 5000 });
  await page.locator(LOGIN_BUTTON).click();

  console.log('⏳ Waiting for redirect after login...');
  await page.waitForURL(u => !u.toString().includes('login'), { timeout: 30000 })
    .catch(() => {});

  const finalUrl = page.url();
  console.log('   Landed on:', finalUrl);
  expect(finalUrl).not.toContain('login');
  console.log('✅ TC03 PASSED - Login successful');
});

test('TC04 - Wrong password shows error', async ({ page }) => {
  await page.fill(EMAIL_FIELD, EMAIL);
  await page.fill(PASSWORD_FIELD, 'WrongPassword@999');

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(3000);

  expect(page.url()).toContain('login');
  console.log('✅ TC04 PASSED - Wrong password blocked');
});

test('TC05 - Wrong email shows error', async ({ page }) => {
  await page.fill(EMAIL_FIELD, 'fakeuser@fake-domain.com');
  await page.fill(PASSWORD_FIELD, PASSWORD);

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(3000);

  expect(page.url()).toContain('login');
  console.log('✅ TC05 PASSED - Wrong email blocked');
});

test('TC06 - Empty form cannot be submitted', async ({ page }) => {
  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(2000);

  expect(page.url()).toContain('login');
  console.log('✅ TC06 PASSED - Empty form not submitted');
});

test('TC07 - Email only — cannot login without password', async ({ page }) => {
  await page.fill(EMAIL_FIELD, EMAIL);
  // Password left empty

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(2000);

  expect(page.url()).toContain('login');
  console.log('✅ TC07 PASSED - Email only blocked');
});

test('TC08 - Password only — cannot login without email', async ({ page }) => {
  await page.fill(PASSWORD_FIELD, PASSWORD);
  // Email left empty

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(2000);

  expect(page.url()).toContain('login');
  console.log('✅ TC08 PASSED - Password only blocked');
});

// ══════════════════════════════════════════════════════════
//  FIELD VALIDATION TESTS
// ══════════════════════════════════════════════════════════

test('TC09 - Password field is masked', async ({ page }) => {
  const type = await page.locator(PASSWORD_FIELD).getAttribute('type');
  expect(type).toBe('password');
  console.log('✅ TC09 PASSED - Password masked, type =', type);
});

test('TC10 - Invalid email format is rejected', async ({ page }) => {
  await page.fill(EMAIL_FIELD, 'notavalidemail');
  await page.fill(PASSWORD_FIELD, PASSWORD);

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(2000);

  expect(page.url()).toContain('login');
  console.log('✅ TC10 PASSED - Invalid email format rejected');
});

test('TC11 - SQL injection is rejected', async ({ page }) => {
  await page.fill(EMAIL_FIELD, "' OR 1=1; --");
  await page.fill(PASSWORD_FIELD, "' OR 1=1; --");

  await page.locator(LOGIN_BUTTON).click();
  await page.waitForTimeout(3000);

  expect(page.url()).toContain('login');
  console.log('✅ TC11 PASSED - SQL injection blocked');
});

// ══════════════════════════════════════════════════════════
//  REMEMBER ME TESTS
// ══════════════════════════════════════════════════════════

test('TC12 - Remember me checkbox works correctly', async ({ page }) => {
  const checkbox = page.locator(REMEMBER_ME);

  // Initially unchecked
  await expect(checkbox).not.toBeChecked();

  // Check it
  await checkbox.click();
  await expect(checkbox).toBeChecked();

  // Uncheck it
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();

  console.log('✅ TC12 PASSED - Remember me checkbox works correctly');
});

// ══════════════════════════════════════════════════════════
//  NAVIGATION TESTS
// ══════════════════════════════════════════════════════════

test('TC13 - Forgot Password link navigates correctly', async ({ page }) => {
  const forgotLink = page.getByText('Forgot Password?');
  await expect(forgotLink).toBeVisible();
  await forgotLink.click();

  await page.waitForLoadState('networkidle');
  const newUrl = page.url();
  console.log('   Forgot password URL:', newUrl);

  expect(newUrl).not.toBe(URL);
  console.log('✅ TC13 PASSED - Forgot Password link works');
});

test('TC14 - Create Account link navigates correctly', async ({ page }) => {
  const createLink = page.getByText('Create Account');
  await expect(createLink).toBeVisible();
  await createLink.click();

  await page.waitForLoadState('networkidle');
  const newUrl = page.url();
  console.log('   Create account URL:', newUrl);

  expect(newUrl).not.toBe(URL);
  console.log('✅ TC14 PASSED - Create Account link works');
});

// ══════════════════════════════════════════════════════════
//  SECURITY TESTS
// ══════════════════════════════════════════════════════════

test('TC15 - Protected route redirects to login when not logged in', async ({ page }) => {
  await page.goto('https://omundi-supplier-frontend.vercel.app/');
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  console.log('   Redirected to:', finalUrl);

  expect(finalUrl).toContain('login');
  console.log('✅ TC15 PASSED - Protected route redirects to login');
});