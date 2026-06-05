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
    const borderRadius = options.borderRadius || '50px';
    const shadow = options.shadowDepth || '0 40px 80px rgba(0,0,0,0.5)';
    return `<div style="background: ${bgGradient}; border-radius: ${borderRadius}; box-shadow: ${shadow}; width: 1080px; height: 1920px;">${text}</div>`;
}
module.exports = { generateHtmlTemplate };
