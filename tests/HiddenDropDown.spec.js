const{test,expect}=require ('@playwright/test')

test('Hidden options dropdown',async({page})=>{
   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
   
   await page.locator("[name='username']").fill('Admin');
   await page.locator("[name='password']").fill('admin123');
   await page.locator("[type='submit']").click()
   await page.locator("").click()
   
   //click on drop down
   await page.locator(".....")

//  waiting for Options

  await page.waitForTimeout(3000);

const options=await page.$$("//div[@role='listbox']//")


for(let option of options)
{
  const jobtitle=await option.textContent();
//   console.log(jobTitle);
if(jobTitle.includes('QA Engineer'))
{
    await option.click()
    break;
}
}











    await page.waitForTimeout(5000);
})
