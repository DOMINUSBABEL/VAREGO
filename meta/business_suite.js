const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class BusinessSuitePublisher {
    constructor(profileDir, options = {}) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'business_suite_profile');
        this.headless = options.headless !== undefined ? options.headless : false;
        this.browser = null;
        this.page = null;
    }
    
    async init() {
        this.browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: this.headless,
            userDataDir: this.profileDir,
            args: ['--window-size=1400,950', '--disable-notifications', '--no-sandbox']
        });
        const pages = await this.browser.pages();
        this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
        await this.page.setViewport({ width: 1400, height: 950 });
    }
    
    async verifyLogin() {
        await this.page.goto('https://business.facebook.com/latest/composer', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 8000));
    }
    
    async publishThread(texts, filePaths = []) {
        await this.init();
        try {
            await this.verifyLogin();
            
            // Loop through thread slides
            for (let i = 0; i < texts.length; i++) {
                console.log(`Publishing thread slide ${i+1}/${texts.length}`);
                
                const editor = '[contenteditable="true"], textarea';
                await this.page.waitForSelector(editor);
                await this.page.click(editor);
                
                // Clear and write
                await this.page.keyboard.down('Control');
                await this.page.keyboard.press('A');
                await this.page.keyboard.up('Control');
                await this.page.keyboard.press('Backspace');
                
                await this.page.keyboard.type(texts[i], { delay: 10 });
                await new Promise(r => setTimeout(r, 2000));
                
                if (filePaths[i]) {
                    const fileInput = await this.page.$('input[type="file"]');
                    await fileInput.uploadFile(filePaths[i]);
                    await new Promise(r => setTimeout(r, 8000));
                }
                
                // Publish button
                await this.page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                    const pub = buttons.find(b => b.innerText.includes('Publicar') || b.innerText.includes('Publish'));
                    if (pub) pub.click();
                });
                
                await new Promise(r => setTimeout(r, 10000));
                
                // Wait for reload or navigate back
                if (i < texts.length - 1) {
                    await this.page.goto('https://business.facebook.com/latest/composer', { waitUntil: 'domcontentloaded' });
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        } finally {
            await this.close();
        }
    }
    
    async publish(filePath, caption) {
        await this.publishThread([caption], [filePath]);
    }
    
    async close() { if (this.browser) await this.browser.close(); }
}
module.exports = { BusinessSuitePublisher };
