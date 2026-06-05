const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { generateHtmlTemplate } = require('./template');

async function renderCardImage(text, topic, outputPath, options = {}) {
    const htmlContent = generateHtmlTemplate(text, topic, options);
    const tempHtmlPath = path.join(__dirname, 'temp_card.html');
    fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1920 });
        await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        await page.screenshot({ path: outputPath, type: 'png' });
    } finally {
        await browser.close();
        if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    }
}
module.exports = { renderCardImage };
