const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class InstagramPublisher {
    constructor(profileDir) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'instagram_profile');
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
        console.log("Verifying Instagram login session...");
        await this.page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 4000));
        
        const isLoggedIn = await this.page.evaluate(() => {
            return document.querySelector('svg[aria-label="Nueva publicación"]') !== null || 
                   document.querySelector('svg[aria-label="New post"]') !== null ||
                   document.querySelector('a[href="/direct/inbox/"]') !== null;
        });
        
        if (!isLoggedIn) {
            throw new Error("User is not logged in to Instagram. Please run authentication utility first.");
        }
        console.log("Instagram login verified successfully.");
        return true;
    }
    
    async uploadMedia(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        console.log(`Starting media upload for: ${filePath}`);
        
        const createBtnSelector = 'svg[aria-label="Nueva publicación"], svg[aria-label="New post"]';
        await this.page.waitForSelector(createBtnSelector, { visible: true, timeout: 15000 });
        
        await this.page.evaluate((sel) => {
            const svg = document.querySelector(sel);
            if (svg) {
                let parent = svg.parentElement;
                while (parent && parent.tagName !== 'BUTTON' && parent.tagName !== 'A') {
                    parent = parent.parentElement;
                }
                if (parent) parent.click();
                else svg.click();
            }
        }, createBtnSelector);
        
        await new Promise(r => setTimeout(r, 2000));
        
        const fileInputSelector = 'input[type="file"]';
        await this.page.waitForSelector(fileInputSelector, { timeout: 15000 });
        const fileInput = await this.page.$(fileInputSelector);
        
        console.log("Uploading file...");
        await fileInput.uploadFile(filePath);
        await new Promise(r => setTimeout(r, 5000));
    }
    
    async finalizePost(caption) {
        console.log("Finalizing Instagram post...");
        
        for (let i = 0; i < 2; i++) {
            console.log(`Clicking next step ${i + 1}/2...`);
            const nextBtnText = await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
                const nextBtn = buttons.find(b => {
                    const txt = (b.innerText || '').trim().toLowerCase();
                    return txt === 'siguiente' || txt === 'next';
                });
                if (nextBtn) {
                    nextBtn.click();
                    return true;
                }
                return false;
            });
            if (!nextBtnText) {
                console.log("Next button not found, executing fallback click...");
                await this.page.evaluate(() => {
                    const headers = Array.from(document.querySelectorAll('header'));
                    for (const header of headers) {
                        const buttons = Array.from(header.querySelectorAll('div[role="button"]'));
                        if (buttons.length > 0) {
                            buttons[buttons.length - 1].click();
                        }
                    }
                });
            }
            await new Promise(r => setTimeout(r, 3000));
        }
        
        console.log("Typing caption...");
        const captionAreaSelector = 'div[aria-label="Escribe un pie de foto..."], div[aria-label="Write a caption..."], textarea';
        await this.page.waitForSelector(captionAreaSelector, { visible: true, timeout: 15000 });
        await this.page.click(captionAreaSelector);
        await new Promise(r => setTimeout(r, 500));
        
        await this.page.keyboard.type(caption, { delay: 10 });
        await new Promise(r => setTimeout(r, 2000));
        
        console.log("Clicking Share button...");
        const shared = await this.page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
            const shareBtn = buttons.find(b => {
                const txt = (b.innerText || '').trim().toLowerCase();
                return txt === 'compartir' || txt === 'share';
            });
            if (shareBtn) {
                shareBtn.click();
                return true;
            }
            return false;
        });
        
        if (!shared) {
            throw new Error("Could not find Share button");
        }
        
        console.log("Waiting for Instagram upload completion...");
        await new Promise(r => setTimeout(r, 12000));
        console.log("Instagram posting completed successfully!");
    }
    
    async publish(filePath, caption) {
        await this.init();
        try {
            await this.verifyLogin();
            await this.uploadMedia(filePath);
            await this.finalizePost(caption);
        } finally {
            await this.close();
        }
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = { InstagramPublisher };
