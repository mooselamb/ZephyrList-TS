import 'dotenv/config';
import * as puppeteer from "puppeteer";
import fetch from "node-fetch";



const searchForHomeListingWebsites = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setRequestInterception(true); 
 
    // Check for image requests and abort them
    page.on('request', interceptedRequest => { 
        if ( 
            interceptedRequest.url().endsWith('.png') || 
            interceptedRequest.url().endsWith('.jpg') || 
            interceptedRequest.url().includes('.png?') || 
            interceptedRequest.url().includes('.jpg?') 
        ) { 
            interceptedRequest.abort(); 
        } else { 
            interceptedRequest.continue(); 
        } 
    }); 

    //Go to Google.com and enter search query
    await page.goto('https://www.google.com');
    await page.type('textarea[name="q"]', 'top home listing websites');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    const websites = [
        'bienici.com', 'seloger.com', 'leboncoin.fr', 'rightmove.co.uk',
        'craigslist.org', 'entreparticuliers.com', 'immo-diffusion.fr',
        'paruvendu.fr', 'pap.fr', 'ouestfrance-immo.com', 'funda.nl',
        'zillow.com', 'trulia.com', 'primeshop.com.hk', 'propertypassbook.com',
        'apartments.com', 'realtor.com'
    ];

    const url = await page.evaluate((websites) => {
        const links = Array.from(document.querySelectorAll('a'));
        for (let link of links) {
            const href = link.href;
            if (websites.some(website => href.includes(website))) {
                return href;
            }
        }
        return '';
    }, websites);

    await browser.close();

    if (url) {
        console.log(`Found URL: ${url}`);
        fetchRealEstateWebsiteData(url);
    } else {
        console.log("No matching real estate website found.");
    }
};


const fetchRealEstateWebsiteData = async (url) => {
    const apiEndPoint = "http://api.scraping-bot.io/scrape/real-estate";
    const auth = "Basic " + Buffer.from(`ushafiq:FKtDHM69KDK07nmrlKuQTWOW3`).toString("base64");

    try {
        const response = await fetch(apiEndPoint, {
            method: "POST",
            body: JSON.stringify({
                url: url,
                options: {
                    useChrome: false,
                    premiumProxy: true,
                    proxyCountry: "US",
                    waitForNetworkRequests: true,
                }
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": auth
            }    
        });
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && data.data.results && data.data.results.length > 0) {
            const listing = data.data.results;
            listing.forEach((listing, index) => {
                console.log(`Listing ${index + 1}:`);
                console.log(`Price: ${listing.price}`);
                console.log(`Address: ${listing.address}`);
                console.log(`Number of Bedrooms: ${listing.beds}`);
                console.log(`Number of Baths: ${listing.baths}`);
                console.log(`Area: ${listing.area} sqft`);
                console.log('---'); 
            });
        } else {
            console.log("No listings found");
        }
    } catch (error) {
        console.error("Error fetching listings data", error);
    }
}

fetchRealEstateWebsiteData();



// // async function crawlGoogle() {
// //     const browser = await puppeteer.launch({headless: false});
// //     const page = await browser.newPage();

// //     await page.setRequestInterception(true); 
 
// //     // Check for image requests and abort them
// //     page.on('request', interceptedRequest => { 
// //         if ( 
// //             interceptedRequest.url().endsWith('.png') || 
// //             interceptedRequest.url().endsWith('.jpg') || 
// //             interceptedRequest.url().includes('.png?') || 
// //             interceptedRequest.url().includes('.jpg?') 
// //         ) { 
// //             interceptedRequest.abort(); 
// //         } else { 
// //             interceptedRequest.continue(); 
// //         } 
// //     }); 

// //     //Go to Google.com and enter search query
// //     await page.goto('https://www.google.com', {waitUntil: 'networkidle2'});
// //     await page.type('textarea[name="q"]', 'top home listing websites');
// //     await page.keyboard.press('Enter');
// //     await page.waitForNavigation({waitUntil: 'networkidle2'});


// //     const homeListingWebsites = await page.evaluate(() => {
// //         const links: any = [];
// //         const el = document.querySelectorAll('a[href]');
// //         el.forEach((a) => {
// //             const href = a.getAttribute('href');
// //             if (href && href.startsWith('http')) {
// //                 links.push(href);
// //             }
// //         });
// //         return links;
// //     });
// //     console.log("Link Results:", homeListingWebsites);


// //     if (homeListingWebsites.length > 0) {
// //         const realEstateWebsiteUrl = homeListingWebsites[0];
// //         await fetchRealEstateWebsiteData(realEstateWebsiteUrl);
// //     } else {
// //         console.log("No real estate website found");
// //     }
// //     // await browser.close();
// // }

