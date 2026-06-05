const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class TikTokPublisher {
    constructor(profileDir) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'tiktok_profile');
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
        console.log("Verifying TikTok login session...");
        await this.page.goto('https://www.tiktok.com/creator-center/upload', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 6000));
        
        const currentUrl = this.page.url();
        if (currentUrl.includes('login')) {
            throw new Error("User is not logged in to TikTok. Please run authentication utility first.");
        }
        console.log("TikTok login verified successfully.");
        return true;
    }
    
    async uploadVideo(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        console.log(`Uploading video to TikTok: ${filePath}`);
        
        const frames = this.page.frames();
        let targetFrame = this.page;
        for (const f of frames) {
            if (f.url().includes('upload') || f.name().includes('upload')) {
                targetFrame = f;
                break;
            }
        }
        
        const fileInputSelector = 'input[type="file"]';
        await targetFrame.waitForSelector(fileInputSelector, { timeout: 20000 });
        const fileInput = await targetFrame.$(fileInputSelector);
        await fileInput.uploadFile(filePath);
        console.log("Video uploaded. Waiting for TikTok processing...");
        await new Promise(r => setTimeout(r, 10000));
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = { TikTokPublisher };
