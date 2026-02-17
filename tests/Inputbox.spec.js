const {test,expect} =require('@playwright/test')

test('handle inputbox',async ({page}) =>{

    await page.goto('')
    // input box firstname
   
await expect (await page.locator("input[@id='name']")).toBeVisible();
await expect (await page.locator("input[@id='name']")).toBeEmpty();
await expect (await page.locator("input[@id='name']")).toBeEditable();
await expect (await page.locator("input[@id='name']")).toBeEnabled();
await expect (await page.locator("input[@id='name']")).toBeVisible();

await page.locator("input[@id='name'").fill('John')
    // page.fill("input[@id='name']",'John');
     
await page.waitForTimeout(5000); //pausing code

})
