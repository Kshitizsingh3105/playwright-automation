const {test , expect}= require ('@playwright/test')

test("handling table ",async({page})=>{


await page.goto('https://testautomationpractice.blogspot.com/')
//capture the table
const table = await page.locator('#productTable')

//total number of rows and columns

const columns=await table.locator('thead tr th ')
console.log('Number of columns:',await columns.count())
expect (await columns.count()).toBe(4)

const rows=await table.locator('tbody tr')
console.log('Number of rows',await rows.count())
expect (await rows.count()).toBe(5)

// select check box for product 4
/*
 const matchedRow=rows.filter({
has: page.locator('td'),
 hasText: 'Smartwatch'



})

 await matchedRow.locator('input').check()
 */
//3- Select multiple products by re-usable function
// await selectProduct(rows,page,'Smartphone')
// await selectProduct(rows,page,'Laptop')
// await selectProduct(rows,page,'Wireless Earbuds')

//4- Print all product details using loop

for(let i=0;i<await rows.count();i++)
{
    const row= rows.nth(i);
   const tds= row.locator('td')
  for(let j=0;j<await columns.count()-1;j++)
    {

    }
  )

}





await page.waitForTimeout(5000)

})

async function selectProduct(rows,page,name)
{
 const matchedRow=rows.filter({
  has: page.locator('td'),
 hasText: name



})

 await matchedRow.locator('input').check()
}