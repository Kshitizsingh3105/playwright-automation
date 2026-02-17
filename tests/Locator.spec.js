// const { expect } = require("@playwright/test");

// {test,expect}
import {test,expect} from '@playwright/test'

test('Locators',async({page})=>{
   await   page.goto("https://demoblaze.com/");
//    await page.locator('id=login2').click()
await page.click ('id=login2')

// provide username
// await page.locator('#loginusername').fill("pavanol")
await page.fill('#loginusername','pavanol')
// await page.type('#loginusername')
 await page.fill("input [id='loginpassword']",'test@123')

// click on login button
await page.click("//button[normalize-space()='Log in']")

const logoutlink= await page.locator("//a[normalize-space()='Log out']")

await expect (logoutlink).toBeVisible();

await page.close()
})
