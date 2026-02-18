const{test,expect} = require('@playwright/test')

test("Handle checkboxes",async({page})=>{
 
await page.goto('');

//single or specific checkbox
await page.locator("").check();

expect(await page.locator("")).toBeChecked();

expect(await page.locator("").isChecked()).toBeTruthy();
expect(await page.locator("").isChecked()).toBeTruthy();
//for monday,it must be not ticked so use falsy
expect(await page.locator("").isChecked()).toBeFalsy();

//Multiplecheckboxes
const checkboxLocators=[
    expect(await page.locator("").isChecked()).toBeTruthy();//use xpath for sun
expect(await page.locator("").isChecked()).toBeTruthy();//use xpath for mon
expect(await page.locator("").isChecked()).toBeTruthy();//use xpath for sat

];
for (const locator of checkboxLocators)//select multiple checkboxes
{
 await page.locator(locator).check();
}
{
await page.locator(locator).check();
}

for (const locator of checkboxLocators)//unselect multiple checkboxes 
{
 await page.locator(locator).check();
}
{
    if(await page.locator(locator).isChecked());
  { 
await page.locator(locator).uncheck();
  }
}

await page.waitForTimeout(5000);

})
