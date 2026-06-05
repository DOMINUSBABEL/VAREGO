const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class BusinessSuitePublisher {
    constructor(profileDir) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'business_suite_profile');
        this.browser = null;
        this.page = null;
    }
    
    async init() {
        this.browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            userDataDir: this.profileDir,
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
                '--window-size=1400,950',
                '--disable-notifications',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });
        const pages = await this.browser.pages();
        this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await this.page.setViewport({ width: 1400, height: 950 });
    }
    
    async verifyLogin() {
        console.log("Verifying Meta Business Suite session...");
        await this.page.goto('https://business.facebook.com/latest/composer', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 8000));
        
        const currentUrl = this.page.url();
        if (currentUrl.includes('login')) {
            throw new Error("Not logged in to Business Suite. Please run authentication utility first.");
        }
        console.log("Business Suite login verified successfully.");
        return true;
    }
    
    async uploadMedia(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        console.log(`Uploading media to Meta Business Suite: ${filePath}`);
        
        const fileInputSelector = 'input[type="file"]';
        await this.page.waitForSelector(fileInputSelector, { timeout: 20000 });
        const fileInput = await this.page.$(fileInputSelector);
        await fileInput.uploadFile(filePath);
        await new Promise(r => setTimeout(r, 8000));
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = { BusinessSuitePublisher };
