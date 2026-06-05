const fs = require('fs');
const path = require('path');

function generateHtmlTemplate(text, topic, options = {}) {
    const themes = {
        cyberpunk: 'linear-gradient(135deg, #001f3f 0%, #000000 100%)',
        warm: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)',
        minimalist: '#0a0a0a'
    };
    const themeName = options.theme || 'warm';
    const bgGradient = themes[themeName] || themes.warm;
    const border = themeName === 'minimalist' ? '1px solid #333' : 'none';
    return `<div style="background: ${bgGradient}; border: ${border}; width: 1080px; height: 1920px;">${text}</div>`;
}
module.exports = { generateHtmlTemplate };
