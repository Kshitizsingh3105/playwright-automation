const{test,expect} = require('@playwright/test')

test("Soft assertions", async({page})=>{

await page.goto("https://demoblaze.com/")

//Hard assertions
// await expect(page).toHaveTitle('STORE')
// await expect(page).toHaveURL("https://demoblaze.com/")
// await expect(page.locator('.navbar-brand')).toBeVisible();

//soft assertions
await expect.soft(page).toHaveTitle('STORE123')
await expect.soft(page).toHaveURL("https://demoblaze.com/")
await expect.soft(page.locator('.navbar-brand')).toBeVisible();



})