const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

(async () => {
    try {
        console.log("Launching anonymous browser...");
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            args: ['--window-size=1280,800', '--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        console.log("Navigating to tweet page...");
        await page.goto('https://x.com/PenguinWeb3/status/2061784475718090930', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 6000));

        // Get body text
        const bodyText = await page.evaluate(() => document.body.innerText);
        fs.writeFileSync('tweet_body_6.txt', bodyText);
        console.log("Dumped body text to tweet_body_6.txt");

        await browser.close();
        console.log("Finished target tweet 6 processing.");
    } catch (e) {
        console.error("Error:", e);
    }
})();
