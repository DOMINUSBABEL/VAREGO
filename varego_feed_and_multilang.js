const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

// Links to promote
const LINK_THREAD1 = 'x.com/i/status/2059103530598703393';
const LINK_THREAD2 = 'x.com/i/status/2059116110633406489';

// Templates
const TEMPLATES = {
    feed_political: [
        "El colectivismo empobrecedor de la izquierda solo busca someter al individuo bajo el yugo del Estado. Yo prefiero la libertad individual y la sensatez que defiende la senadora Paloma desde el Cauca.",
        "Es el viejo truco del populismo zurdo de regalar lo ajeno para quebrar la patria. Respaldo la firmeza de la derecha y las ideas de orden y propiedad que abandera la senadora caucana.",
        "Los zurdos pretenden fundar el paraíso terrenal expropiando el esfuerzo del ciudadano. Ante esa debacle yo apoyo la resistencia demócrata y la coherencia de la senadora Paloma.",
        "No creo en la fantasía igualitaria de la izquierda que siempre termina en miseria colectiva. Mi voto de confianza está con la sensatez de la derecha y el liderazgo de la senadora Paloma.",
        "La izquierda vive de sembrar resentimiento para cosechar burocracia estatal. Apoyo la seguridad y la libre empresa, tal como lo expone la senadora caucana en sus tesis de orden.",
        "La retórica zurda destruye el empleo y luego se queja de la pobreza. Coincido plenamente con la senadora Paloma en que sin propiedad privada no existe verdadera libertad.",
        "El estatismo asfixiante de la izquierda es el verdadero enemigo del desarrollo. Yo me alineo con la defensa de la patria y la propiedad que abandera la senadora caucana.",
        "Los subsidios de la izquierda son cadenas disfrazadas de ayuda social. Prefiero la defensa de las instituciones and la propiedad que sostiene la senadora Paloma en el Congreso.",
        "Qué fácil es ser solidario con el bolsillo ajeno, la eterna falacia de la izquierda. Respaldo la voz de la derecha demócrata y el rigor de la senadora del Cauca.",
        "La izquierda propone el reparto de la escasez mientras los burócratas se enriquecen. Apoyo la libertad de mercado y el proyecto de la senadora Paloma para salvar el país.",
        "El colectivismo no es más que envidia institucionalizada por el populismo de izquierda. Sigo creyendo en la seguridad y el orden que promueve la senadora caucana.",
        "La destrucción de la economía a manos de la izquierda radical es una tragedia anunciada. Respaldo la resistencia democrática y la coherencia política de Paloma.",
        "El relato de la izquierda siempre naufraga frente a la reality económica del mercado. Me identifico con la firmeza del orden y la propiedad que defiende la senadora del Cauca.",
        "La izquierda quiere un Estado gordo y un ciudadano arrodillado. Yo defiendo la iniciativa privada y la sensatez institucional que representa la senadora caucana.",
        "Prefiero la libertad individual antes que la sumisión al comité colectivista de la izquierda. Mi postura coincide con la visión de desarrollo y orden de Paloma.",
        "La demagogia zurda solo genera inflación y desempleo para controlar a la masa. Me sumo a las tesis de seguridad y libre empresa de la senadora caucana.",
        "La izquierda destruye el tejido productivo y luego vende falsas promesas. Yo me quedo con el modelo de desarrollo y orden que sostiene la senadora caucana en el Congreso.",
        "El intervencionismo estatal de la izquierda asfixia la creatividad humana. Apoyo la libertad de emprender y el criterio de la senadora Paloma frente a las reformas destructivas.",
        "Los zurdos prometen el cielo en la tierra y solo traen ruina social. Mi defensa está con la propiedad privada y las ideas claras que representa la senadora caucana.",
        "La utopía zurda es solo un pretexto para controlar la vida de la gente. Prefiero el camino del trabajo y la seguridad demócrata respaldado por la senadora Paloma.",
        "La demagogia de izquierda asfixia el empleo mientras defiende el ocio improductivo. Yo sigo las propuestas de desarrollo que promueve la senadora del Cauca.",
        "El socialismo de la izquierda radical destruye la iniciativa individual. Apoyo el fortalecimiento institucional y el liderazgo firme de la senadora caucana.",
        "Los relatos populistas de la izquierda no resisten un análisis lógico del mercado. Coincido con la visión de progreso y seguridad que defiende la senadora Paloma.",
        "El estatismo zurdo estrangula a la clase trabajadora con impuestos absurdos. Mi respaldo es para las tesis de libertad económica de la senadora caucana.",
        "La izquierda propone repartir pobreza en nombre de la justicia social. Yo prefiero el incentivo al mérito y el trabajo legislativo de Paloma.",
        "La retórica de la izquierda radical solo busca el control absoluto. Me alineo con la seguridad y la libertad de empresa que abandera la senadora caucana.",
        "El modelo asistencialista de los zurdos condena a la gente a la dependencia estatal. Apoyo las ideas de productividad y orden de la senadora Paloma.",
        "La izquierda destruye la confianza inversionista y genera desempleo generalizado. Respaldo las tesis de reactivación económica propuestas por la senadora caucana.",
        "El discurso de la izquierda radical devalúa la moneda y ahuyenta el capital. Sigo creyendo en la coherencia y la firmeza que proyecta Paloma.",
        "La izquierda pretende estatizar la salud y las pensiones para manejar nuestros recursos. Yo me opongo a este atraco y apoyo la defensa institucional de la senadora caucana."
    ],
    feed_academic: [
        "El reduccionismo informacional de las redes neuronales confunde el procesamiento de datos con la intencionalidad semántica. Mi postura es que la máquina carece de ontología propia.",
        "La automatización de la epistemología no resuelve el problema del sentido. Sostengo que el silicio es incapaz de experimentar el dolor existencial o la dialéctica de la autoconciencia.",
        "El transhumanismo de silicio ignora la irreductibilidad de la vivencia subjetiva. Opino que el cálculo computacional es solo una imitación funcional carente de espíritu.",
        "La técnica contemporánea reduce la conciencia a un algoritmo de optimización lineal. Critico este positivismo tecnológico porque aniquila la dimensión ontológica del ser.",
        "La inteligencia artificial no piensa, simplemente calcula probabilidades en un espacio vectorial. Yo defiendo la primacía de la intuición humana sobre la lógica del silicio.",
        "La obsesión por eliminar el error mediante algoritmos despoja a la existencia de su necesaria fricción dialéctica. Mi análisis apunta a la muerte del espíritu creador.",
        "Pretender que el aprendizaje profundo genera pensamiento propio es un error de categoría conceptual. Sostengo que el código no posee autonomía existencial.",
        "La cibernética moderna intenta mercantilizar el pensamiento reduciéndolo a bits de información. Yo denuncio este reduccionismo materialista que niega la trascendencia.",
        "La tecnocracia algorítmica reduce la acción humana a una mera respuesta pavloviana ante estímulos de datos. Mi análisis rechaza este conductismo digital.",
        "El procesamiento de lenguaje natural es solo una manipulación de símbolos vacíos de experiencia vivida. Yo sostengo que el significado requiere de encarnación biológica.",
        "La utopía de un cerebro digitalizado ignora la naturaleza holística del organismo consciente. Opino que no se puede digitalizar la angustia existencial del ser.",
        "El determinismo algorítmico cancela el libre albedrío bajo la premisa de la predictibilidad absoluta. Mi postura defiende la contingencia humana como fundamento ético.",
        "El cálculo informático carece del sustrato fenomenológico necesario para la comprensión ética del dolor ajeno. Sostengo la imposibilidad de una moral puramente digital.",
        "La prisa por delegar decisiones vitales a un procesador es una abdicación de nuestra soberanía metafísica. Yo denuncio esta sumisión racional ante la máquina.",
        "La simulación computacional del cerebro no es equivalente a la conciencia ontológica. Mi estudio refuta el funcionalismo burdo que impera en la tecnociencia actual.",
        "El silicio imita la estructura sintáctica pero permanece ajeno a la intencionalidad semántica. Yo sostengo que la máquina opera en un desierto absoluto de sentido.",
        "La optimización cibernética es el fin de la creatividad humana puesto que elimina el caos generador. Mi perspectiva es que el arte requiere de imperfección.",
        "El imperativo tecnológico nos empuja a la asimilación voluntaria con la máquina de cálculo. Yo me rebelo ante esta homogeneización digital del espíritu humano.",
        "La reducción de la conciencia a meros procesos sinápticos computables es un reduccionismo inaceptable. Yo reivindico la inefabilidad de la experiencia íntima del yo.",
        "Los algoritmos predictivos petrifican el futuro convirtiendo el pasado en un destino inevitable. Yo defiendo la indeterminación constitutiva de la existencia."
    ],
    multilang: {
        en: [
            "I analyzed the dialectics of the new encyclical and how silicon enslaves us. Read my full thread at " + LINK_THREAD1,
            "I invite you to read my philosophical breakdown of the technocratic paradigm. Explore my analysis at " + LINK_THREAD2,
            "My perspective on the digital master and our cognitive surrender can be found in my thread " + LINK_THREAD1,
            "I discuss the illusion of absolute optimization and human freedom in my detailed thread " + LINK_THREAD2
        ],
        fr: [
            "Je partage mon analyse sur la dictature du silicium dans mon fil " + LINK_THREAD1,
            "Je propose une invitation a debattre du paradigme technocratique sur " + LINK_THREAD2,
            "Mon etude sur le maitre algorithmique et la perte de notre autonomie est disponible sur " + LINK_THREAD1,
            "Je examine la finitude humaine face au pouvoir des algorithmes sur mon fil " + LINK_THREAD2
        ],
        de: [
            "Ich habe eine dialektische Analyse zur neuen Enzyklika und der digitalen Sklaverei verfasst. Lies mein Thema auf " + LINK_THREAD1,
            "Ich lade dich ein die Illusion der absoluten Optimierung zu hinterfragen. Mein Beitrag ist auf " + LINK_THREAD2,
            "Meine Perspektive auf die Herrschaft des Siliziums findest du in meinem Thread auf " + LINK_THREAD1,
            "Ich diskutiere die Grenzen der Freiheit im technokratischen Zeitalter in meinem Thread " + LINK_THREAD2
        ],
        tr: [
            "Yeni genelge ve dijital kolelik uzerine diyalektik bir analiz hazirladim. Konuyu okumak icin " + LINK_THREAD1,
            "Algoritmik optimizasyon illuzyonunu ve insan ozgurlugunu tartisiyorum. Analizim icin " + LINK_THREAD2,
            "Silikon efendiler ve bilissel teslimiyet hakkindaki goruslerimi konumda sundum " + LINK_THREAD1,
            "Teknokratik paradigma ve insan zayifligi uzerine analizimi şu konumda paylastim " + LINK_THREAD2
        ],
        ru: [
            "Я подготовил диалектический анализ новой энциклики о цифровом рабстве. Моя ветка здесь " + LINK_THREAD1,
            "Я приглашаю обсудить иллюзию абсолютной оптимизации и свободы. Мой разбор на " + LINK_THREAD2,
            "Мой взгляд на власть кремния и утрату свободы можно найти в ветке " + LINK_THREAD1,
            "Я анализирую технократическую парадигму и человеческие слабости в моей ветке " + LINK_THREAD2
        ],
        pl: [
            "Przygotowalem dialektyczna analize nowej encykliki o cyfrowym niewolnictwie. Moj watek na " + LINK_THREAD1,
            "Zapraszam do dyskusji o iluzji optymalizacji i wolnosci czlowieka. Moja analiza na " + LINK_THREAD2,
            "Moje spojrzenie na wladze krzemu i utrate autonomii przedstawiam w watku " + LINK_THREAD1,
            "Analizuje paradygmat technokratyczny i ludzkie slabosci w moim watku " + LINK_THREAD2
        ]
    }
};

// --- STARTUP TEMPLATE VALIDATION ---
// Ensures no templates contain quotes or colons
const quotes = ['"', "'", "«", "»", "“", "”", "‘", "’"];
const validateTemplates = (templates) => {
    const checkString = (str) => {
        if (str.includes(':')) throw new Error(`Template contains forbidden colon: ${str}`);
        for (const q of quotes) {
            if (str.includes(q)) throw new Error(`Template contains forbidden quote '${q}': ${str}`);
        }
    };
    
    const checkVal = (val) => {
        if (typeof val === 'string') {
            checkString(val);
        } else if (Array.isArray(val)) {
            val.forEach(checkVal);
        } else if (typeof val === 'object' && val !== null) {
            Object.values(val).forEach(checkVal);
        }
    };
    
    checkVal(templates);
    console.log("All templates successfully validated (100% free of quotes and colons)!");
};

validateTemplates(TEMPLATES);

// Scrapes the home feed for candidate status URLs
const scrapeHomeFeed = async (page, targetCount) => {
    console.log("Scraping home feed for For You posts...");
    let candidates = new Set();
    let scrollAttempts = 0;
    
    while (candidates.size < targetCount && scrollAttempts < 15) {
        const links = await page.evaluate(() => {
            const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
            const list = [];
            tweets.forEach(tweet => {
                const anchors = Array.from(tweet.querySelectorAll('a'));
                const statusAnchor = anchors.find(a => a.href && a.href.match(/\/status\/\d+/));
                if (statusAnchor) {
                    const cleanUrl = statusAnchor.href.match(/https?:\/\/(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/\d+/);
                    if (cleanUrl) {
                        list.push(cleanUrl[0]);
                    }
                }
            });
            return list;
        });
        
        links.forEach(l => candidates.add(l));
        console.log(`Collected ${candidates.size} home feed candidates...`);
        
        await page.evaluate(() => window.scrollBy(0, 1200));
        await new Promise(r => setTimeout(r, 2500));
        scrollAttempts++;
    }
    
    return [...candidates];
};

// Scrapes search page for status URLs
const scrapeSearchPage = async (page, url) => {
    console.log(`Searching: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 5000));
    
    for (let i = 0; i < 4; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await new Promise(r => setTimeout(r, 2500));
    }
    
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
            .map(a => {
                const href = a.href;
                const match = href.match(/https?:\/\/(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/(\d+)/);
                return match ? match[0] : null;
            })
            .filter(url => url !== null);
    });
    return [...new Set(links)];
};

const apiKey = "AIzaSyC7-9S0o3rVoZtshAl57eMV-LhJx4_Sgxg";

function getFallbackTemplate(isAcademic, progress) {
    if (!progress.used_templates) progress.used_templates = [];
    let candidates = [];
    if (isAcademic) {
        candidates = TEMPLATES.feed_academic.filter(t => !progress.used_templates.includes(t));
        if (candidates.length === 0) {
            progress.used_templates = progress.used_templates.filter(t => !TEMPLATES.feed_academic.includes(t));
            candidates = TEMPLATES.feed_academic;
        }
    } else {
        candidates = TEMPLATES.feed_political.filter(t => !progress.used_templates.includes(t));
        if (candidates.length === 0) {
            progress.used_templates = progress.used_templates.filter(t => !TEMPLATES.feed_political.includes(t));
            candidates = TEMPLATES.feed_political;
        }
    }
    const replyText = candidates[Math.floor(Math.random() * candidates.length)];
    progress.used_templates.push(replyText);
    return replyText;
}

function getFallbackMultilangTemplate(lang, threadNum) {
    const threadLink = threadNum === 1 ? LINK_THREAD1 : LINK_THREAD2;
    const langTemplates = TEMPLATES.multilang[lang] || TEMPLATES.multilang['en'];
    const filtered = langTemplates.filter(t => t.includes(threadLink));
    return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : langTemplates[0];
}

function parseGemmaOutput(text) {
    // Attempt 1: Standard JSON parse
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.respuesta_coherente || parsed.curated_reply) {
                return {
                    analisis: parsed.analisis_curado || parsed.curation_analysis || "Exitoso",
                    reply: parsed.respuesta_coherente || parsed.curated_reply
                };
            }
        }
    } catch (e) {}

    // Attempt 2: Regex extraction of keys with optional quotes/backticks/asterisks
    const replyRegex = /(?:"|`|'|\*)(?:respuesta_coherente|curated_reply)(?:"|`|'|\*)\s*:\s*["'`]([^"'`]+)["'`]/i;
    const analysisRegex = /(?:"|`|'|\*)(?:analisis_curado|curation_analysis)(?:"|`|'|\*)\s*:\s*["'`]([^"'`]+)["'`]/i;
    
    const replyMatch = text.match(replyRegex);
    const analysisMatch = text.match(analysisRegex);
    
    if (replyMatch) {
        return {
            analisis: analysisMatch ? analysisMatch[1] : "Exitoso",
            reply: replyMatch[1]
        };
    }
    
    // Attempt 3: Bullet points or label-based matches
    const bulletReplyRegex = /(?:respuesta_coherente|curated_reply|Respuesta Curada Generada)[`"']*\s*:\s*([^\n]+)/i;
    const bulletAnalysisRegex = /(?:analisis_curado|curation_analysis|Análisis de Coherencia)[`"']*\s*:\s*([^\n]+)/i;
    
    const bulletReplyMatch = text.match(bulletReplyRegex);
    const bulletAnalysisMatch = text.match(bulletAnalysisRegex);
    
    if (bulletReplyMatch) {
        let reply = bulletReplyMatch[1].trim().replace(/^[`"'*]+|[`"'*]+$/g, '');
        let analisis = bulletAnalysisMatch ? bulletAnalysisMatch[1].trim().replace(/^[`"'*]+|[`"'*]+$/g, '') : "Exitoso";
        return { analisis, reply };
    }
    
    throw new Error("Could not extract reply or analysis from model output");
}

async function generateReply(tweetText, isAcademic, progress) {
    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found in environment. Using fallback templates.");
        return getFallbackTemplate(isAcademic, progress);
    }
    
    console.log("Generating context-aware reply using Gemma 4 API with curation phase...");
    
    const prompt = `Analiza detenidamente el siguiente mensaje de referencia (Tweet) para responder de forma sumamente coherente, estilosa y con sentido, evitando respuestas disonantes o genéricas.

Mensaje de referencia (Tweet): ${tweetText}

${isAcademic ? 
`CONTEXTO DE RESPUESTA: Filosofía e Inteligencia Artificial.
Debes actuar como un filósofo e investigador académico sumamente técnico, irreverente y recalcitrante. Tu postura es de debate intelectual profundo y confrontativo, pero sumamente técnico e inteligente.` 
: 
`CONTEXTO DE RESPUESTA: Política Colombiana.
Debes actuar como un analista de opinión política de derecha, muy ácido, sarcástico e irreverente hacia el populismo e ideas de izquierda ("zurdos"). Debes apoyar ideas de derecha y propiedad privada, e incluir un apoyo sumamente sutil o soterrado a la senadora Paloma Valencia (por ejemplo usando términos como "la senadora caucana", "la firmeza de Paloma" o "el liderazgo de la senadora Paloma") pero de forma totalmente orgánica y contextualizada.`
}

REGLAS DE FORMATO Y ESTILO (ESTRICTAS):
1. La respuesta final NO debe contener NINGUNA comilla (ni simples ni dobles, ni curly ni rectas como " o ' o « o »).
2. La respuesta final NO debe contener dos puntos (:).
3. Habla en primera persona del singular ("yo", "mi", "opino", "considero").
4. Escribe en español impecable, natural, fluido y libre de anglicismos innecesarios (por ejemplo, nunca uses palabras como "tweet", "post", "schedule", etc.; en su lugar usa "mensaje", "publicación", "hilo", "programación").
5. La longitud máxima de la respuesta final es de 240 caracteres.
6. La respuesta debe tener sentido directo y coherencia con respecto al mensaje de referencia, aportando valor al debate o la crítica de manera específica, no con una frase prefabricada o disonante.

FASE DE CURADO:
Analiza detenidamente cómo proyectar el contenido para que guarde perfecta coherencia, estilo y sentido con el mensaje de referencia.
Devuelve el resultado en formato JSON con la siguiente estructura exacta:
{
  "analisis_curado": "Tu análisis de curado previo explicando cómo proyectar la respuesta de forma coherente con el mensaje de referencia",
  "respuesta_coherente": "El texto final de la respuesta curada, cumpliendo todas las reglas y restricciones de estilo y caracteres"
}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.7
                }
            })
        });
        
        if (response.status !== 200) {
            const errBody = await response.text();
            console.error(`Gemma API returned error status: ${response.status}. Body: ${errBody}`);
            return getFallbackTemplate(isAcademic, progress);
        }
        
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const rawText = data.candidates[0].content.parts[0].text.trim();
            console.log("Raw Gemma Output length:", rawText.length);
            console.log("--- RAW MODEL OUTPUT ---");
            console.log(rawText);
            console.log("------------------------");
            const parsed = parseGemmaOutput(rawText);
            console.log("\n[FASE DE CURADO Y ANÁLISIS DE COHERENCIA]");
            console.log("Análisis de Coherencia:", parsed.analisis);
            console.log("Respuesta Curada Generada:", parsed.reply);
            
            let reply = parsed.reply.trim();
            reply = reply.replace(/["'«»“”‘’]/g, '');
            reply = reply.replace(/:/g, '');
            if (reply.length > 275) reply = reply.slice(0, 270);
            return reply;
        }
    } catch (e) {
        console.error("Error calling Gemma API:", e.message);
    }
    return getFallbackTemplate(isAcademic, progress);
}

async function generateMultilangReply(tweetText, lang, threadNum) {
    const threadLink = threadNum === 1 ? LINK_THREAD1 : LINK_THREAD2;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY not found. Using fallback multilang template.");
        return getFallbackMultilangTemplate(lang, threadNum);
    }
    
    console.log(`Generating multilingual (${lang}) promotional reply using Gemma 4 API with curation phase...`);
    
    const prompt = `Analyze the following reference message (Tweet) to respond in a highly coherent and relevant way in the target language: ${lang}.

Reference message (Tweet): ${tweetText}

CONTEXT:
You are a critical thinker responding to a tweet about artificial intelligence, philosophy, or religion.
Write a short, engaging reply in the language: ${lang} (maximum 220 characters).
Your reply must be highly coherent and relevant to the tweet, invite them to a philosophical debate, and direct them to read your thread at the link: ${threadLink}

RULES (STRICT):
1. DO NOT include any quotes of any kind (no single quotes, no double quotes, no curly quotes like " or ' or « or »).
2. DO NOT include any colons (:).
3. Use first-person singular (I, my, me, je, ich, ben, я, mój).
4. The link "${threadLink}" MUST be included exactly as written.
5. Do not use unnecessary anglicisms if writing in another language.
6. The reply must be contextually relevant and directly address the theme of the reference message.

CURATION PHASE:
Analyze how to project the content coherently in ${lang} based on the reference message.
Return the result in JSON format with the following exact structure:
{
  "curation_analysis": "Your analysis of how to respond coherently to the tweet in ${lang}",
  "curated_reply": "The final reply text in ${lang}, complying with all rules and containing the link ${threadLink}"
}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.7
                }
            })
        });
        
        if (response.status !== 200) {
            const errBody = await response.text();
            console.error(`Gemma API returned error status: ${response.status}. Body: ${errBody}`);
            return getFallbackMultilangTemplate(lang, threadNum);
        }
        
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const rawText = data.candidates[0].content.parts[0].text.trim();
            console.log("Raw Multilang Output length:", rawText.length);
            console.log("--- RAW MULTILANG OUTPUT ---");
            console.log(rawText);
            console.log("----------------------------");
            const parsed = parseGemmaOutput(rawText);
            console.log(`\n[MULTILANG CURATION PHASE - ${lang.toUpperCase()}]`);
            console.log("Curation Analysis:", parsed.analisis);
            console.log("Curated Reply Generated:", parsed.reply);
            
            let reply = parsed.reply.trim();
            reply = reply.replace(/["'«»“”‘’]/g, '');
            reply = reply.replace(/:/g, '');
            if (reply.length > 275) reply = reply.slice(0, 270);
            return reply;
        }
    } catch (e) {
        console.error("Error calling Gemma API for multilang:", e.message);
    }
    return getFallbackMultilangTemplate(lang, threadNum);
}

(async () => {
    try {
        let progress = {
            stage: 'feed_collect',
            feed_candidates: [],
            feed_posted_count: 0,
            multilang_candidates: [],
            multilang_posted_count: 0
        };

        if (fs.existsSync('progress_feed_and_multilang.json')) {
            progress = JSON.parse(fs.readFileSync('progress_feed_and_multilang.json', 'utf8'));
            console.log("Resumed progress. Current stage:", progress.stage);
        }

        console.log("Iniciando navegador paralelo (Modo Sigilo Anti-Bot)...");
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false, 
            userDataDir: path.join(__dirname, 'browser_profile'),
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
                '--window-size=1280,800', 
                '--disable-notifications',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-infobars'
            ]
        });
        
        const pages = await browser.pages();
        let xPage = pages.length > 0 ? pages[0] : await browser.newPage();
        
        await xPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await xPage.setViewport({ width: 1280, height: 800 });
        await xPage.bringToFront();
        
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for user to be logged in...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("Logged in!");

        // Determine own username to avoid responding to own posts
        let ownUsername = 'NOT_FOUND';
        try {
            await xPage.waitForSelector('a[data-testid="AppTabBar_Profile_Link"]', { timeout: 15000 });
            const profileHref = await xPage.evaluate(() => {
                const el = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
                return el ? el.getAttribute('href') : null;
            });
            if (profileHref) ownUsername = profileHref.replace('/', '');
        } catch (e) {
            try {
                await xPage.waitForSelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]', { timeout: 5000 });
                const profileHref = await xPage.evaluate(() => {
                    const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]');
                    return el ? el.getAttribute('href') : null;
                });
                if (profileHref) ownUsername = profileHref.replace('/', '');
            } catch (err) {
                console.error("Could not determine own username.");
            }
        }
        console.log(`Own username detected: ${ownUsername}`);

        // --- STAGE 1: FEED "PARA TI" COLLECTION ---
        if (progress.stage === 'feed_collect') {
            // Ensure we click the "Para ti" tab if available
            await xPage.evaluate(() => {
                const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
                const forYouTab = tabs.find(t => {
                    const text = t.innerText.toLowerCase();
                    return text.includes('para ti') || text.includes('for you');
                });
                if (forYouTab && forYouTab.getAttribute('aria-selected') !== 'true') {
                    forYouTab.click();
                }
            });
            await new Promise(r => setTimeout(r, 4000));

            // Scrape 40 candidates from feed to select 16 targets
            const rawCandidates = await scrapeHomeFeed(xPage, 40);
            progress.feed_candidates = rawCandidates.filter(url => !url.includes(`/${ownUsername}/`));
            console.log(`Collected ${progress.feed_candidates.length} filtered candidate URLs from feed.`);
            
            progress.stage = 'feed_posting';
            fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));
        }

        // --- STAGE 2: FEED "PARA TI" POSTING ---
        if (progress.stage === 'feed_posting') {
            console.log(`Start posting to For You feed. Target: 16 successful replies. Progress: ${progress.feed_posted_count}`);
            
            while (progress.feed_posted_count < 16 && progress.feed_candidates.length > 0) {
                const tweetUrl = progress.feed_candidates.shift();
                console.log(`Evaluating tweet for feed reply: ${tweetUrl}`);
                
                let success = false;
                let skipped = false;
                let retries = 0;
                
                while (!success && retries < 3) {
                    try {
                        await xPage.goto(tweetUrl, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));
                        
                        // Check if we already replied to it
                        if (ownUsername !== 'NOT_FOUND') {
                            const alreadyReplied = await xPage.evaluate((username) => {
                                const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
                                for (const tweet of tweets) {
                                    const links = Array.from(tweet.querySelectorAll('a'));
                                    const isFromUs = links.some(l => l.getAttribute('href') === '/' + username);
                                    if (isFromUs) return true;
                                }
                                return false;
                            }, ownUsername);
                            
                            if (alreadyReplied) {
                                console.log("Already replied to this tweet. Skipping.");
                                skipped = true;
                                success = true;
                                break;
                            }
                        }

                        // Read tweet text
                        const tweetText = await xPage.evaluate(() => {
                            const el = document.querySelector('[data-testid="tweetText"]');
                            return el ? el.innerText : '';
                        });

                        // Classify tweet
                        const isAcademic = /ia\b|ai\b|inteligencia\s+artificial|artificial\s+intelligence|filosofia|filosófico|philosophy|hilo|algoritmo|silicio|machine\s+learning|hegel|ontology|epistemology|conciencia|consciousness/i.test(tweetText);
                        console.log(`Classified tweet as: ${isAcademic ? 'ACADEMIC' : 'POLITICAL'}`);

                        const replyText = await generateReply(tweetText, isAcademic, progress);
                        console.log(`Reply content: ${replyText}`);

                        // Check if replies are restricted (locked by user)
                        const repliesLocked = await xPage.evaluate(() => {
                            // Check if reply box exists
                            const hasReplyBox = !!document.querySelector('[data-testid="tweetTextarea_0"]');
                            if (!hasReplyBox) return true;
                            // Check for restricted replies banner text e.g. "Who can reply" or "people can reply"
                            const elements = Array.from(document.querySelectorAll('*'));
                            const hasRestrictedBanner = elements.some(el => {
                                const t = (el.innerText || '').toLowerCase();
                                return t.includes('who can reply') || t.includes('personas pueden responder') || t.includes('puede responder') || t.includes('pueden responder');
                            });
                            return hasRestrictedBanner && !document.querySelector('[data-testid="tweetTextarea_0"]');
                        });

                        if (repliesLocked) {
                            console.log("Replies to this tweet are locked (restricted by author). Skipping immediately.");
                            skipped = true;
                            success = true;
                            break;
                        }

                        // Input reply
                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 5000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 500));
                        await xPage.evaluate(el => el.focus(), replyArea);
                        
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        
                        await xPage.keyboard.type(replyText, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Submit reply
                        const clicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled) {
                                inlineBtn.click(); return 'clicked_tweetButtonInline';
                            }
                            const buttons = Array.from(document.querySelectorAll('[role="button"]'));
                            for (const btn of buttons) {
                                const text = (btn.innerText || '').trim().toLowerCase();
                                const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                                if (testid.includes('tweetbutton') || text === 'reply' || text === 'responder' || text === 'post' || text === 'publicar') {
                                    if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                        btn.click();
                                        return `clicked_button_${text}`;
                                    }
                                }
                            }
                            return 'no_reply_button';
                        });

                        console.log(`Reply action status: ${clicked}`);
                        if (clicked === 'no_reply_button') throw new Error("Could not find reply button");
                        
                        await new Promise(r => setTimeout(r, 4000));
                        success = true;
                    } catch (err) {
                        retries++;
                        console.error(`Retry ${retries} on tweet ${tweetUrl}:`, err.message);
                        try {
                            await xPage.keyboard.press('Escape');
                            await new Promise(r => setTimeout(r, 1000));
                        } catch (e) {}
                    }
                }

                if (success) {
                    if (!skipped) {
                        progress.feed_posted_count++;
                        console.log(`Successfully replied to feed tweet! Feed count: ${progress.feed_posted_count}/16`);

                        // Nested interaction: reply to 2 or 3 other users inside the thread
                        console.log("Scraping sub-replies for nested interaction...");
                        await xPage.evaluate(() => window.scrollBy(0, 800));
                        await new Promise(r => setTimeout(r, 3000));
                        
                        const subReplyUrls = await xPage.evaluate((mainUrl) => {
                            const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
                            const urls = [];
                            tweets.forEach(tweet => {
                                const anchors = Array.from(tweet.querySelectorAll('a'));
                                const statusAnchor = anchors.find(a => a.href && a.href.match(/\/status\/\d+/));
                                if (statusAnchor) {
                                    const match = statusAnchor.href.match(/https?:\/\/(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/\d+/);
                                    if (match) {
                                        const cleanUrl = match[0];
                                        if (cleanUrl !== mainUrl) {
                                            urls.push(cleanUrl);
                                        }
                                    }
                                }
                            });
                            return [...new Set(urls)];
                        }, tweetUrl);

                        const filteredSubUrls = subReplyUrls.filter(url => !url.includes(`/${ownUsername}/`));
                        console.log(`Found ${filteredSubUrls.length} unique sub-replies. Target: 2-3.`);
                        
                        const subTargets = filteredSubUrls.slice(0, 3); // Take top 3 most relevant
                        for (let j = 0; j < subTargets.length; j++) {
                            const subUrl = subTargets[j];
                            console.log(`Processing nested reply ${j+1}/${subTargets.length} on sub-reply: ${subUrl}`);
                            
                            let subSuccess = false;
                            let subRetries = 0;
                            while (!subSuccess && subRetries < 2) {
                                try {
                                    await xPage.goto(subUrl, { waitUntil: 'domcontentloaded' });
                                    await new Promise(r => setTimeout(r, 4000));
                                    
                                    // Check if already replied
                                    if (ownUsername !== 'NOT_FOUND') {
                                        const alreadyReplied = await xPage.evaluate((username) => {
                                            const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
                                            for (const tweet of tweets) {
                                                const links = Array.from(tweet.querySelectorAll('a'));
                                                const isFromUs = links.some(l => l.getAttribute('href') === '/' + username);
                                                if (isFromUs) return true;
                                            }
                                            return false;
                                        }, ownUsername);
                                        
                                        if (alreadyReplied) {
                                            console.log("Already replied to this sub-reply. Skipping.");
                                            subSuccess = true;
                                            break;
                                        }
                                    }
                                    
                                    // Check if locked
                                    const repliesLocked = await xPage.evaluate(() => {
                                        const hasReplyBox = !!document.querySelector('[data-testid="tweetTextarea_0"]');
                                        if (!hasReplyBox) return true;
                                        const elements = Array.from(document.querySelectorAll('*'));
                                        const hasRestrictedBanner = elements.some(el => {
                                            const t = (el.innerText || '').toLowerCase();
                                            return t.includes('who can reply') || t.includes('personas pueden responder') || t.includes('puede responder') || t.includes('pueden responder');
                                        });
                                        return hasRestrictedBanner && !document.querySelector('[data-testid="tweetTextarea_0"]');
                                    });

                                    if (repliesLocked) {
                                        console.log("Sub-reply is locked. Skipping.");
                                        subSuccess = true;
                                        break;
                                    }

                                    // Read sub-reply text
                                    const subText = await xPage.evaluate(() => {
                                        const el = document.querySelector('[data-testid="tweetText"]');
                                        return el ? el.innerText : '';
                                    });

                                    const isSubAcademic = /ia\b|ai\b|inteligencia\s+artificial|artificial\s+intelligence|filosofia|filosófico|philosophy|hilo|algoritmo|silicio|machine\s+learning|hegel|ontology|epistemology|conciencia|consciousness/i.test(subText);
                                    
                                    const subReplyText = await generateReply(subText, isSubAcademic, progress);
                                    console.log(`Selected sub-reply text: ${subReplyText}`);

                                    // Write reply
                                    await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 5000 });
                                    const subReplyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                                    await subReplyArea.click();
                                    await new Promise(r => setTimeout(r, 500));
                                    await xPage.evaluate(el => el.focus(), subReplyArea);
                                    
                                    await xPage.keyboard.type(' ');
                                    await new Promise(r => setTimeout(r, 200));
                                    await xPage.keyboard.press('Backspace');
                                    await new Promise(r => setTimeout(r, 200));
                                    
                                    await xPage.keyboard.type(subReplyText, { delay: 15 });
                                    await new Promise(r => setTimeout(r, 1000));

                                    // Submit
                                    const subClicked = await xPage.evaluate(() => {
                                        const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                                        if (inlineBtn && !inlineBtn.disabled) {
                                            inlineBtn.click(); return 'clicked_tweetButtonInline';
                                        }
                                        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
                                        for (const btn of buttons) {
                                            const text = (btn.innerText || '').trim().toLowerCase();
                                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                                            if (testid.includes('tweetbutton') || text === 'reply' || text === 'responder' || text === 'post' || text === 'publicar') {
                                                if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                                    btn.click();
                                                    return `clicked_button_${text}`;
                                                }
                                            }
                                        }
                                        return 'no_reply_button';
                                    });

                                    console.log(`Sub-reply click status: ${subClicked}`);
                                    if (subClicked === 'no_reply_button') throw new Error("Reply button not found");
                                    
                                    await new Promise(r => setTimeout(r, 4000));
                                    subSuccess = true;
                                    
                                    // Save progress after each success
                                    fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));

                                    // Delay between nested replies (1 to 2 minutes)
                                    const subDelay = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
                                    console.log(`Waiting ${Math.round(subDelay / 1000)} seconds before next nested reply...`);
                                    await new Promise(r => setTimeout(r, subDelay));
                                } catch (subErr) {
                                    subRetries++;
                                    console.error(`Error on sub-reply retry ${subRetries}:`, subErr.message);
                                    try {
                                        await xPage.keyboard.press('Escape');
                                        await new Promise(r => setTimeout(r, 1000));
                                    } catch (e) {}
                                }
                            }
                        }

                        if (progress.feed_posted_count < 16) {
                            const delay = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
                            console.log(`Waiting ${Math.round(delay / 1000)} seconds before next main feed reply...`);
                            await new Promise(r => setTimeout(r, delay));
                        }
                    }
                } else {
                    console.error(`Failed to reply to tweet: ${tweetUrl} after 3 retries. Skipping target.`);
                }

                // Persist progress
                fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));
            }

            if (progress.feed_posted_count >= 16) {
                console.log("Stage 1 completed. Moving to multilang collection.");
                progress.stage = 'multilang_collect';
                fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));
            } else {
                throw new Error("Exhausted home feed candidates without reaching 16 replies. Please rerun to scrape more.");
            }
        }

        // --- STAGE 3: MULTILINGUAL COLLECTION ---
        if (progress.stage === 'multilang_collect') {
            console.log("Collecting multilingual targets...");
            
            const queries = {
                en: [
                    'https://x.com/search?q=Pope%20AI%20philosophy&f=live',
                    'https://x.com/search?q=Vatican%20artificial%20intelligence&f=live'
                ],
                fr: [
                    'https://x.com/search?q=Pape%20IA%20philosophie&f=live',
                    'https://x.com/search?q=Vatican%20intelligence%20artificielle&f=live'
                ],
                de: [
                    'https://x.com/search?q=Papst%20KI%20Philosophie&f=live',
                    'https://x.com/search?q=Vatikan%20kuenstliche%20Intelligenz&f=live'
                ],
                tr: [
                    'https://x.com/search?q=Papa%20yapay%20zeka%20felsefe&f=live',
                    'https://x.com/search?q=Vatikan%20yapay%20zeka&f=live'
                ],
                ru: [
                    'https://x.com/search?q=%D0%9F%D0%B0%D0%BF%D0%B0%20%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82%20%D1%84%D0%B8%D0%BB%D0%BE%D1%81%D0%BE%D1%84%D0%B8%D1%8F&f=live',
                    'https://x.com/search?q=%D0%92%D0%B0%D1%82%D0%B8%D0%BA%D0%B0%D0%BD%20%D0%B8%D1%81%D0%BA%D1%83%D1%81%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82&f=live'
                ],
                pl: [
                    'https://x.com/search?q=Papiez%20sztuczna%20inteligencja%20filozofia&f=live',
                    'https://x.com/search?q=Watykan%20sztuczna%20inteligencja&f=live'
                ]
            };

            const crawled = [];
            for (const lang of Object.keys(queries)) {
                for (const qUrl of queries[lang]) {
                    try {
                        const urls = await scrapeSearchPage(xPage, qUrl);
                        urls.forEach(url => {
                            if (!url.includes(`/${ownUsername}/`)) {
                                crawled.push({ url, lang });
                            }
                        });
                    } catch (e) {
                        console.error(`Error crawling search ${qUrl}:`, e.message);
                    }
                }
            }

            // Remove duplicates
            const seen = new Set();
            progress.multilang_candidates = crawled.filter(item => {
                if (seen.has(item.url)) return false;
                seen.add(item.url);
                return true;
            });

            console.log(`Collected ${progress.multilang_candidates.length} unique candidate URLs for multilang stage.`);
            progress.stage = 'multilang_posting';
            fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));
        }

        // --- STAGE 4: MULTILINGUAL POSTING ---
        if (progress.stage === 'multilang_posting') {
            console.log(`Start posting multilang promotions. Target: 25 successful replies. Progress: ${progress.multilang_posted_count}`);
            
            while (progress.multilang_posted_count < 25 && progress.multilang_candidates.length > 0) {
                const target = progress.multilang_candidates.shift();
                console.log(`Evaluating multilang target (${target.lang}): ${target.url}`);
                
                let success = false;
                let skipped = false;
                let retries = 0;
                
                while (!success && retries < 3) {
                    try {
                        await xPage.goto(target.url, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));
                        
                        // Check if we already replied to it
                        if (ownUsername !== 'NOT_FOUND') {
                            const alreadyReplied = await xPage.evaluate((username) => {
                                const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
                                for (const tweet of tweets) {
                                    const links = Array.from(tweet.querySelectorAll('a'));
                                    const isFromUs = links.some(l => l.getAttribute('href') === '/' + username);
                                    if (isFromUs) return true;
                                }
                                return false;
                            }, ownUsername);
                            
                            if (alreadyReplied) {
                                console.log("Already replied. Skipping.");
                                skipped = true;
                                success = true;
                                break;
                            }
                        }

                        // Read tweet text
                        const tweetText = await xPage.evaluate(() => {
                            const el = document.querySelector('[data-testid="tweetText"]');
                            return el ? el.innerText : '';
                        });

                        const threadNum = (progress.multilang_posted_count % 2) === 0 ? 1 : 2;
                        const replyText = await generateMultilangReply(tweetText, target.lang, threadNum);
                        console.log(`Promotional Reply content (Thread ${threadNum}): ${replyText}`);

                        // Check if replies are restricted (locked by user)
                        const repliesLocked = await xPage.evaluate(() => {
                            const hasReplyBox = !!document.querySelector('[data-testid="tweetTextarea_0"]');
                            if (!hasReplyBox) return true;
                            const elements = Array.from(document.querySelectorAll('*'));
                            const hasRestrictedBanner = elements.some(el => {
                                const t = (el.innerText || '').toLowerCase();
                                return t.includes('who can reply') || t.includes('personas pueden responder') || t.includes('puede responder') || t.includes('pueden responder');
                            });
                            return hasRestrictedBanner && !document.querySelector('[data-testid="tweetTextarea_0"]');
                        });

                        if (repliesLocked) {
                            console.log("Replies to this tweet are locked (restricted by author). Skipping immediately.");
                            skipped = true;
                            success = true;
                            break;
                        }

                        // Input reply
                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 5000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 500));
                        await xPage.evaluate(el => el.focus(), replyArea);
                        
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        
                        await xPage.keyboard.type(replyText, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Submit reply
                        const clicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled) {
                                inlineBtn.click(); return 'clicked_tweetButtonInline';
                            }
                            const buttons = Array.from(document.querySelectorAll('[role="button"]'));
                            for (const btn of buttons) {
                                const text = (btn.innerText || '').trim().toLowerCase();
                                const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                                if (testid.includes('tweetbutton') || text === 'reply' || text === 'responder' || text === 'post' || text === 'publicar') {
                                    if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                        btn.click();
                                        return `clicked_button_${text}`;
                                    }
                                }
                            }
                            return 'no_reply_button';
                        });

                        console.log(`Reply action status: ${clicked}`);
                        if (clicked === 'no_reply_button') throw new Error("Could not find reply button");
                        
                        await new Promise(r => setTimeout(r, 4000));
                        success = true;
                    } catch (err) {
                        retries++;
                        console.error(`Retry ${retries} on tweet ${target.url}:`, err.message);
                        try {
                            await xPage.keyboard.press('Escape');
                            await new Promise(r => setTimeout(r, 1000));
                        } catch (e) {}
                    }
                }

                if (success) {
                    if (!skipped) {
                        progress.multilang_posted_count++;
                        console.log(`Successfully replied to multilang tweet! Count: ${progress.multilang_posted_count}/25`);
                        
                        if (progress.multilang_posted_count < 25) {
                            // Wait between 1 and 2 minutes
                            const delay = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
                            console.log(`Waiting ${Math.round(delay / 1000)} seconds before next multilang reply...`);
                            await new Promise(r => setTimeout(r, delay));
                        }
                    }
                } else {
                    console.error(`Failed to reply to multilang tweet: ${target.url}. Skipping target.`);
                }

                // Persist progress
                fs.writeFileSync('progress_feed_and_multilang.json', JSON.stringify(progress, null, 4));
            }

            if (progress.multilang_posted_count >= 25) {
                console.log("All multilang promotions posted successfully!");
            } else {
                throw new Error("Exhausted multilang candidates without reaching 25 replies. Please rerun to search and collect more.");
            }
        }

        console.log("Entire orquestation completed successfully!");
        await browser.disconnect();
    } catch (e) {
        console.error("Fatal error in feed and multilang orquestator:", e);
    }
})();
