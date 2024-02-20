"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
//Func to launch browser and create new page
function setBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inside setBrowser');
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.goto("https://www.zillow.com/homes/for_sale/");
        return { browser, page };
    });
}
//Func to navigate to URL
function navigateToURL(page, url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.goto(url, { waitUntil: "networkidle2" });
            console.log(`Navigated to ${url}`);
        }
        catch (err) {
            console.error(`Could not navigate to ${url}`, err);
            throw err;
        }
    });
}
//Func to search for listings
function searchListings(page, city) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.type("#__c11n_j1wmrge", city);
        yield page.click("#__c11n_j1wmrgg");
        yield page.waitForNavigation({ waitUntil: "networkidle2" });
        console.log(`Searched for listings in ${city}`);
    });
}
//Scraper func
function scrapeListings() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Inside scrapeListings');
        let browser, page;
        try {
            const result = yield setBrowser();
            browser = result.browser;
            page = result.page;
            // await page.click('button', { delay: 7000 })
            console.log('Page was set');
            const input = yield page.$('input');
            yield (input === null || input === void 0 ? void 0 : input.type('sylvania'));
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
        }
        catch (err) {
            console.log('Error scraping listings', err);
            throw err;
        }
        finally {
            // if (browser) browser?.close();
        }
    });
}
scrapeListings().catch(console.error);
