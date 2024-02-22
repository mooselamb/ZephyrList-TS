# Real Estate Web Scraper API Guide

Hello there! 👋 Welcome to the setup and testing guide for my Real Estate Web Scraper API. Designed to assist in finding real estate listings on Zillow.com based on Google search queries, this tool is built with TypeScript, Puppeteer, Node-Fetch, and Express.

## Prerequisites

Before diving in, ensure you have the following:

- **Node.js** installed on your machine.
- **TypeScript** and **ts-node** available globally or in your project.
- **Puppeteer** and **node-fetch** as part of your project dependencies.
- An **API key for Scraping Bot** (replace `ushafiq:FKtDHM69KDK07nmrlKuQTWOW3` with your actual credentials).

## Setup Instructions

1. **Setup**: Clone the repo or start a new TypeScript project and include the provided code.

2. **Install Dependencies**:

   ```bash
   npm install express puppeteer node-fetch dotenv
   ```

3. **Environment Variables**:
   For the purposes of this test guide I'm providing my personal username and APIKEY due to some setup issues with the .env file.

Please replace the `ushafiq:FKtDHM69KDK07nmrlKuQTWOW3` with your actual credentials if you want to play around with it further by signing up at [Scraping Bot](https://www.scraping-bot.io/) for some free credits.

4. **Launch the API**:

   ```bash
   node scraper.js
   ```

   or

   ```bash
    ts-node scraper.ts
   ```

5. **Testing with Postman**:
   Open Postman: If you don't have it yet, download it from https://www.postman.com/downloads/.

Configure Your Request:

Method: POST
URL: http://localhost:3000/search
Body: Choose raw and JSON, then input your query like so:

    ```json
    {
    "searchQuery": "top home listing websites zillow [location]"
    }
    ```
    Replace `[location]` with your desired location.

Send the Request: Click the Send button. The API will process and return a URL to a Zillow listing or a message if no matching site was found.

## Important Notes

The listings will be stored in a JSON file in the project directory. The file will be named `listings.json` and will be updated with each new search.

The API's performance depends on Puppeteer and the current state of web page structures.
Ensure your machine is set up for both sending and receiving requests securely.
Enjoy exploring real estate listings with my API! 🏠✨
