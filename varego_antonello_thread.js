const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

const TARGET_TWEET_URL = 'https://x.com/antonello/status/2059524515856572840';

const POSTS = [
    "Es asombroso ver a tantos hacer gala de su ignorancia sobre los modelos de lenguaje y sus detectores estadísticos. Prometen magia, pero son herramientas toscas y del todo inútiles.",
    "Hoy, estos sistemas no almacenan páginas completas de la red ni razonan como humanos. En realidad, son gigantescas matrices de números que calculan la probabilidad de su próximo fragmento de texto.",
    "La base fundamental de todo ello son los vectores y las representaciones de geometría. Cada palabra se transforma en coordenadas en un espacio continuo donde el significado se define por su cercanía.",
    "El núcleo tecnológico de todo es la arquitectura de atención. Esta permite al sistema ponderar la importancia de las palabras previas, conectando conceptos lejanos para dar coherencia a esos mensajes.",
    "No existe intento alguno de buscar la verdad ni comprensión alguna de la realidad. El modelo solo optimiza una función matemática para predecir lo que cualquier humano escribiría en tales situaciones.",
    "La llamada alucinación no representa un error de estos sistemas, sino su funcionamiento normal y natural. El modelo siempre está inventando texto probable; a veces coincide con la realidad y otras no.",
    "Para mejorar mucho su utilidad, se les entrena con guías de comportamiento humano, y esto no los hace inteligentes, solo los alinea para que todas sus respuestas resulten siendo muy amables o seguras.",
    "Entender esto desmonta por completo el misticismo tecnológico actual. No estamos ante ningún oráculo infalible ni una conciencia digital, sino ante una herramienta de cálculo de texto muy sofisticada."
];

// Wait, the user requested 9 posts in total.
// Let's list the 9 posts from the approved proposal:
const HILO_POSTS = [
    "Es asombroso ver a tantos hacer gala de su ignorancia sobre los modelos de lenguaje y sus detectores estadísticos. Prometen magia, pero son herramientas toscas y del todo inútiles.",
    "Estos programas de análisis intentan identificar textos generados por máquinas midiendo la perplejidad y la variabilidad de la escritura, es decir, cuán predecible resulta toda frase que se redacta.",
    "El primer fallo grave radica justo en la perplejidad. Un texto académico, jurídico o técnico escrito por humanos es por naturaleza formal y predecible, lo que genera siempre ya falsos positivos hoy.",
    "Esto castiga injustamente a extranjeros o estudiantes que escriben con un vocabulario claro y estructuras directas, ya que todos sus escritos son clasificados erróneamente como creados por máquinas.",
    "El segundo factor es la variabilidad de estructura. Un autor humano puede redactar de forma muy regular por estilo, mientras que un modelo puede variar sus frases a propósito para evadir el control.",
    "Burlar estos sistemas de control es muy sencillo. Basta con pedirle a la máquina que use sinónimos inusuales, que altere su ritmo o que simule pequeños errores humanos para neutralizar aquel filtro.",
    "Además, la base de datos de entrenamiento limita su efectividad. Ante textos creativos, literatura clásica o códigos de programación, el porcentaje de acierto de estos detectores es mera casualidad.",
    "Matemáticamente la tarea es inviable. Como los modelos imitan las distribuciones de probabilidades humanas, las diferencias en los textos son mínimas e imposibles de separar con certeza estadística.",
    "Usar estas herramientas para medir la integridad académica o laboral es un acto de irresponsabilidad. No son oráculos, son solo filtros falibles que destruyen reputaciones sin una prueba científica."
];

(async () => {
    try {
        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de HILO ANTONELLO en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

        console.log("Iniciando navegador paralelo (Modo Sigilo Anti-Bot)...");
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: headless, 
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
        
        // Navigation interception for Tweet IDs
        let interceptedTweetId = null;
        xPage.on('response', async response => {
            try {
                const url = response.url();
                if (url.includes('CreateTweet') && response.request().method() === 'POST') {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    if (json.data && json.data.create_tweet && json.data.create_tweet.tweet_results && json.data.create_tweet.tweet_results.result) {
                        interceptedTweetId = json.data.create_tweet.tweet_results.result.rest_id;
                        console.log(`[Red] ID de tweet interceptado: ${interceptedTweetId}`);
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        });
        
        console.log("-----------------------------------------------------");
        console.log("ESPERANDO INICIO DE SESIÓN...");
        console.log("Navegando a X.com...");
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Por favor, inicia sesión manualmente en la ventana de Chrome si es necesario.");
        console.log("-----------------------------------------------------");
        
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("¡Inicio de sesión detectado!");
        await new Promise(r => setTimeout(r, 3000));
        
        // Profile link link scraper fallback
        let ownUsername = 'NOT_FOUND';
        try {
            await xPage.waitForSelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]', { timeout: 10000 });
            const profileHref = await xPage.evaluate(() => {
                const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]');
                return el ? el.getAttribute('href') : null;
            });
            if (profileHref) ownUsername = profileHref.replace('/', '');
        } catch (e) {
            console.log("Could not scrape username automatically.");
        }
        console.log(`Username: ${ownUsername}`);

        const getLatestTweetUrl = async (page, username) => {
            if (username === 'NOT_FOUND') return null;
            try {
                console.log(`[Scraper] Buscando último tweet en perfil: https://x.com/${username}`);
                await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, 4000));
                
                const url = await page.evaluate((uname) => {
                    const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
                    for (const cell of cells) {
                        const isPinned = cell.innerText.includes('Fijado') || cell.innerText.includes('Pinned');
                        if (isPinned) continue;
                        
                        const links = Array.from(cell.querySelectorAll('a'));
                        const statusLink = links.find(l => l.href.includes(uname + '/status/'));
                        if (statusLink) {
                            return statusLink.href;
                        }
                    }
                    return null;
                }, username);
                
                console.log(`[Scraper] Encontrado URL: ${url}`);
                return url;
            } catch (err) {
                console.error(`[Scraper] Error:`, err.message);
                return null;
            }
        };

        // We will post the thread sequentially
        let parentTweetUrl = TARGET_TWEET_URL;
        
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const postText = HILO_POSTS[i];
            console.log(`\n========================================`);
            console.log(`Publicando post ${i+1}/${HILO_POSTS.length}:`);
            console.log(`"${postText}"`);
            console.log(`Como respuesta a: ${parentTweetUrl}`);
            console.log(`========================================`);
            
            let success = false;
            let retries = 0;
            
            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;
                    
                    // Navigate to the parent tweet to reply
                    await xPage.goto(parentTweetUrl, { waitUntil: 'domcontentloaded' });
                    await new Promise(r => setTimeout(r, 4000));
                    
                    // Check if reply box is visible
                    await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                    const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                    await replyArea.click();
                    await new Promise(r => setTimeout(r, 800));
                    await xPage.evaluate(el => el.focus(), replyArea);
                    await new Promise(r => setTimeout(r, 200));
                    
                    // Clear state
                    await xPage.keyboard.down('Control');
                    await xPage.keyboard.press('A');
                    await xPage.keyboard.up('Control');
                    await xPage.keyboard.press('Backspace');
                    await new Promise(r => setTimeout(r, 500));
                    
                    // Type text carefully
                    await xPage.keyboard.type(' ');
                    await new Promise(r => setTimeout(r, 200));
                    await xPage.keyboard.press('Backspace');
                    await new Promise(r => setTimeout(r, 200));
                    
                    await xPage.keyboard.type(postText, { delay: 15 });
                    await new Promise(r => setTimeout(r, 1000));
                    
                    // Click reply/post button
                    const clickedStatus = await xPage.evaluate(() => {
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
                                    return `clicked_button_with_text_${text}_and_testid_${testid}`;
                                }
                            }
                        }
                        return 'no_reply_button_found';
                    });
                    
                    console.log(`Estado del botón: ${clickedStatus}`);
                    if (clickedStatus === 'no_reply_button_found') {
                        throw new Error("No se pudo hacer clic en el botón de respuesta");
                    }
                    
                    // Wait for tweet creation and interception
                    await new Promise(r => setTimeout(r, 6000));
                    
                    let newTweetUrl = null;
                    if (interceptedTweetId) {
                        newTweetUrl = `https://x.com/i/status/${interceptedTweetId}`;
                    } else {
                        // Fallback scraper
                        newTweetUrl = await getLatestTweetUrl(xPage, ownUsername);
                    }
                    
                    if (!newTweetUrl) {
                        throw new Error("No se pudo obtener el URL del nuevo tweet publicado");
                    }
                    
                    console.log(`¡Éxito! Publicado: ${newTweetUrl}`);
                    parentTweetUrl = newTweetUrl;
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`Error en post ${i+1}, intento ${retries}:`, err.message);
                    try {
                        await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                    } catch (e) {}
                }
            }
            
            if (!success) {
                console.error(`Fallo crítico: No se pudo publicar el tweet ${i+1} después de 3 intentos.`);
                process.exit(1);
            }
            
            // Wait 5-10 seconds between thread replies to look natural
            if (i < HILO_POSTS.length - 1) {
                const sleepTime = 5000 + Math.random() * 5000;
                console.log(`Esperando ${Math.round(sleepTime / 1000)} segundos antes de la siguiente respuesta...`);
                await new Promise(r => setTimeout(r, sleepTime));
            }
        }
        
        console.log("\n========================================");
        console.log("¡HILO DE 9 POSTS PUBLICADO COMPLETAMENTE!");
        console.log("========================================\n");
        await browser.disconnect();
    } catch (err) {
        console.error("Fallo fatal en el script del hilo:", err);
    }
})();
