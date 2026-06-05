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
    const width = options.width || 1080;
    const height = options.height || 1920;
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        await page.screenshot({ path: outputPath, type: 'png' });
    } finally {
        await browser.close();
        if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    }
}

function compileVideoDynamic(imagePath, outputPath, duration = 8, fps = 25, options = {}) {
    return new Promise((resolve, reject) => {
        const width = options.width || 1080;
        const height = options.height || 1920;
        const totalFrames = duration * fps;
        const filter = `zoompan=z='min(zoom+0.0008,1.08)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
        const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -vf "${filter}" -c:v libx264 -t ${duration} -r ${fps} -pix_fmt yuv420p "${outputPath}"`;
        exec(cmd, (err) => {
            if (err) return reject(err);
            resolve(outputPath);
        });
    });
}

module.exports = { renderCardImage, compileVideoDynamic };
