const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

(async () => {
    try {
        console.log("Launching browser to view scheduled tweets...");
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false, 
            userDataDir: path.join(__dirname, 'browser_profile'),
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
                '--window-size=1280,800', 
                '--disable-notifications',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-infobars'
            ]
        });
        const pages = await browser.pages();
        let xPage = pages.length > 0 ? pages[0] : await browser.newPage();
        await xPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await xPage.setViewport({ width: 1280, height: 800 });
        
        await xPage.goto('https://x.com/compose/tweet/unsent/scheduled', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for scheduled tweets page to load...");
        // Wait for some container that lists unsent tweets.
        // On X, the path is `/compose/tweet/unsent/scheduled`
        await new Promise(r => setTimeout(r, 10000));
        
        console.log("Extracting scheduled tweets text and dates...");
        const unsentList = await xPage.evaluate(() => {
            const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
            return cells.map(c => c.innerText);
        });
        
        console.log("Scheduled Tweets List:\n", unsentList);
        
        await browser.close();
    } catch (e) {
        console.error("Error listing scheduled tweets:", e);
    }
})();
