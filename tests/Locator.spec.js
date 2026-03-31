// @ts-check
const { test, expect } = require("@playwright/test");

const BASE_URL = "https://demoblaze.com";

// Generate a unique user so sign-up doesn't collide with existing accounts
const TS = Date.now();
const TEST_USER = `testuser_${TS}`;
const TEST_PASS = `Pass@${TS}`;

/* ─── helpers ─────────────────────────────────────────────────────── */

/** Accept (or dismiss) the browser alert and return its text. */
async function handleAlert(page) {
  return new Promise((resolve) => {
    page.once("dialog", async (dialog) => {
      const msg = dialog.message();
      await dialog.accept();
      resolve(msg);
    });
  });
}

/* ─── 1. Sign Up ──────────────────────────────────────────────────── */

test.describe("Authentication Flow", () => {
  test("1 — Sign up with a new account", async ({ page }) => {
    await page.goto(BASE_URL);

    // Open the Sign-up modal
    await page.locator("#signin2").click();
    await page.locator("#signInModal").waitFor({ state: "visible" });

    // Fill credentials
    await page.locator("#sign-username").fill(TEST_USER);
    await page.locator("#sign-password").fill(TEST_PASS);

    // Submit & capture the alert
    const alertPromise = handleAlert(page);
    await page.locator('button[onclick="register()"]').click();
    const alertText = await alertPromise;

    console.log("Sign-up alert:", alertText);
    expect(alertText).toContain("Sign up successful");
  });

  /* ─── 2. Log In ───────────────────────────────────────────────── */

  test("2 — Log in with the new account", async ({ page }) => {
    await page.goto(BASE_URL);

    // Open the Log-in modal
    await page.locator("#login2").click();
    await page.locator("#logInModal").waitFor({ state: "visible" });

    // Fill credentials
    await page.locator("#loginusername").fill(TEST_USER);
    await page.locator("#loginpassword").fill(TEST_PASS);

    // Click Log in
    await page.locator('button[onclick="logIn()"]').click();

    // After successful login the navbar shows "Welcome <username>"
    const welcome = page.locator("#nameofuser");
    await expect(welcome).toBeVisible({ timeout: 10000 });
    await expect(welcome).toContainText(`Welcome ${TEST_USER}`);

    console.log("Login verified — welcome message visible.");
  });

  /* ─── 3. Log Out ──────────────────────────────────────────────── */

  test("3 — Log out successfully", async ({ page }) => {
    // Log in first (each test gets a fresh context)
    await page.goto(BASE_URL);
    await page.locator("#login2").click();
    await page.locator("#logInModal").waitFor({ state: "visible" });
    await page.locator("#loginusername").fill(TEST_USER);
    await page.locator("#loginpassword").fill(TEST_PASS);
    await page.locator('button[onclick="logIn()"]').click();
    await expect(page.locator("#nameofuser")).toBeVisible({ timeout: 10000 });

    // Now log out
    await page.locator("#logout2").click();

    // After logout the "Log in" link reappears and welcome text disappears
    await expect(page.locator("#login2")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("#nameofuser")).toBeHidden();

    console.log("Logout verified — login link visible again.");
  });

  /* ─── 4. Negative — login with wrong password ─────────────────── */

  test("4 — Login fails with wrong password", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#login2").click();
    await page.locator("#logInModal").waitFor({ state: "visible" });

    await page.locator("#loginusername").fill(TEST_USER);
    await page.locator("#loginpassword").fill("WrongPassword!");

    const alertPromise = handleAlert(page);
    await page.locator('button[onclick="logIn()"]').click();
    const alertText = await alertPromise;

    console.log("Wrong-password alert:", alertText);
    expect(alertText).toContain("Wrong password");
  });

  /* ─── 5. Negative — sign up with existing user ────────────────── */

  test("5 — Sign up fails for an already-registered user", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#signin2").click();
    await page.locator("#signInModal").waitFor({ state: "visible" });

    await page.locator("#sign-username").fill(TEST_USER);
    await page.locator("#sign-password").fill(TEST_PASS);

    const alertPromise = handleAlert(page);
    await page.locator('button[onclick="register()"]').click();
    const alertText = await alertPromise;

    console.log("Duplicate sign-up alert:", alertText);
    expect(alertText).toContain("This user already exist");
  });
});