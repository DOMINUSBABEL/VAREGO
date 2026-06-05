const { processCampaign } = require('./meta/scheduler');
const { renderCardImage, compileVideoDynamic } = require('./video/generator');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);

function importCSV(csvPath) {
    if (!fs.existsSync(csvPath)) return;
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(Boolean);
    const posts = lines.map(line => {
        const [topic, text, theme] = line.split(',');
        return { topic, text, theme };
    });
    fs.writeFileSync('meta_posts.json', JSON.stringify(posts, null, 2));
    console.log(`Imported ${posts.length} posts from CSV.`);
}

if (args.includes('--import')) {
    const idx = args.indexOf('--import');
    importCSV(args[idx + 1]);
} else if (args.includes('--reset-progress')) {
    const progressPath = path.join(__dirname, 'meta', 'progress_meta.json');
    if (fs.existsSync(progressPath)) {
        fs.unlinkSync(progressPath);
    }
} else {
    processCampaign();
}
