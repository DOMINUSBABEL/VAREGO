const { processCampaign } = require('./meta/scheduler');
const { renderCardImage, compileVideoDynamic } = require('./video/generator');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);

if (args.includes('--reset-progress')) {
    const progressPath = path.join(__dirname, 'meta', 'progress_meta.json');
    if (fs.existsSync(progressPath)) {
        fs.unlinkSync(progressPath);
        console.log("Progress tracker reset successfully.");
    }
} else if (args.includes('--preview')) {
    const text = "Preview Text rendering visual styles.";
    (async () => {
        await renderCardImage(text, 'PREVIEW', 'preview.png');
        console.log("Preview image generated at preview.png");
    })();
} else {
    processCampaign();
}
