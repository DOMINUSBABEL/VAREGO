const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class YouTubeShortsPublisher {
    constructor(profileDir, options = {}) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'youtube_shorts_profile');
        this.headless = options.headless !== undefined ? options.headless : false;
        this.browser = null;
        this.page = null;
    }
    
    async init() {
        this.browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: this.headless,
            userDataDir: this.profileDir,
            args: ['--window-size=1280,900', '--disable-notifications', '--no-sandbox']
        });
        const pages = await this.browser.pages();
        this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
        await this.page.setViewport({ width: 1280, height: 900 });
    }
    
    async verifyLogin() {
        console.log("Verifying YouTube Studio session...");
        await this.page.goto('https://studio.youtube.com/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 6000));
        if (this.page.url().includes('accounts.google.com')) {
            throw new Error("User is not logged in to YouTube Studio. Please authenticate first.");
        }
        return true;
    }
    
    async uploadVideo(filePath) {
        if (!fs.existsSync(filePath)) throw new Error(`Video file does not exist: ${filePath}`);
        console.log("Uploading Shorts video...");
        await this.page.click('#create-icon');
        await new Promise(r => setTimeout(r, 1000));
        await this.page.click('#upload-button');
        await new Promise(r => setTimeout(r, 2000));
        const fileInput = await this.page.$('input[type="file"]');
        await fileInput.uploadFile(filePath);
        await new Promise(r => setTimeout(r, 8000));
    }
    
    async setVisibility() {
        console.log("Setting visibility to Public...");
        // Click Visibility Tab
        await this.page.click('#step-badge-3');
        await new Promise(r => setTimeout(r, 2000));
        
        // Select Public radio button
        await this.page.evaluate(() => {
            const publicRadio = document.querySelector('[name="PUBLIC"]');
            if (publicRadio) publicRadio.click();
        });
        await new Promise(r => setTimeout(r, 1000));
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}
module.exports = { YouTubeShortsPublisher };
