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
        console.log("YouTube Studio session verified.");
        return true;
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}
module.exports = { YouTubeShortsPublisher };
