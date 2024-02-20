import * as puppeteer from "puppeteer";

//Func to launch browser and create new page
async function setBrowser() {
    console.log('Inside setBrowser')
    const browser = await puppeteer.launch({headless:false});

    const page = await browser.newPage();

    await page.goto("https://www.zillow.com/homes/for_sale/");

   return {browser,page};
}

//Func to navigate to URL
async function navigateToURL(page: puppeteer.Page, url: string) {
    try {
        await page.goto(url,{waitUntil: "networkidle2"});

        console.log(`Navigated to ${url}`);

    }   catch (err) {
        console.error(`Could not navigate to ${url}`, err);

        throw err;
    }
}

//Func to search for listings
async function searchListings(page: puppeteer.Page, city: string) {
    await page.type("#__c11n_j1wmrge", city);
    await page.click("#__c11n_j1wmrgg");
    await page.waitForNavigation({waitUntil: "networkidle2"});
    console.log(`Searched for listings in ${city}`);
}

//Scraper func
async function scrapeListings() {
    console.log('Inside scrapeListings')
    let browser, page;
    try {
        const result = await setBrowser();
        browser = result.browser;
        page = result.page;

        // await page.click('button', { delay: 7000 })

        console.log('Page was set')
        const input = await page.$('input')
        await input?.type('sylvania')
        
        // const listings = await page.evaluate(() => {
        //     console.log('Evaluating listings')
        //     const listings = document.querySelectorAll(".list-card-info");
        //     console.log(listings)
            
        //     const listingArray = Array.from(listings).map((listing) => {
        //         const details = listing.textContent?.split("•");
                
        //         return {
        //             price: details?.[0],
        //             address: details?.[1],
        //             broker: details?.[2]
        //         };
        //     });
        //     return listingArray;
        // });

    } catch (err) {
        console.log('Error scraping listings', err);
        throw err;
    } finally {
        // if (browser) browser?.close();
    }
}



scrapeListings().catch(console.error);

