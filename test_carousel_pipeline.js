const { generateHtmlTemplate } = require('./video/template');
const fs = require('fs');

const cyberpunkHtml = generateHtmlTemplate("Cyberpunk Test Text", "CYBERPUNK", { theme: "cyberpunk" });
fs.writeFileSync('test_cyberpunk.html', cyberpunkHtml);

const minimalistHtml = generateHtmlTemplate("Minimalist Test Text", "MINIMALIST", { theme: "minimalist" });
fs.writeFileSync('test_minimalist.html', minimalistHtml);
console.log("Test minimalist dark HTML generated.");
