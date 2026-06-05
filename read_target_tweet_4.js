const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
    try {
        console.log("Launching anonymous browser...");
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            args: ['--window-size=1280,800', '--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        console.log("Navigating to tweet page...");
        await page.goto('https://x.com/N01ennn/status/2062579312180547849', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 6000));

        // Get body text
        const bodyText = await page.evaluate(() => document.body.innerText);
        fs.writeFileSync('tweet_body_4.txt', bodyText);
        console.log("Dumped body text to tweet_body_4.txt");

        // Get image URLs
        const imageUrls = await page.evaluate(() => {
            const imgEls = Array.from(document.querySelectorAll('[data-testid="tweetPhoto"] img, [data-testid="tweetPhoto"] video, img[src*="media"]'));
            return [...new Set(imgEls.map(img => img.src).filter(src => src && src.startsWith('http')))];
        });

        console.log(`Found ${imageUrls.length} unique image/media URLs.`);
        
        // Ensure download directory exists
        const downloadDir = path.join(__dirname, 'downloaded_media_4');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        // Helper to download files
        const downloadFile = (url, dest) => {
            return new Promise((resolve, reject) => {
                const file = fs.createWriteStream(dest);
                https.get(url, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', (err) => {
                    fs.unlink(dest, () => {});
                    reject(err);
                });
            });
        };

        for (let i = 0; i < imageUrls.length; i++) {
            const imgUrl = imageUrls[i];
            console.log(`Downloading: ${imgUrl}`);
            let ext = '.jpg';
            if (imgUrl.includes('format=png')) ext = '.png';
            else if (imgUrl.includes('format=webp')) ext = '.webp';
            const destPath = path.join(downloadDir, `media_${i + 1}${ext}`);
            try {
                await downloadFile(imgUrl, destPath);
                console.log(`Saved to: ${destPath}`);
            } catch (err) {
                console.error(`Failed to download ${imgUrl}:`, err.message);
            }
        }

        await browser.close();
        console.log("Finished target tweet 4 processing.");
    } catch (e) {
        console.error("Error:", e);
    }
})();
