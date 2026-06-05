const { renderCardImage, compileVideoDynamic } = require('./video/generator');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log("=== Testing Video Generator Pipeline ===");
    const text = "Este es un test de la funcionalidad de generación de vídeo dinámico para Varego. Estética premium, alta definición y transición fluida.";
    const topic = "TEST PIPELINE";
    
    const tempImg = path.join(__dirname, 'test_card.png');
    const outVideo = path.join(__dirname, 'test_video.mp4');
    
    try {
        await renderCardImage(text, topic, tempImg, { theme: 'neon' });
        console.log("Card image generated successfully.");
        
        await compileVideoDynamic(tempImg, outVideo, 5, 25);
        console.log("Video compiled successfully.");
        
        if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
        console.log("Test succeeded!");
    } catch (err) {
        console.error("Test failed:", err);
    }
})();
