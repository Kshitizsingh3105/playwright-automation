const {test,expect}=require('@playwright/test')

test('AssertionsTest',async({page})=>{

await page.goto('https://demo.nopcommerce.com/register')

// await expect(page).toHaveURL('https://demo.nopcommerce.com/register')
// await expect(page).toHaveTitle('nopCommerce demo store. Register')
const logoElement= await page.locator('.header-logo')
await expect(logoElement).toBeVisible()
const searchStorebox=  await page.locator('#small-searchterms')
await expect(searchStorebox).toBeEnabled()

const maleRadioButton= await page.locator('#gender-male')
await maleRadioButton.click()//select radio button
await expect (maleRadioButton).toBeChecked()
 
// const newsletterCheckbox = page.locator('NewsLetterSubscriptions_0__IsActive') // checkbox
// await newsletterCheckbox.Check() // select checkbox
// await expect(newsletterCheckbox).toBeChecked()
// const regButton=await page.locator('#register-button')
// await expect(regButton).toHaveAttribute('type','submit')


await expect(await page.locator('.page-title h1')).toHaveText('Register')

await expect(await page.locator('.page-title h1')).toContainText('Reg')

const emailInput = await page.locator('#Email')
await emailInput.fill ('test@demo.com');
await expect(emailInput).toHaveValue('test@demo.com')

// const options = await page.locator('')
// await expect (options).toHaveCount(13)


})