const { generateHtmlTemplate } = require('./video/template');
const fs = require('fs');

const cyberpunkHtml = generateHtmlTemplate("Cyberpunk Test Text", "CYBERPUNK", { theme: "cyberpunk" });
fs.writeFileSync('test_cyberpunk.html', cyberpunkHtml);
console.log("Test retro/cyberpunk HTML generated.");
