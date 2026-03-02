const {test,expect}=require('@playwright/test')

test.skip('Alert with OK',async ({page}) => {
   await page.goto('https://testautomationpractice.blogspot.com/');
// enabling error handling  // dialog window handler  
page.on('dialog',async dialog=>{

 expect (dialog.type()).toContain('alert')
 expect (dialog.message()).toContain('I am an alert box!')
 await dialog.expect();


})


test('Confirmation with OK',async ({page}) => {
    page.goto('https://testautomationpractice.blogspot.com/')
// enabling error handling  // dialog window handler  
page.on('dialog',async dialog=>{

 expect (dialog.type()).toContain('Confirm')
 expect (dialog.message().toContain('Press a button!'))
  await dialog.accept(); //close by using ok button
// await dialog.dismiss();//close by using cancel button



})

await page.click('//button[normalize-space()="Alert"]');

await expect (page.locator('//p[@id="demo"]')).toHaveText('You pressed Ok!')

await page.waitForTimeout(5000)


 

}
);



