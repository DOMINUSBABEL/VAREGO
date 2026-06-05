const { processCampaign } = require('./meta/scheduler');
const { renderCardImage, compileVideoDynamic } = require('./video/generator');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--auth')) {
    require('./meta/auth');
} else if (args.includes('--generate-video')) {
    const textIdx = args.indexOf('--text');
    const topicIdx = args.indexOf('--topic');
    const outIdx = args.indexOf('--out');
    
    if (textIdx === -1 || topicIdx === -1 || outIdx === -1) {
        console.log("Usage: node meta_publisher_cli.js --generate-video --text <text> --topic <topic> --out <filepath>");
        process.exit(1);
    }
    
    const text = args[textIdx + 1];
    const topic = args[topicIdx + 1];
    const out = args[outIdx + 1];
    
    (async () => {
        const tempImg = out + '.png';
        await renderCardImage(text, topic, tempImg, { theme: 'warm' });
        await compileVideoDynamic(tempImg, out, 8, 25);
        if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
        console.log(`Video generated successfully at ${out}`);
    })();
} else {
    processCampaign();
}
