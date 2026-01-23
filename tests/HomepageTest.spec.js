const{test,expect}=require('@playwright/test');
test('Home Page,',async({page})=>{
await page.goto('https://www.aifluency.ai/version-test');

const pageTitle=page.title();
console.log('page title is:',pageTitle);

await expect(page).toHaveTitle('Welcome to AI Fluency!');

const pageURL= page.url();
console.log('Page  url is :',pageURL);
await expect(page).toHaveURL('https://www.aifluency.ai/version-test');
 await page.close();

})