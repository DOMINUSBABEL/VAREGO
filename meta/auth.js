const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    console.log("=== VAREGO META AUTHENTICATION UTILITY ===");
    console.log("Select platform to authenticate:");
    console.log("1. Instagram");
    console.log("2. TikTok");
    console.log("3. Facebook");
    console.log("4. Meta Business Suite");
    
    const choice = await askQuestion("Enter choice (1-4): ");
    let profileDirName = '';
    let targetUrl = '';
    
    switch(choice.trim()) {
        case '1':
            profileDirName = 'instagram_profile';
            targetUrl = 'https://www.instagram.com/';
            break;
        case '2':
            profileDirName = 'tiktok_profile';
            targetUrl = 'https://www.tiktok.com/';
            break;
        case '3':
            profileDirName = 'facebook_profile';
            targetUrl = 'https://www.facebook.com/';
            break;
        case '4':
            profileDirName = 'business_suite_profile';
            targetUrl = 'https://business.facebook.com/latest/composer';
            break;
        default:
            console.log("Invalid choice. Exiting.");
            rl.close();
            return;
    }
    
    console.log(`Launching browser using profile: ${profileDirName}`);
    console.log(`Please log in manually at: ${targetUrl}`);
    console.log(`Once you are logged in and ready, type 'exit' in the terminal to close the browser.`);
    
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        userDataDir: path.join(__dirname, '..', 'browser_profile', profileDirName),
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            '--window-size=1280,800',
            '--disable-notifications',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    
    let answer = '';
    while(answer.toLowerCase().trim() !== 'exit') {
        answer = await askQuestion("Type 'exit' to save session and close: ");
    }
    
    await browser.close();
    console.log("Session saved successfully.");
    rl.close();
})();
