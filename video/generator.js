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

function compileVideoStatic(imagePath, outputPath, duration = 8, fps = 25) {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -c:v libx264 -t ${duration} -r ${fps} -pix_fmt yuv420p "${outputPath}"`;
        exec(cmd, (err) => {
            if (err) return reject(err);
            resolve(outputPath);
        });
    });
}

function compileVideoPanLeft(imagePath, outputPath, duration = 8, fps = 25) {
    return new Promise((resolve, reject) => {
        const totalFrames = duration * fps;
        const filter = `zoompan=z=1.1:d=${totalFrames}:x='(1-on/${totalFrames})*(iw-iw/zoom)':y='(ih-ih/zoom)/2':s=1080x1920`;
        const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -vf "${filter}" -c:v libx264 -t ${duration} -r ${fps} -pix_fmt yuv420p "${outputPath}"`;
        exec(cmd, (err) => {
            if (err) return reject(err);
            resolve(outputPath);
        });
    });
}

function compileVideoPanRight(imagePath, outputPath, duration = 8, fps = 25) {
    return new Promise((resolve, reject) => {
        const totalFrames = duration * fps;
        const filter = `zoompan=z=1.1:d=${totalFrames}:x='(on/${totalFrames})*(iw-iw/zoom)':y='(ih-ih/zoom)/2':s=1080x1920`;
        const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -vf "${filter}" -c:v libx264 -t ${duration} -r ${fps} -pix_fmt yuv420p "${outputPath}"`;
        exec(cmd, (err) => {
            if (err) return reject(err);
            resolve(outputPath);
        });
    });
}

module.exports = { renderCardImage, compileVideoStatic, compileVideoPanLeft, compileVideoPanRight };
