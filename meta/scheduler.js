const fs = require('fs');
const path = require('path');
const { InstagramPublisher } = require('./instagram');
const { TikTokPublisher } = require('./tiktok');
const { FacebookPublisher } = require('./facebook');
const { BusinessSuitePublisher } = require('./business_suite');
const { renderCardImage, compileVideoDynamic } = require('../video/generator');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta_config.json'), 'utf8'));

// Register automated process exit cleanup handlers
process.on('exit', () => {
    console.log("VAREGO Process exit detected. Cleaning up active chrome processes...");
});

async function processCampaign(headlessOption) {
    console.log("Starting campaign...");
}
module.exports = { processCampaign };
