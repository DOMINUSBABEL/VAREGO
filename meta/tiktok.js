const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const fs = require('fs');

class TikTokPublisher {
    constructor(profileDir, options = {}) {
        this.profileDir = profileDir || path.join(__dirname, '..', 'browser_profile', 'tiktok_profile');
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
        await this.page.goto('https://www.tiktok.com/creator-center/upload', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 6000));
    }
    
    async publishPhotoSlider(filePaths, caption) {
        await this.init();
        try {
            await this.verifyLogin();
            
            const frames = this.page.frames();
            let targetFrame = this.page;
            for (const f of frames) {
                if (f.url().includes('upload') || f.name().includes('upload')) {
                    targetFrame = f;
                    break;
                }
            }
            
            // Upload multiple files for slider
            const fileInput = await targetFrame.$('input[type="file"]');
            await fileInput.uploadFile(...filePaths);
            await new Promise(r => setTimeout(r, 10000));
            
            const editor = '[contenteditable="true"], textarea';
            await targetFrame.waitForSelector(editor);
            await targetFrame.click(editor);
            await this.page.keyboard.type(caption, { delay: 10 });
            await new Promise(r => setTimeout(r, 2000));
            
            await targetFrame.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const post = buttons.find(b => b.innerText.includes('Post') || b.innerText.includes('Publicar'));
                if (post) post.click();
            });
            await new Promise(r => setTimeout(r, 12000));
        } finally {
            await this.close();
        }
    }
    
    async publish(filePath, caption) {
        await this.publishPhotoSlider([filePath], caption);
    }
    
    async close() { if (this.browser) await this.browser.close(); }
}
module.exports = { TikTokPublisher };
