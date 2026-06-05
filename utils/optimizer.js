function truncateCaption(caption, limit = 2200) {
    if (caption.length <= limit) return caption;
    return caption.substring(0, limit - 3) + "...";
}

function injectHashtags(caption, topic) {
    const tags = {
        tecnologia: "#AI #IA #Technology #Future #Tech #Innovation",
        capital: "#Economics #Market #FreeMarket #Capitalism #Business",
        geopolitica: "#Geopolitics #GlobalOrder #Strategy #History #World",
        colombia: "#Colombia #Politica #Electoral #Nacion"
    };
    const cleanTopic = (topic || '').toLowerCase();
    let selectedTags = tags.geopolitica;
    
    if (cleanTopic.includes('tecnol') || cleanTopic.includes('singular')) selectedTags = tags.tecnologia;
    else if (cleanTopic.includes('capital') || cleanTopic.includes('fiscal')) selectedTags = tags.capital;
    else if (cleanTopic.includes('colombia') || cleanTopic.includes('plenaria')) selectedTags = tags.colombia;
    
    return `${caption}\n\n${selectedTags}`;
}

function addSmartEmojis(caption, topic) {
    const cleanTopic = (topic || '').toLowerCase();
    let prefix = '✦ ';
    if (cleanTopic.includes('tecnol')) prefix = '🤖 ';
    else if (cleanTopic.includes('capital')) prefix = '📈 ';
    else if (cleanTopic.includes('colombia')) prefix = '🇨🇴 ';
    
    return `${prefix}${caption}`;
}

module.exports = { truncateCaption, injectHashtags, addSmartEmojis };
