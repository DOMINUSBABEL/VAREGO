const fs = require('fs');
const path = require('path');

function generateHtmlTemplate(text, topic, bgGradient) {
    const defaultGradients = [
        'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
        'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)',
        'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        'linear-gradient(135deg, #111111 0%, #2a2a2a 100%)'
    ];
    const gradient = bgGradient || defaultGradients[Math.floor(Math.random() * defaultGradients.length)];
    
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
            background: ${gradient};
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
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            filter: blur(100px);
            z-index: 1;
        }
        .glow-1 { top: 15%; left: -10%; background: rgba(138, 35, 135, 0.25); }
        .glow-2 { bottom: 15%; right: -10%; background: rgba(242, 113, 33, 0.25); }
        .card {
            width: 920px;
            background: rgba(255, 255, 255, 0.07);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 40px;
            padding: 70px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 1400px;
        }
        .header { display: flex; align-items: center; gap: 24px; }
        .logo-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(45deg, #8a2387, #e94057);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 28px;
            box-shadow: 0 4px 20px rgba(233, 64, 87, 0.4);
        }
        .brand-name {
            font-weight: 800;
            font-size: 34px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            background: linear-gradient(to right, #ffffff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .topic {
            font-size: 22px;
            font-weight: 800;
            color: #ffd700;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-top: 6px;
        }
        .content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 50px 0;
        }
        .post-text {
            font-size: 44px;
            line-height: 1.6;
            font-weight: 400;
            text-align: left;
            color: #fcfcfc;
            text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .post-text::first-letter {
            font-size: 85px;
            font-weight: 800;
            color: #ffd700;
            font-family: 'Playfair Display', serif;
            float: left;
            margin-right: 18px;
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
        .handle { font-size: 28px; color: rgba(255, 255, 255, 0.75); font-weight: 600; }
        .decor { font-size: 26px; color: rgba(255, 255, 255, 0.35); letter-spacing: 6px; }
    </style>
</head>
<body>
    <div class="glow-circle glow-1"></div>
    <div class="glow-circle glow-2"></div>
    <div class="card">
        <div class="header">
            <div class="logo-placeholder">V</div>
            <div>
                <div class="brand-name">VAREGO INTELECTO</div>
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
