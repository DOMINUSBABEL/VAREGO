const { processCampaign } = require('./meta/scheduler');
const { renderCardImage, compileVideoDynamic } = require('./video/generator');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);

async function runWizard() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise(r => rl.question(q, r));
    console.log("=== VAREGO CLI WIZARD ===");
    const enableIg = await ask("Enable Instagram? (y/n): ");
    const enableTt = await ask("Enable TikTok? (y/n): ");
    
    const configPath = path.join(__dirname, 'meta', 'meta_config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.instagram.enabled = enableIg.toLowerCase() === 'y';
    config.tiktok.enabled = enableTt.toLowerCase() === 'y';
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    rl.close();
}

if (args.includes('--wizard')) {
    runWizard();
} else if (args.includes('--validate')) {
    console.log("Checking VAREGO dependencies and files...");
    const files = ['meta/meta_config.json', 'meta_posts.json', 'package.json'];
    let valid = true;
    for (const f of files) {
        if (!fs.existsSync(f)) {
            console.error(`Missing: ${f}`);
            valid = false;
        }
    }
    if (valid) console.log("Verified.");
} else if (args.includes('--preview')) {
    const text = "Preview Text rendering visual styles.";
    (async () => {
        await renderCardImage(text, 'PREVIEW', 'preview.png');
        console.log("Preview image generated at preview.png");
    })();
} else {
    processCampaign();
}
