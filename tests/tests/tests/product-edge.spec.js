const { test, expect } = require('@playwright/test');

// ─── CONFIG ───────────────────────────────────────────────
const URL      = 'https://omundi-supplier-frontend.vercel.app';
const EMAIL    = 'sudhanshu+505@wartinlabs.com';
const PASSWORD = 'Test@123';

const FAKE_IMAGE = {
  name: 'test.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  ),
};

// ─── LOGIN HELPER ─────────────────────────────────────────
async function login(page) {
  await page.goto(URL + '/login?redirect=%2F');
  await page.waitForLoadState('networkidle');
  await page.fill('input[placeholder="supplier@example.com"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.locator('button:has-text("Login")').click();
  await page.waitForURL(u => !u.toString().includes('login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

// ─── HELPER: open add product form ────────────────────────
async function openAddProduct(page) {
  await page.goto(URL + '/products');
  await page.waitForLoadState('networkidle');
  await page.getByText('Add Product').click();
  await page.waitForURL(/add-product/, { timeout: 10000 });
}

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await login(page);
});

// ══════════════════════════════════════════════════════════
//  NEGATIVE CASES — REQUIRED FIELD VALIDATION
// ══════════════════════════════════════════════════════════

test('NE01 - Submit with ONLY product name (no image, category, qty, price, unit)', async ({ page }) => {
  await openAddProduct(page);

  await page.fill('input[placeholder="Enter Product Name"]', 'OnlyName-Test');
  await page.getByText('Save & Publish').click({ force: true }).catch(() => {});
  await page.waitForTimeout(3000);

  // Should NOT leave the add-product page
  expect(page.url()).toContain('add-product');
  console.log('✅ NE01 PASSED - Name-only submission blocked');
});

test('NE02 - Submit without image (all other fields filled)', async ({ page }) => {
  await openAddProduct(page);

  await page.fill('input[placeholder="Enter Product Name"]', 'NoImage-Test');
  await page.locator('select').first().selectOption({ index: 1 });
  await page.fill('input[placeholder="Enter Quantity"]', '10');
  await page.fill('input[placeholder="Enter Price"]', '100');
  const allSelects = page.locator('select');
const sCount = await allSelects.count();
for (let i = 0; i < sCount; i++) {
  const v = await allSelects.nth(i).inputValue();
  if (!v) await allSelects.nth(i).selectOption({ index: 1 }).catch(() => {});
};

  await page.getByText('Save & Publish').click({ force: true }).catch(() => {});
  await page.waitForTimeout(3000);

  // Image is required (*) — should stay on form
  expect(page.url()).toContain('add-product');
  console.log('✅ NE02 PASSED - Missing image blocked');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — QUANTITY FIELD
// ══════════════════════════════════════════════════════════

test('ED01 - Negative quantity (-5) should be rejected', async ({ page }) => {
  await openAddProduct(page);

  const qtyInput = page.locator('input[placeholder="Enter Quantity"]');
  await qtyInput.fill('-5');
  const value = await qtyInput.inputValue();
  console.log('   Field accepted value:', value);

  // Either the field refuses the minus, or form blocks submit later
  // Log finding — negative stock makes no business sense
  if (value === '-5') {
    console.log('   ⚠️ FINDING: Field accepts negative quantity — possible bug!');
  } else {
    console.log('   ✅ Field rejected negative input');
  }
  console.log('✅ ED01 COMPLETED');
});

test('ED02 - Zero quantity (0) behaviour', async ({ page }) => {
  await openAddProduct(page);

  const qtyInput = page.locator('input[placeholder="Enter Quantity"]');
  await qtyInput.fill('0');
  const value = await qtyInput.inputValue();
  console.log('   Field accepted value:', value);
  console.log('   ℹ️ Business question: should a product with 0 stock be publishable?');
  console.log('✅ ED02 COMPLETED');
});

test('ED03 - Text in quantity field ("abc") should be rejected', async ({ page }) => {
  await openAddProduct(page);

  const qtyInput = page.locator('input[placeholder="Enter Quantity"]');
  await qtyInput.fill('abc').catch(() => {});
  const value = await qtyInput.inputValue();
  console.log('   Field value after typing "abc":', JSON.stringify(value));

  if (value === 'abc') {
    console.log('   ⚠️ FINDING: Quantity accepts text — possible bug!');
  } else {
    console.log('   ✅ Quantity field rejects text');
  }
  console.log('✅ ED03 COMPLETED');
});

test('ED04 - Huge quantity (999999999999) behaviour', async ({ page }) => {
  await openAddProduct(page);

  const qtyInput = page.locator('input[placeholder="Enter Quantity"]');
  await qtyInput.fill('999999999999');
  const value = await qtyInput.inputValue();
  console.log('   Field accepted value:', value);
  console.log('   ℹ️ Check: is there a max limit on stock?');
  console.log('✅ ED04 COMPLETED');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — PRICE FIELD
// ══════════════════════════════════════════════════════════

test('ED05 - Negative price (-100) should be rejected', async ({ page }) => {
  await openAddProduct(page);

  const priceInput = page.locator('input[placeholder="Enter Price"]');
  await priceInput.fill('-100');
  const value = await priceInput.inputValue();
  console.log('   Field accepted value:', value);

  if (value === '-100') {
    console.log('   ⚠️ FINDING: Price accepts negative value — possible bug!');
  } else {
    console.log('   ✅ Price field rejected negative input');
  }
  console.log('✅ ED05 COMPLETED');
});

test('ED06 - Zero price (0) — free product allowed?', async ({ page }) => {
  await openAddProduct(page);

  const priceInput = page.locator('input[placeholder="Enter Price"]');
  await priceInput.fill('0');
  console.log('   Field accepted value:', await priceInput.inputValue());
  console.log('   ℹ️ Business question: should price 0 (free product) be allowed?');
  console.log('✅ ED06 COMPLETED');
});

test('ED07 - Decimal price (99.99) should be accepted', async ({ page }) => {
  await openAddProduct(page);

  const priceInput = page.locator('input[placeholder="Enter Price"]');
  await priceInput.fill('99.99');
  const value = await priceInput.inputValue();
  console.log('   Field accepted value:', value);
  expect(value).toBe('99.99');
  console.log('✅ ED07 PASSED - Decimal price accepted');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — PRODUCT NAME FIELD
// ══════════════════════════════════════════════════════════

test('ED08 - Very long product name (300 chars)', async ({ page }) => {
  await openAddProduct(page);

  const longName = 'A'.repeat(300);
  const nameInput = page.locator('input[placeholder="Enter Product Name"]');
  await nameInput.fill(longName);
  const value = await nameInput.inputValue();
  console.log('   Typed 300 chars, field kept:', value.length, 'chars');

  if (value.length === 300) {
    console.log('   ⚠️ FINDING: No max-length limit on product name');
  } else {
    console.log('   ✅ Name is limited to', value.length, 'characters');
  }
  console.log('✅ ED08 COMPLETED');
});

test('ED09 - Special characters in name (<script> XSS test)', async ({ page }) => {
  await openAddProduct(page);

  const xssName = '<script>alert("xss")</script>';
  const nameInput = page.locator('input[placeholder="Enter Product Name"]');
  await nameInput.fill(xssName);
  const value = await nameInput.inputValue();
  console.log('   Field accepted XSS string:', value === xssName);
  console.log('   ℹ️ If this saves & renders as a popup later = CRITICAL XSS bug');
  console.log('✅ ED09 COMPLETED');
});

test('ED10 - Only spaces in product name ("   ")', async ({ page }) => {
  await openAddProduct(page);

  await page.fill('input[placeholder="Enter Product Name"]', '     ');
  await page.getByText('Save & Publish').click({ force: true }).catch(() => {});
  await page.waitForTimeout(3000);

  // Spaces-only name should be treated as empty → stay on form
  expect(page.url()).toContain('add-product');
  console.log('✅ ED10 PASSED - Spaces-only name blocked');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — DISCOUNT FIELD
// ══════════════════════════════════════════════════════════

test('ED11 - Discount above 100% (150)', async ({ page }) => {
  await openAddProduct(page);

  const discInput = page.locator('input[placeholder="Enter Discount"]');
  await discInput.fill('150');
  const value = await discInput.inputValue();
  console.log('   Field accepted value:', value);

  if (value === '150') {
    console.log('   ⚠️ FINDING: Discount above 100% accepted — seller would PAY the buyer!');
  }
  console.log('✅ ED11 COMPLETED');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — STOCK LOGIC
// ══════════════════════════════════════════════════════════

test('ED12 - Min stock GREATER than max stock (min=100, max=10)', async ({ page }) => {
  await openAddProduct(page);

  await page.fill('input[placeholder="Enter Minimum Stock"]', '100');
  await page.fill('input[placeholder="Enter Maximum Stock"]', '10');
  console.log('   Entered min=100, max=10 (logically impossible)');
  console.log('   ℹ️ App should show validation error — check on submit');
  console.log('✅ ED12 COMPLETED');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASES — SEARCH
// ══════════════════════════════════════════════════════════

test('ED13 - Search with special characters (%$#@!)', async ({ page }) => {
  await page.goto(URL + '/products');
  await page.waitForLoadState('networkidle');

  await page.fill('input[placeholder="Search products..."]', '%$#@!');
  await page.waitForTimeout(3000);

  // Should not crash the page
  const bodyText = await page.locator('body').innerText();
  const crashed = /application error|something went wrong/i.test(bodyText);
  expect(crashed).toBeFalsy();
  console.log('✅ ED13 PASSED - Special char search does not crash');
});

test('ED14 - Search with very long string (500 chars)', async ({ page }) => {
  await page.goto(URL + '/products');
  await page.waitForLoadState('networkidle');

  await page.fill('input[placeholder="Search products..."]', 'x'.repeat(500));
  await page.waitForTimeout(3000);

  const bodyText = await page.locator('body').innerText();
  expect(/application error|something went wrong/i.test(bodyText)).toBeFalsy();
  console.log('✅ ED14 PASSED - Long search does not crash');
});

// ══════════════════════════════════════════════════════════
//  EDGE CASE — DRAFT FLOW
// ══════════════════════════════════════════════════════════

test('ED15 - Save as draft with partial data', async ({ page }) => {
  await openAddProduct(page);

  await page.fill('input[placeholder="Enter Product Name"]', 'Draft-Test-' + Date.now());
  await page.getByText('Save as draft').click();
  await page.waitForTimeout(4000);

  const url = page.url();
  const bodyText = await page.locator('body').innerText();
  console.log('   After draft URL:', url);
  console.log('   Draft saved?', /draft|saved|success/i.test(bodyText) || !url.includes('add-product'));
  console.log('✅ ED15 COMPLETED - Check if drafts need full validation or not');
});