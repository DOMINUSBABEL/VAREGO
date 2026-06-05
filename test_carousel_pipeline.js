const { generateHtmlTemplate } = require('./video/template');
const { renderCardImage } = require('./video/generator');
const fs = require('fs');

(async () => {
    // Generate slides images for carousel
    for (let i = 0; i < 3; i++) {
        await renderCardImage(`Slide ${i+1} Content`, "CAROUSEL", `slide_${i}.png`, {
            slideIndex: i,
            totalSlides: 3
        });
    }
    console.log("Carousel test slides generated.");
})();
