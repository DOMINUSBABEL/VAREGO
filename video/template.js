const fs = require('fs');
const path = require('path');

function generateHtmlTemplate(text, topic, options = {}) {
    const themes = {
        neon: 'linear-gradient(135deg, #050505 0%, #150020 100%)',
        warm: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)',
        dark: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
        cold: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        gold: 'linear-gradient(135deg, #141517 0%, #322514 100%)'
    };
    
    const themeName = options.theme || 'warm';
    const bgGradient = themes[themeName] || themes.warm;
    
    let fontSize = '44px';
    if (text.length > 280) fontSize = '32px';
    else if (text.length > 180) fontSize = '38px';
    
    const firstLetterColor = themeName === 'neon' ? '#39ff14' : '#ffd700';
    const logoGradient = themeName === 'neon' ? 'linear-gradient(45deg, #00f2fe, #4facfe)' : 'linear-gradient(45deg, #8a2387, #e94057)';

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            width: 1080px;
            height: 1920px;
            background: ${bgGradient};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Outfit', sans-serif;
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
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 50px;
            padding: 80px 70px;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
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
            background: linear-gradient(to right, #ffffff, #cfcfcf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .topic {
            font-size: 22px;
            font-weight: 800;
            color: ${firstLetterColor};
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-top: 6px;
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
            <div class="logo-placeholder">V</div>
            <div>
                <div class="brand-name">VAREGO</div>
                <div class="topic">${topic}</div>
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
</body>
</html>`;
}

module.exports = { generateHtmlTemplate };
