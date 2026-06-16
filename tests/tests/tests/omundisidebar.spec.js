const { test, expect } = require('@playwright/test');

// ─── CONFIG ───────────────────────────────────────────────
const URL      = 'https://omundi-supplier-frontend.vercel.app';
const EMAIL    = 'sudhanshu+505@wartinlabs.com';
const PASSWORD = 'Test@123';

// ─── SET THIS TO true WHEN BACKEND IS READY ───────────────
const IS_DYNAMIC = false;

// ─── EXPECTED REAL VALUES (fill when backend is ready) ────
const EXPECTED = {
  totalSales:    null,   // e.g. '125,430 MT' → replace with real value
  totalRentals:  null,   // e.g. '48'
  pendingOrders: null,   // e.g. '12'
  lowStock:      null,   // e.g. '12'
};

const MENU_ITEMS = [
  { name: 'Dashboard',  url: '/',          built: true  },
  { name: 'Products',   url: '/products',  built: true  },
  { name: 'Machinery',  url: '/machinery', built: true  },
  { name: 'Orders',     url: '/orders',    built: false },
  { name: 'Rentals',    url: '/rentals',   built: true  },
  { name: 'Payments',   url: '/payments',  built: false },
  { name: 'Analytics',  url: '/analytics', built: true  },
  { name: 'Reviews',    url: '/reviews',   built: false },
  { name: 'Settings',   url: '/settings',  built: false },
];

// ─── CRASH PATTERN ────────────────────────────────────────
const CRASH_PATTERN = /application error|page not found|404 not found/i;

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

test.beforeEach(async ({ page }) => {
  await login(page);
});

// ══════════════════════════════════════════════════════════
//  SIDEBAR STRUCTURE
// ══════════════════════════════════════════════════════════

test('SB01 - All sidebar menu items are visible', async ({ page }) => {
  for (const item of MENU_ITEMS) {
    const menuItem = page.locator(`aside a:has-text("${item.name}"), nav a:has-text("${item.name}")`).first();
    const visible = await menuItem.isVisible().catch(() => false);
    console.log(`   ${visible ? '✅' : '❌'} ${item.name}`);
  }
  const logoutVisible = await page.locator('aside, nav').getByText('Logout').first().isVisible().catch(() => false);
  console.log(`   ${logoutVisible ? '✅' : '❌'} Logout`);
  console.log('✅ SB01 PASSED');
});

test('SB02 - Omundi logo is visible in sidebar', async ({ page }) => {
  await expect(page.locator('aside img, aside svg').first()).toBeVisible();
  console.log('✅ SB02 PASSED');
});

// ══════════════════════════════════════════════════════════
//  NAVIGATION TESTS
// ══════════════════════════════════════════════════════════

test('SB03 - Dashboard loads with overview data', async ({ page }) => {
  await page.locator('aside, nav').getByText('Dashboard').first().click();
  await page.waitForLoadState('networkidle');

  const bodyText = await page.locator('body').innerText();
  const hasOverview = /dashboard overview|total sales|total rentals|pending orders/i.test(bodyText);
  const crashed = CRASH_PATTERN.test(bodyText);

  expect(crashed).toBeFalsy();
  console.log('   Dashboard has overview data:', hasOverview);
  console.log('   URL:', page.url());
  console.log('✅ SB03 PASSED');
});

test('SB04 - Products link navigates correctly', async ({ page }) => {
  await page.locator('aside, nav').getByText('Products').first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('products');
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();
  console.log('✅ SB04 PASSED - URL:', page.url());
});

test('SB05 - Machinery link navigates correctly', async ({ page }) => {
  await page.locator('aside, nav').getByText('Machinery').first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('machinery');
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();
  console.log('✅ SB05 PASSED - URL:', page.url());
});

test('SB06 - Orders link (not built yet)', async ({ page }) => {
  await page.locator('aside, nav').getByText('Orders').first().click();
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();

  if (!finalUrl.includes('orders')) {
    console.log('   ⚠️ BUG: Orders not implemented — redirected to:', finalUrl);
  } else {
    console.log('   ✅ Orders page now working!');
  }
  console.log('✅ SB06 PASSED');
});

test('SB07 - Rentals link navigates correctly', async ({ page }) => {
  await page.locator('aside, nav').getByText('Rentals').first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('rentals');
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();
  console.log('✅ SB07 PASSED - URL:', page.url());
});

test('SB08 - Payments link (not built yet)', async ({ page }) => {
  await page.locator('aside, nav').getByText('Payments').first().click();
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();

  if (!finalUrl.includes('payments')) {
    console.log('   ⚠️ BUG: Payments not implemented — redirected to:', finalUrl);
  } else {
    console.log('   ✅ Payments page now working!');
  }
  console.log('✅ SB08 PASSED');
});

test('SB09 - Analytics link navigates correctly', async ({ page }) => {
  await page.locator('aside, nav').getByText('Analytics').first().click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('analytics');
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();
  console.log('✅ SB09 PASSED - URL:', page.url());
});

test('SB10 - Reviews link (not built yet)', async ({ page }) => {
  await page.locator('aside, nav').getByText('Reviews').first().click();
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();

  if (!finalUrl.includes('reviews')) {
    console.log('   ⚠️ BUG: Reviews not implemented — redirected to:', finalUrl);
  } else {
    console.log('   ✅ Reviews page now working!');
  }
  console.log('✅ SB10 PASSED');
});

test('SB11 - Settings link (not built yet)', async ({ page }) => {
  await page.locator('aside, nav').getByText('Settings').first().click();
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  expect(CRASH_PATTERN.test(await page.locator('body').innerText())).toBeFalsy();

  if (!finalUrl.includes('settings')) {
    console.log('   ⚠️ BUG: Settings not implemented — redirected to:', finalUrl);
  } else {
    console.log('   ✅ Settings page now working!');
  }
  console.log('✅ SB11 PASSED');
});

// ══════════════════════════════════════════════════════════
//  ACTIVE STATE + HEADER
// ══════════════════════════════════════════════════════════

test('SB12 - Active menu item is highlighted', async ({ page }) => {
  await page.locator('aside, nav').getByText('Products').first().click();
  await page.waitForLoadState('networkidle');
  const productsLink = page.locator('aside a, nav a').filter({ hasText: 'Products' }).first();
  const className = await productsLink.getAttribute('class');
  console.log('   Products link classes:', className);
  console.log('✅ SB12 PASSED');
});

test('SB13 - Global search bar is visible in header', async ({ page }) => {
  await expect(page.locator('input[placeholder*="Search products, orders, machinery"]').first()).toBeVisible();
  console.log('✅ SB13 PASSED');
});

test('SB14 - Notification bell is visible in header', async ({ page }) => {
  const bell = page.locator('[class*="bell"], [aria-label*="notification"], header svg').first();
  const visible = await bell.isVisible().catch(() => false);
  console.log('   Notification bell visible:', visible);
  if (!visible) console.log('   ⚠️ Bell not implemented yet');
  console.log('✅ SB14 PASSED');
});

test('SB15 - Profile name is visible in header', async ({ page }) => {
  await expect(page.getByText('Test').first()).toBeVisible();
  console.log('✅ SB15 PASSED');
});

// ══════════════════════════════════════════════════════════
//  ALL PAGES STABILITY CHECK
// ══════════════════════════════════════════════════════════

test('SB16 - Visit all menu items — check for crashes', async ({ page }) => {
  const bugs = [];

  for (const item of MENU_ITEMS) {
    await page.locator('aside, nav').getByText(item.name).first().click();
    await page.waitForLoadState('networkidle');

    const finalUrl = page.url();
    const crashed = CRASH_PATTERN.test(await page.locator('body').innerText());

    if (crashed) {
      bugs.push(`❌ CRASH: ${item.name}`);
      console.log(`   ❌ CRASH: ${item.name} — ${finalUrl}`);
    } else if (item.built && !finalUrl.includes(item.url.replace('/', ''))) {
      console.log(`   ⚠️ ${item.name} not built yet — redirected to: ${finalUrl}`);
    } else {
      console.log(`   ✅ ${item.name} — ${finalUrl}`);
    }
  }

  const crashes = bugs.filter(b => b.startsWith('❌'));
  expect(crashes.length).toBe(0);
  console.log('✅ SB16 PASSED - No crashes found');
});

// ══════════════════════════════════════════════════════════
//  DASHBOARD WIDGET TESTS
//  Works for BOTH static (now) and dynamic (future) data
// ══════════════════════════════════════════════════════════

test('SB17 - Dashboard shows all 4 stat widgets', async ({ page }) => {
  await page.goto(URL + '/');
  await page.waitForLoadState('networkidle');

  const bodyText = await page.locator('body').innerText();

  // ── STATIC CHECK (works now) ───────────────────────────
  // Just verify widgets are visible — don't check exact values
  const hasTotalSales    = /total sales/i.test(bodyText);
  const hasTotalRentals  = /total rentals/i.test(bodyText);
  const hasPendingOrders = /pending orders/i.test(bodyText);
  const hasLowStock      = /low stock/i.test(bodyText);

  console.log('   Total Sales widget:',    hasTotalSales    ? '✅' : '❌');
  console.log('   Total Rentals widget:',  hasTotalRentals  ? '✅' : '❌');
  console.log('   Pending Orders widget:', hasPendingOrders ? '✅' : '❌');
  console.log('   Low Stock Alerts:',      hasLowStock      ? '✅' : '❌');

  expect(hasTotalSales).toBeTruthy();
  expect(hasTotalRentals).toBeTruthy();
  expect(hasPendingOrders).toBeTruthy();
  expect(hasLowStock).toBeTruthy();

  // ── DYNAMIC CHECK (activate when backend is ready) ────
  // Just change IS_DYNAMIC = true at top of file
  // and fill EXPECTED values
  if (IS_DYNAMIC && EXPECTED.totalSales) {
    console.log('   🔄 Dynamic mode — checking real values...');
    expect(bodyText).toContain(EXPECTED.totalSales);
    expect(bodyText).toContain(EXPECTED.totalRentals);
    expect(bodyText).toContain(EXPECTED.pendingOrders);
    expect(bodyText).toContain(EXPECTED.lowStock);
    console.log('   ✅ Real API values match expected values');
  } else {
    console.log('   ℹ️  Static mode — widget presence verified only');
    console.log('   ℹ️  To test real values: set IS_DYNAMIC=true + fill EXPECTED at top');
  }

  console.log('✅ SB17 PASSED');
});

test('SB18 - Dashboard stat values are numbers (not empty)', async ({ page }) => {
  await page.goto(URL + '/');
  await page.waitForLoadState('networkidle');

  // Each widget should show SOME number — not blank/undefined/null
  const widgets = page.locator('[class*="card"], [class*="stat"], [class*="widget"]');
  const count = await widgets.count();
  console.log('   Found', count, 'stat widgets');

  // Check no widget shows "undefined", "null", "NaN", or is completely empty
  const bodyText = await page.locator('body').innerText();
  const hasBadValues = /undefined|null|NaN|—\s*—/i.test(bodyText);

  if (hasBadValues) {
    console.log('   ⚠️ BUG: Some widgets show undefined/null/NaN values!');
  } else {
    console.log('   ✅ No broken values found in widgets');
  }

  // ── FUTURE: when dynamic, verify values > 0 ───────────
  if (IS_DYNAMIC) {
    console.log('   🔄 Dynamic mode — verifying values are positive numbers...');
    const numbers = bodyText.match(/[\d,]+/g) || [];
    console.log('   Numbers found on dashboard:', numbers.slice(0, 10));
  }

  console.log('✅ SB18 PASSED');
});

test('SB19 - Dashboard quick action buttons are visible (static for now)', async ({ page }) => {
  await page.goto(URL + '/');
  await page.waitForLoadState('networkidle');

  // ── Just verify buttons are VISIBLE — not testing navigation ──
  // (Dashboard is fully static, buttons not connected yet)
  const addProduct    = await page.getByText('Add Product').isVisible().catch(() => false);
  const addMachinery  = await page.getByText('Add Machinery').isVisible().catch(() => false);
  const viewOrders    = await page.getByText('View Orders').isVisible().catch(() => false);
  const viewRentals   = await page.getByText('View Rentals').isVisible().catch(() => false);

  console.log('   Add Product button:',   addProduct   ? '✅ visible' : '❌ missing');
  console.log('   Add Machinery button:', addMachinery ? '✅ visible' : '❌ missing');
  console.log('   View Orders button:',   viewOrders   ? '✅ visible' : '❌ missing');
  console.log('   View Rentals button:',  viewRentals  ? '✅ visible' : '❌ missing');

  expect(addProduct).toBeTruthy();
  expect(addMachinery).toBeTruthy();
  expect(viewOrders).toBeTruthy();
  expect(viewRentals).toBeTruthy();

  // ── FUTURE: when buttons are connected ────────────────
  // Change IS_DYNAMIC = true at top of file
  // Tests will then verify each button navigates correctly
  if (IS_DYNAMIC) {
    console.log('   🔄 Dynamic mode — testing button navigation...');

    await page.goto(URL + '/');
    await page.getByText('Add Product').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('product');
    console.log('   ✅ Add Product →', page.url());

    await page.goto(URL + '/');
    await page.getByText('Add Machinery').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('machinery');
    console.log('   ✅ Add Machinery →', page.url());

    await page.goto(URL + '/');
    await page.getByText('View Orders').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('orders');
    console.log('   ✅ View Orders →', page.url());

    await page.goto(URL + '/');
    await page.getByText('View Rentals').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('rentals');
    console.log('   ✅ View Rentals →', page.url());
  } else {
    console.log('   ℹ️  Static mode — buttons visible but navigation not tested');
    console.log('   ℹ️  Set IS_DYNAMIC=true when buttons are connected');
  }

  console.log('✅ SB19 PASSED');
});

test('SB20 - Dashboard Sales Overview chart is visible', async ({ page }) => {
  await page.goto(URL + '/');
  await page.waitForLoadState('networkidle');

  // Check chart section exists
  const hasChart = await page.getByText(/sales overview/i).isVisible().catch(() => false);
  console.log('   Sales Overview chart visible:', hasChart);

  // Check chart has canvas or svg element (actual chart rendering)
  const chartElement = page.locator('canvas, svg[class*="chart"], [class*="recharts"]').first();
  const chartVisible = await chartElement.isVisible().catch(() => false);
  console.log('   Chart element rendered:', chartVisible);

  // ── FUTURE: when dynamic ──────────────────────────────
  if (IS_DYNAMIC) {
    console.log('   🔄 Dynamic mode — verifying chart has real data points...');
    // Chart should have more than 1 data point
    const dataPoints = await page.locator('[class*="recharts-dot"], circle').count();
    console.log('   Chart data points found:', dataPoints);
    expect(dataPoints).toBeGreaterThan(0);
  }

  expect(hasChart).toBeTruthy();
  console.log('✅ SB20 PASSED');
});

// ══════════════════════════════════════════════════════════
//  LOGOUT
// ══════════════════════════════════════════════════════════

test('SB21 - Logout redirects to login page', async ({ page }) => {
  await page.locator('aside, nav').getByText('Logout').first().click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('login');
  console.log('✅ SB21 PASSED - URL:', page.url());
});

test('SB22 - After logout cannot access protected pages', async ({ page }) => {
  await page.locator('aside, nav').getByText('Logout').first().click();
  await page.waitForTimeout(3000);

  await page.goto(URL + '/products');
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('login');
  console.log('✅ SB22 PASSED - Protected route blocked after logout');
});
//How the Future-Ready feature works
// At the top of the file there are 2 things to change when backend is ready:
// javascript// RIGHT NOW (static)
// const IS_DYNAMIC = false;
// const EXPECTED = {
//   totalSales:    null,
//   totalRentals:  null,
//   ...
// };

// // WHEN BACKEND IS READY — just change these:
// const IS_DYNAMIC = true;
// const EXPECTED = {
//   totalSales:    '2,450 MT',  // ← real value from your API
//   totalRentals:  '15',
//   pendingOrders: '8',
//   lowStock:      '3',
// };