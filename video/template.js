const fs = require('fs');
const path = require('path');

function generateHtmlTemplate(text, topic, options = {}) {
    const themes = {
        cyberpunk: 'linear-gradient(135deg, #001f3f 0%, #000000 100%)',
        warm: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)'
    };
    const themeName = options.theme || 'warm';
    const bgGradient = themes[themeName] || themes.warm;
    const topicSize = topic.length > 20 ? '18px' : '24px';
    return `<div style="background: ${bgGradient}; width: 1080px; height: 1920px;"><h1 style="font-size: ${topicSize}">${topic}</h1>${text}</div>`;
}
module.exports = { generateHtmlTemplate };
