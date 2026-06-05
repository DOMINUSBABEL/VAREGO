const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class InstagramPublisher {
    constructor(profileDir, options = {}) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'instagram_profile');
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
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await this.page.setViewport({ width: 1280, height: 900 });
    }
    
    async verifyLogin() {
        await this.page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 4000));
    }
    
    async publishCarousel(filePaths, caption) {
        await this.init();
        try {
            await this.verifyLogin();
            console.log("Initiating Carousel upload...");
            const createBtn = 'svg[aria-label="Nueva publicación"], svg[aria-label="New post"]';
            await this.page.waitForSelector(createBtn, { visible: true });
            
            await this.page.evaluate((sel) => {
                const btn = document.querySelector(sel);
                if (btn) btn.parentElement.click();
            }, createBtn);
            await new Promise(r => setTimeout(r, 2000));
            
            const fileInput = await this.page.$('input[type="file"]');
            
            // Upload multiple files by passing array
            await fileInput.uploadFile(...filePaths);
            await new Promise(r => setTimeout(r, 6000));
            
            // Click next steps
            for (let i = 0; i < 2; i++) {
                await this.page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                    const next = buttons.find(b => b.innerText.toLowerCase() === 'siguiente' || b.innerText.toLowerCase() === 'next');
                    if (next) next.click();
                });
                await new Promise(r => setTimeout(r, 3000));
            }
            
            // Write caption and share
            const captionArea = 'div[aria-label="Escribe un pie de foto..."], textarea';
            await this.page.waitForSelector(captionArea);
            await this.page.click(captionArea);
            await this.page.keyboard.type(caption, { delay: 10 });
            await new Promise(r => setTimeout(r, 2000));
            
            await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                const share = buttons.find(b => b.innerText.toLowerCase() === 'compartir' || b.innerText.toLowerCase() === 'share');
                if (share) share.click();
            });
            await new Promise(r => setTimeout(r, 12000));
        } finally {
            await this.close();
        }
    }
    
    async publish(filePath, caption) {
        await this.publishCarousel([filePath], caption);
    }
    
    async close() { if (this.browser) await this.browser.close(); }
}
module.exports = { InstagramPublisher };
