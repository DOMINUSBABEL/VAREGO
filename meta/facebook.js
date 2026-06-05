const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class FacebookPublisher {
    constructor(profileDir, options = {}) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'facebook_profile');
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
        await this.page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 4000));
    }
    
    async publishPhotos(filePaths, caption) {
        await this.init();
        try {
            await this.verifyLogin();
            
            // Trigger write box
            await this.page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('div[role="button"]'));
                const trigger = elements.find(el => el.innerText.includes('¿Qué estás pensando') || el.innerText.includes("What's on your mind"));
                if (trigger) trigger.click();
            });
            await new Promise(r => setTimeout(r, 3000));
            
            const textbox = 'div[role="textbox"]';
            await this.page.waitForSelector(textbox);
            await this.page.click(textbox);
            await this.page.keyboard.type(caption, { delay: 10 });
            await new Promise(r => setTimeout(r, 1000));
            
            // Upload multiple files
            const fileInput = await this.page.$('input[type="file"]');
            await fileInput.uploadFile(...filePaths);
            await new Promise(r => setTimeout(r, 8000));
            
            await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                const post = buttons.find(b => b.innerText.toLowerCase() === 'publicar' || b.innerText.toLowerCase() === 'post');
                if (post) post.click();
            });
            await new Promise(r => setTimeout(r, 12000));
        } finally {
            await this.close();
        }
    }
    
    async publish(filePath, caption) {
        await this.publishPhotos([filePath], caption);
    }
    
    async close() { if (this.browser) await this.browser.close(); }
}
module.exports = { FacebookPublisher };
