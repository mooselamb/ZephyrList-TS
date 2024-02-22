import express from 'express';
import 'dotenv/config';
import * as puppeteer from "puppeteer";
import fetch from "node-fetch";
import * as fs from 'fs';
import {setTimeout} from "node:timers/promises";

const app = express();
app.use(express.json());
const port = 3000;


app.post('/search', async (req, res) => {
    const searchQuery = req.body.searchQuery;
    // console.log("Search Query:", searchQuery);
    if (!searchQuery) {
        return res.status(400).send({ error: 'searchQuery is required' });
    }
    try {
        const url = await searchForHomeListingWebsites(searchQuery);
        if (url) {
            res.send({ url });
        } else {
            res.status(404).send({ error: 'No matching real estate website found.' });
        }
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

const searchForHomeListingWebsites = async (searchQuery:string) => {
    const browser = await puppeteer.launch({
        headless:false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.setRequestInterception(true); 
 
    // Check for image requests and abort them
    page.on('request', interceptedRequest => { 
        if (interceptedRequest.resourceType() === 'image') { 
            interceptedRequest.abort(); 
        } else { 
            interceptedRequest.continue(); 
        } 
    }); 

    console.log("Search Query:", searchQuery);
    //Go to Google.com and enter search query
    await page.goto('https://www.google.com');
    await page.waitForSelector('textarea[name="q"]');
    await page.type('textarea[name="q"]', searchQuery);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    // const websites = [
    //     'bienici.com', 'seloger.com', 'leboncoin.fr', 'rightmove.co.uk',
    //     'craigslist.org', 'entreparticuliers.com', 'immo-diffusion.fr',
    //     'paruvendu.fr', 'pap.fr', 'ouestfrance-immo.com', 'funda.nl',
    //     'zillow.com', 'trulia.com', 'primeshop.com.hk', 'propertypassbook.com',
    //     'apartments.com', 'realtor.com'
    // ];

    // const url = await page.evaluate((websites) => {
    //     const links = Array.from(document.querySelectorAll('a'));
    //     for (let link of links) {
    //         const href = link.href;
    //         if (websites.some(website => href.includes(website))) {
    //             return href;
    //         }
    //     }
    //     return '';
    // }, websites);
    let foundUrl = '';

    const targetWebsite = 'zillow.com';
    let found = false;

    while (!found) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        const moreResultsSelector = '[aria-label="More results"]';
        if (await page.$(moreResultsSelector) !== null) {
            await page.click(moreResultsSelector);
            // Wait for the next set of results to load
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
        }

        const links = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a')).map(link => link.href)
        );

        const targetLink = links.find(link => link.includes(targetWebsite));

        if (targetLink) {
            foundUrl = targetLink;
            console.log(`Found ${targetWebsite}`);
            found = true;
            fetchRealEstateWebsiteData(targetLink);
        } 
    }

    if (!found) {
        console.log(`${targetWebsite} not found after many attempts.`);
    }

    await browser.close();
    return found ? foundUrl: '';
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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
        console.log("Data:", data);
        
        if (data.data && data.data.results && data.data.results.length > 0) {
            const listings = data.data.results.map((listing: any) => ({
                price: listing.price,
                address: listing.address,
                bedrooms: listing.beds,
                baths: listing.baths,
                area: listing.area,
            }));
            fs.writeFile('listings.json', JSON.stringify({ listings: listings }, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error("Error saving listings data", err);
                    return;
                }
                console.log('Listings data has been saved.');
            });
        } else {
            console.log("No listings found or unable to parse listings.");
        }
    } catch (error) {
        console.error("Error fetching listings data", error);
    }
}

// searchForHomeListingWebsites("top home listing websites zillow austin tx");


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

