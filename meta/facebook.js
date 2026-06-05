const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class FacebookPublisher {
    constructor(profileDir) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'facebook_profile');
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
                '--window-size=1280,900',
                '--disable-notifications',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });
        const pages = await this.browser.pages();
        this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await this.page.setViewport({ width: 1280, height: 900 });
    }
    
    async verifyLogin() {
        console.log("Verifying Facebook login session...");
        await this.page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 4000));
        
        const isLoggedIn = await this.page.evaluate(() => {
            return document.querySelector('[aria-label="Crear publicación"], [aria-label="Create post"]') !== null || 
                   document.querySelector('[data-testid="Keycommands_wrapper"]') !== null;
        });
        
        if (!isLoggedIn) {
            throw new Error("User is not logged in to Facebook. Please run authentication utility first.");
        }
        console.log("Facebook login verified successfully.");
        return true;
    }
    
    async publish(filePath, caption) {
        await this.init();
        try {
            await this.verifyLogin();
            console.log("Opening create post dialog...");
            
            await this.page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('div[role="button"]'));
                const trigger = elements.find(el => {
                    const txt = el.innerText || '';
                    return txt.includes('¿Qué estás pensando') || txt.includes("What's on your mind");
                });
                if (trigger) trigger.click();
            });
            await new Promise(r => setTimeout(r, 3000));
            
            console.log("Entering status caption...");
            const inputSelector = 'div[role="textbox"]';
            await this.page.waitForSelector(inputSelector, { visible: true, timeout: 15000 });
            await this.page.click(inputSelector);
            await new Promise(r => setTimeout(r, 500));
            await this.page.keyboard.type(caption, { delay: 10 });
            await new Promise(r => setTimeout(r, 1500));
            
            console.log("Uploading media file...");
            const fileInputSelector = 'input[type="file"]';
            await this.page.waitForSelector(fileInputSelector, { timeout: 15000 });
            const fileInput = await this.page.$(fileInputSelector);
            await fileInput.uploadFile(filePath);
            await new Promise(r => setTimeout(r, 6000));
            
            console.log("Clicking Post/Publish button...");
            const published = await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                const postBtn = buttons.find(b => {
                    const txt = (b.innerText || '').trim().toLowerCase();
                    return txt === 'publicar' || txt === 'post';
                });
                if (postBtn) {
                    postBtn.click();
                    return true;
                }
                return false;
            });
            
            if (!published) {
                throw new Error("Could not click Facebook Post button");
            }
            
            console.log("Waiting for Facebook post completion...");
            await new Promise(r => setTimeout(r, 12000));
            console.log("Facebook post completed!");
        } finally {
            await this.close();
        }
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = { FacebookPublisher };
