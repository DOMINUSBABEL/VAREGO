const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');

(async () => {
    try {
        console.log("Launching browser to inspect composer...");
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
        
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for homepage/composer to load...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 20000 });
        
        console.log("Composer found. Clicking schedule button...");
        const scheduleButtons = await xPage.$$('[data-testid="scheduleOption"]');
        const scheduleBtn = scheduleButtons[0];
        if (!scheduleBtn) throw new Error("Schedule button not found");
        
        await xPage.evaluate(el => el.click(), scheduleBtn);
        
        console.log("Waiting for schedule modal...");
        await Promise.race([
            xPage.waitForSelector('[aria-modal="true"] select', { visible: true, timeout: 10000 }),
            xPage.waitForSelector('[role="dialog"] select', { visible: true, timeout: 10000 })
        ]);
        
        console.log("Schedule modal loaded. Extracting select elements structure...");
        const selectData = await xPage.evaluate(() => {
            const selects = Array.from(document.querySelectorAll('[aria-modal="true"] select, [role="dialog"] select'));
            return selects.map((sel, idx) => {
                const options = Array.from(sel.options).map(opt => ({
                    value: opt.value,
                    text: opt.text
                }));
                return {
                    index: idx,
                    outerHTML: sel.outerHTML.substring(0, 150),
                    optionsCount: sel.options.length,
                    options: options.slice(0, 15) // print first 15 options
                };
            });
        });
        
        console.log("Select Data:\n", JSON.stringify(selectData, null, 2));
        
        await browser.close();
    } catch (e) {
        console.error("Error inspecting composer:", e);
    }
})();
