const fs = require('fs');
const path = require('path');

function generateHtmlTemplate(text, topic, options = {}) {
    const themes = {
        neon: 'linear-gradient(135deg, #050505 0%, #150020 100%)',
        warm: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)',
        dark: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
        cold: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        gold: 'linear-gradient(135deg, #141517 0%, #322514 100%)',
        cyberpunk: 'linear-gradient(135deg, #001f3f 0%, #000000 100%)',
        minimalist: '#0a0a0a'
    };
    
    const themeName = options.theme || 'warm';
    const bgGradient = themes[themeName] || themes.warm;
    
    let fontSize = '44px';
    if (text.length > 280) fontSize = '32px';
    else if (text.length > 180) fontSize = '38px';
    
    const firstLetterColor = themeName === 'cyberpunk' ? '#00ff00' : (themeName === 'neon' ? '#39ff14' : '#ffd700');
    const logoGradient = themeName === 'cyberpunk' ? 'linear-gradient(45deg, #ff007f, #00ffff)' : (themeName === 'neon' ? 'linear-gradient(45deg, #00f2fe, #4facfe)' : 'linear-gradient(45deg, #8a2387, #e94057)');
    
    const borderRadius = options.borderRadius || '50px';
    const cardBorder = themeName === 'minimalist' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)';
    const cardShadow = options.shadowDepth || (themeName === 'minimalist' ? 'none' : '0 40px 80px rgba(0, 0, 0, 0.5)');
    
    const watermarkHtml = options.watermarkUrl 
        ? `<img src="${options.watermarkUrl}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover;" />`
        : `<div class="logo-placeholder">V</div>`;
        
    const cardPadding = text.length < 100 ? '120px 80px' : '80px 70px';
    const topicStyle = topic.length > 20 ? 'font-size: 18px; line-height: 1.3;' : 'font-size: 22px;';
    const brandName = options.brandName || 'VAREGO';
    
    const fontOption = options.fontFamily || 'Outfit';
    const fontImport = fontOption === 'Inter' 
        ? "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');"
        : "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');";
    
    const activeFont = fontOption === 'Inter' ? "'Inter', sans-serif" : "'Outfit', sans-serif";
    
    const slideNumberOverlay = options.slideIndex !== undefined && options.totalSlides !== undefined
        ? `<div style="position: absolute; bottom: 80px; right: 80px; font-size: 24px; color: rgba(255,255,255,0.4); font-weight: 800;">${options.slideIndex + 1}/${options.totalSlides}</div>`
        : '';

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        ${fontImport}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            width: 1080px;
            height: 1920px;
            background: ${bgGradient};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: ${activeFont};
            color: #ffffff;
            overflow: hidden;
            padding: 80px;
            position: relative;
        }
        .glow-circle {
            position: absolute;
            width: 700px;
            height: 700px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            filter: blur(120px);
            z-index: 1;
        }
        .glow-1 { top: 10%; left: -15%; background: rgba(138, 35, 135, 0.25); }
        .glow-2 { bottom: 10%; right: -15%; background: rgba(242, 113, 33, 0.25); }
        .card {
            width: 920px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(35px);
            -webkit-backdrop-filter: blur(35px);
            border: ${cardBorder};
            border-radius: ${borderRadius};
            padding: ${cardPadding};
            box-shadow: ${cardShadow};
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 1450px;
        }
        .header { display: flex; align-items: center; gap: 24px; }
        .logo-placeholder {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: ${logoGradient};
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 32px;
            box-shadow: 0 4px 20px rgba(233, 64, 87, 0.3);
        }
        .brand-name {
            font-weight: 800;
            font-size: 36px;
            letter-spacing: 2px;
            text-transform: uppercase;
            background: linear-gradient(to right, #ffffff, ${firstLetterColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .topic {
            font-weight: 800;
            color: ${firstLetterColor};
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-top: 6px;
            word-wrap: break-word;
            max-width: 600px;
        }
        .content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 40px 0;
        }
        .post-text {
            font-size: ${fontSize};
            line-height: 1.6;
            font-weight: 400;
            text-align: left;
            color: #fbfbfb;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .post-text::first-letter {
            font-size: 90px;
            font-weight: 800;
            color: ${firstLetterColor};
            font-family: 'Playfair Display', serif;
            float: left;
            margin-right: 20px;
            line-height: 0.8;
            margin-top: 12px;
        }
        .footer {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .handle { font-size: 30px; color: rgba(255, 255, 255, 0.8); font-weight: 600; }
        .decor { font-size: 28px; color: rgba(255, 255, 255, 0.3); letter-spacing: 8px; }
    </style>
</head>
<body>
    <div class="glow-circle glow-1"></div>
    <div class="glow-circle glow-2"></div>
    <div class="card">
        <div class="header">
            ${watermarkHtml}
            <div>
                <div class="brand-name">${brandName}</div>
                <div class="topic" style="${topicStyle}">${topic}</div>
            </div>
        </div>
        <div class="content">
            <p class="post-text">${text}</p>
        </div>
        <div class="footer">
            <span class="handle">@VaregoAI</span>
            <span class="decor">✦ ✦ ✦</span>
        </div>
    </div>
    ${slideNumberOverlay}
</body>
</html>`;
}

module.exports = { generateHtmlTemplate };
