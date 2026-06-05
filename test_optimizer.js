const { truncateCaption, injectHashtags, addSmartEmojis } = require('./utils/optimizer');

console.log("Testing optimizer utilities...");
const caption = "Analizando el Espíritu Absoluto de silicio.";
const truncated = truncateCaption(caption);
const hashtags = injectHashtags(caption, "tecnologia");
const emojified = addSmartEmojis(caption, "tecnologia");

if (emojified.startsWith('🤖') && hashtags.includes('#AI')) {
    console.log("Optimizer unit tests passed successfully.");
} else {
    console.error("Optimizer unit tests failed.");
}
