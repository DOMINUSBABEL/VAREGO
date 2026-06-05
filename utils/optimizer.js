function truncateCaption(caption, limit = 2200) {
    if (caption.length <= limit) return caption;
    return caption.substring(0, limit - 3) + "...";
}

function injectHashtags(caption, topic) {
    const tags = {
        tecnologia: "#AI #IA #Technology #Future #Tech #Innovation",
        capital: "#Economics #Market #FreeMarket #Capitalism #Business",
        geopolitica: "#Geopolitics #GlobalOrder #Strategy #History #World",
        colombia: "#Colombia #Politica #Electoral #Nacion #Bogota #Medellin"
    };
    const cleanTopic = (topic || '').toLowerCase();
    let selectedTags = tags.geopolitica;
    
    if (cleanTopic.includes('tecnol') || cleanTopic.includes('singular')) selectedTags = tags.tecnologia;
    else if (cleanTopic.includes('capital') || cleanTopic.includes('fiscal')) selectedTags = tags.capital;
    else if (cleanTopic.includes('colombia') || cleanTopic.includes('plenaria')) selectedTags = tags.colombia;
    
    return `${caption}\n\n${selectedTags}`;
}

module.exports = { truncateCaption, injectHashtags };
