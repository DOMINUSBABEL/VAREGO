const fs = require('fs');
const path = require('path');

function logTimelineEvent(event, details) {
    const logPath = path.join(__dirname, '..', 'campaign_timeline.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    logs.push({
        timestamp: new Date().toISOString(),
        event,
        details
    });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}
module.exports = { logTimelineEvent };
