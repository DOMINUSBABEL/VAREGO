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

    console.log(`Rendering post card using Puppeteer...`);
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1920 });
        await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
        
        await page.screenshot({ path: outputPath, type: 'png' });
        console.log(`Saved screenshot to: ${outputPath}`);
    } finally {
        await browser.close();
        if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
        }
    }
}

function compileVideoStatic(imagePath, outputPath, duration = 8, fps = 25) {
    return new Promise((resolve, reject) => {
        console.log(`Compiling static video with FFmpeg for ${duration}s...`);
        const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -c:v libx264 -t ${duration} -r ${fps} -pix_fmt yuv420p "${outputPath}"`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error(`FFmpeg compile error:`, stderr);
                return reject(err);
            }
            console.log(`Static video compiled successfully: ${outputPath}`);
            resolve(outputPath);
        });
    });
}

module.exports = { renderCardImage, compileVideoStatic };
