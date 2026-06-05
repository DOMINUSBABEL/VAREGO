function truncateCaption(caption, limit = 2200) {
    if (caption.length <= limit) return caption;
    console.warn(`Caption length ${caption.length} exceeds limit ${limit}. Truncating...`);
    return caption.substring(0, limit - 3) + "...";
}
module.exports = { truncateCaption };
