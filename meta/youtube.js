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
    
    async publish(filePath, title, description) {
        await this.init();
        try {
            await this.verifyLogin();
            
            // Trigger upload modal
            await this.page.waitForSelector('#create-icon', { visible: true });
            await this.page.click('#create-icon');
            await new Promise(r => setTimeout(r, 1000));
            
            const uploadBtn = await this.page.$('#upload-button-menu-item') || await this.page.$('ytd-compact-link-renderer');
            await uploadBtn.click();
            await new Promise(r => setTimeout(r, 2000));
            
            const fileInput = await this.page.$('input[type="file"]');
            await fileInput.uploadFile(filePath);
            await new Promise(r => setTimeout(r, 8000));
            
            // Set details: Title and description
            console.log("Typing title...");
            const titleInput = await this.page.$('[id="textbox"]');
            await titleInput.click();
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.keyboard.type(title + " #Shorts", { delay: 10 });
            await new Promise(r => setTimeout(r, 2000));
            
            // Select 'Not made for kids' radio button
            await this.page.evaluate(() => {
                const radio = document.querySelector('[name="VIDEO_MADE_FOR_KIDS_NOT_MADE_FOR_KIDS"]');
                if (radio) radio.click();
            });
            await new Promise(r => setTimeout(r, 2000));
            
            // Go to visibility and publish
            for (let i = 0; i < 3; i++) {
                await this.page.click('#next-button');
                await new Promise(r => setTimeout(r, 2000));
            }
            
            // Select Public
            await this.page.evaluate(() => {
                const radios = Array.from(document.querySelectorAll('[role="radio"]'));
                const publicRadio = radios.find(r => r.innerText.includes('Público') || r.innerText.includes('Public'));
                if (publicRadio) publicRadio.click();
            });
            await new Promise(r => setTimeout(r, 2000));
            
            // Click Publish
            console.log("Publishing Shorts...");
            await this.page.click('#done-button');
            await new Promise(r => setTimeout(r, 10000));
            console.log("Shorts published successfully!");
        } finally {
            await this.close();
        }
    }
    
    async close() {
        if (this.browser) await this.browser.close();
    }
}
module.exports = { YouTubeShortsPublisher };
