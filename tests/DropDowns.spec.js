const {test,expect}=require('@playwright/test');
const { log } = require('node:console');
const { stat } = require('node:fs');

test("Handle dropDowns",async({page})=>{

await page.goto('https://testautomationpractice.blogspot.com/');
//Multiple ways to select option from the dropdown
//await page.locator("#country").selectOption({label:'India'}) //by using label //visible text  
// await page.locator("#country").selectOption('India');  //visible text  

// await page.locator("#country").selectOption({value:'uk'});  //by value  

// await page.locator("#country").selectOption({index: 1});  //by index  
// await page.selectOption("#country",'India'); bytext

// assertions
 //check number of options in dropdown- approach 1


// const options = await  page.locator('#country option')

// await  expect(options).toHaveCount(10);

// check number of options in dropdown -approach 2

//const options = await page.$$('#country option')

// console.log("number of options", options.length)

//await expect(options.length).toBe(10);

// check Presence of  elements/options/values in dropdown- Approach
 
// const content = await page.locator('#country').textContent()
// await expect (content.includes('India')).toBeTruthy()

//presence of value in dropdown - approach 2- using looping statement 
//  const options = await page.$$('#country option') 
 
// let status =false;
// for( const option of options )

// {
//     //console.log(await option.textContent())
//     let value= await option.textContent()
// if (value.includes('France'))
// {
//     status=true;
//     break;
// }
// }
// expect(status).toBeTruthy();

//select options from drowpdown using loop
const options = await page.$$('#country option');



for(const option of options)
{
let value = await option.textContent()
if (value.includes('France'))
{
     await page.selectOption("#country",value);
break;
}
}
await page.waitForTimeout(5000)
}
)