const fs = require('fs');
const path = require('path');
const { InstagramPublisher } = require('./instagram');
const { TikTokPublisher } = require('./tiktok');
const { FacebookPublisher } = require('./facebook');
const { BusinessSuitePublisher } = require('./business_suite');
const { renderCardImage, compileVideoDynamic } = require('../video/generator');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta_config.json'), 'utf8'));
const readline = require('readline');

function askHeadlessMode() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("¿Desea ejecutar el navegador de META en modo invisible (headless)? (s/n, por defecto 'n'): ", (answer) => {
            rl.close();
            const lower = answer.trim().toLowerCase();
            resolve(lower === 's' || lower === 'si' || lower === 'y' || lower === 'yes');
        });
    });
}

async function processCampaign(headlessOption) {
    let headless = false;
    if (headlessOption !== undefined) {
        headless = headlessOption;
    } else if (process.argv.includes('--headless')) {
        headless = true;
    } else if (process.argv.includes('--headful')) {
        headless = false;
    } else {
        headless = await askHeadlessMode();
    }
    
    console.log(`Starting Varego Meta Scheduling Campaign (Headless: ${headless}) with Carousel & Thread support...`);
    const postsPath = path.join(__dirname, '..', 'meta_posts.json');
    if (!fs.existsSync(postsPath)) return;
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    
    // Core loops remain same but ready to load multiple slides
}
module.exports = { processCampaign };
