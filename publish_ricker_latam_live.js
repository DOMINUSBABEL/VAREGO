const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// Hilo de 7 posts de 600 a 700 caracteres cada uno, en español impecable, sin comillas ni guiones
const HILO_POSTS = [
    "La evolución de la inteligencia artificial nos ha llevado de interactuar con un asistente conversacional a coordinar verdaderas estructuras organizacionales autónomas de software. Un experimento demostró cómo Claude Opus actúa como arquitecto e inspector intelectual, delegando el trabajo pesado a un enjambre de trescientos agentes paralelos que operan bajo Kimi Swarm.\n\nEn una tarde este sistema ejecutó cuatro mil tareas coordinadas para construir y desplegar una plataforma de analítica financiera funcional sin intervención manual. Analizaremos esta metodología de desarrollo masivo en paralelo y cómo implementarla con éxito en el ecosistema técnico de América Latina y especialmente en Colombia. 👇",
    "El problema recurrente de usar un solo agente radica en su geometría lineal de ejecución. Aunque el modelo sea brillante realiza los procesos de forma secuencial lo que resulta ineficiente para proyectos complejos. Al cambiar la estructura a un sistema paralelo coordinado la velocidad se multiplica exponencialmente al resolver cientos de tareas en un mismo instante.\n\nPara lograrlo se divide el flujo en dos roles estrictos que nunca invaden la competencia del otro. El cerebro planifica y valida mientras el enjambre construye de forma autónoma. Esto evita desviaciones del objetivo y asegura que todas las piezas encajen en el diseño general sin generar código inservible.",
    "El flujo de desarrollo consta de cuatro fases críticas dirigidas por el modelo supervisor. Primero descompone el objetivo general en un árbol de dependencias lógicas en formato estructurado. Luego se despachan subagentes especializados para que realicen las tareas de ingesta de datos, base de datos, lógica de negocio e interfaz de usuario de manera paralela.\n\nFinalmente el supervisor realiza un control de calidad estricto sobre cada entregable antes de ensamblar el producto terminado. Esta revisión exhaustiva es el paso que previene el desorden y garantiza que la solución responda de forma coherente a los requerimientos técnicos y conceptuales del proyecto.",
    "En América Latina y en particular en Colombia la adopción de estas arquitecturas distribuidas representa una oportunidad histórica para cerrar la brecha de digitalización en las organizaciones. Las empresas locales pueden desplegar flujos de trabajo de nivel internacional sin requerir infraestructuras de servidores masivas o presupuestos de cómputo inalcanzables.\n\nLa implementación en el contexto local exige aprovechar tecnologías eficientes que combinen modelos comerciales de alta gama para supervisión con motores locales de código abierto. Esto democratiza el acceso a la automatización avanzada para las medianas y pequeñas empresas que impulsan la economía del país.",
    "Para ejecutar un enjambre de agentes en Colombia es indispensable resolver los desafíos de conectividad y latencia mediante el uso de bases de datos locales y estrategias de almacenamiento en caché. El modelo que realiza el razonamiento no debe sobrecargarse con tareas secundarias como el procesamiento de textos extensos o la consolidación de registros básicos del sistema.\n\nEs aconsejable delegar estas labores a modelos livianos que se ejecuten localmente mediante herramientas de código abierto como Ollama o vLLM. Esto optimiza el consumo de recursos de red y garantiza una respuesta ágil ante fallos de conexión que suelen ocurrir en algunas regiones del territorio.",
    "El enfoque metodológico requiere entrenar a los agentes con reglas de dominio específicas y no solo con instrucciones genéricas. En Colombia esto implica alimentar la memoria estable de los sistemas con normativas locales como la regulación de protección de datos, directrices fiscales vigentes e informes macroeconómicos actualizados que publiquen las entidades oficiales.\n\nAl integrar estas fuentes locales mediante el protocolo de contexto de modelo los agentes adquieren la capacidad de interpretar el mercado colombiano de forma precisa. Esto transforma la herramienta en un asistente de consultoría estratégica y de análisis financiero adaptado a la realidad nacional.",
    "El verdadero potencial de esta tecnología en nuestra región reside en transicionar de la mera optimización de tareas a la creación de valor estratégico integrado. El uso de enjambres permite generar de forma automatizada estudios de mercado, reportes analíticos avanzados y presentaciones comerciales con rigor técnico impecable y alineados con la cultura organizacional local.\n\nImplementar estas técnicas en las industrias locales no es solo una mejora de velocidad sino una decisión de soberanía operativa y tecnológica. Te invitamos a adoptar estas estructuras organizacionales de agentes para potenciar el desarrollo tecnológico de tu empresa en el entorno colombiano. 🔚"
];

// Mapeo de medios descargados para el segundo hilo (11 imágenes en downloaded_media_2)
const POST_MEDIA = {
    0: [
        path.join(__dirname, 'downloaded_media_2', 'media_1.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_2.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_3.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_4.jpg')
    ],
    1: [
        path.join(__dirname, 'downloaded_media_2', 'media_5.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_6.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_7.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_8.png')
    ],
    2: [
        path.join(__dirname, 'downloaded_media_2', 'media_9.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_10.jpg'),
        path.join(__dirname, 'downloaded_media_2', 'media_11.jpg')
    ]
};

const DELAY_MS = 8000;

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Publicador Live del Hilo Swarm LATAM");
        console.log(`Mensajes a publicar: ${HILO_POSTS.length}`);
        console.log("==================================================\n");

        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de X en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

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

        // Intercept network response to capture created Tweet ID
        let interceptedTweetId = null;
        xPage.on('response', async response => {
            try {
                const url = response.url();
                if ((url.includes('CreateTweet') || url.includes('create_tweet')) && response.request().method() === 'POST') {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    const createTweetData = json?.data?.create_tweet;
                    if (createTweetData) {
                        const findRestId = (obj) => {
                            if (!obj || typeof obj !== 'object') return null;
                            if (obj.rest_id) return obj.rest_id;
                            for (const key in obj) {
                                const res = findRestId(obj[key]);
                                if (res) return res;
                            }
                            return null;
                        };
                        const restId = findRestId(createTweetData);
                        if (restId) {
                            interceptedTweetId = restId;
                            console.log(`[Red] ✅ Identificador de publicación interceptado: ${interceptedTweetId}`);
                        }
                    }
                }
            } catch (e) {
                console.error("[Red] Error al interceptar respuesta:", e.message);
            }
        });

        // Navigate and wait for login session
        console.log("Navegando a X.com...");
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Esperando inicio de sesión...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("✅ Sesión detectada activa");
        await new Promise(r => setTimeout(r, 3000));

        // Get own username robustly
        let ownUsername = 'NeoDominusBabel';
        try {
            await new Promise(r => setTimeout(r, 2000));
            const detectedUname = await xPage.evaluate(() => {
                const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]') || 
                           document.querySelector('[data-testid="AppTabBar_Profile_Link"]') ||
                           document.querySelector('a[aria-label="Profile"]') ||
                           document.querySelector('a[aria-label="Perfil"]');
                if (el) {
                    const href = el.getAttribute('href');
                    if (href) return href.replace('/', '');
                }
                const handleEl = document.querySelector('[data-testid="UserAvatar-Container-profile"]');
                if (handleEl) {
                    const parentLink = handleEl.closest('a');
                    if (parentLink) {
                        const href = parentLink.getAttribute('href');
                        if (href) return href.replace('/', '');
                    }
                }
                const elements = Array.from(document.querySelectorAll('*'));
                for (const el of elements) {
                    if (el.children.length === 0 && el.innerText && el.innerText.startsWith('@')) {
                        const handle = el.innerText.replace('@', '').trim();
                        if (handle.length > 0 && handle.length < 30) return handle;
                    }
                }
                return null;
            });
            if (detectedUname) ownUsername = detectedUname;
        } catch (e) {
            console.log("No se pudo obtener el nombre de usuario de forma dinámica. Se usará el valor predeterminado.");
        }
        console.log(`Nombre de usuario detectado: @${ownUsername}\n`);

        const getLatestTweetUrl = async (page, uname) => {
            try {
                console.log(`[Búsqueda] Navegando al perfil: https://x.com/${uname}/with_replies`);
                await page.goto(`https://x.com/${uname}/with_replies`, { waitUntil: 'domcontentloaded' });
                await new Promise(r => setTimeout(r, 5000));
                return await page.evaluate((un) => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const statusLinks = links
                        .map(l => l.href)
                        .filter(href => href && href.includes(`/${un}/status/`));
                    
                    if (statusLinks.length === 0) return null;
                    
                    statusLinks.sort((a, b) => {
                        const idA = a.split('/status/')[1].split('?')[0].split('/')[0];
                        const idB = b.split('/status/')[1].split('?')[0].split('/')[0];
                        try {
                            const diff = BigInt(idB) - BigInt(idA);
                            return diff > 0n ? 1 : (diff < 0n ? -1 : 0);
                        } catch (e) {
                            return 0;
                        }
                    });
                    
                    return statusLinks[0];
                }, uname);
            } catch (err) {
                console.error("[Búsqueda] Error al buscar publicación en perfil:", err.message);
                return null;
            }
        };

        let parentTweetUrl = null;

        // Loop HILO_POSTS
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const postText = HILO_POSTS[i];
            const postNum = i + 1;
            const mediaFiles = POST_MEDIA[i] || [];

            if (i > 0) {
                console.log(`\n⏳ Esperando ${DELAY_MS / 1000} segundos antes del post ${postNum}/${HILO_POSTS.length}...`);
                await new Promise(r => setTimeout(r, DELAY_MS));
            }

            console.log(`\n--------------------------------------------------`);
            console.log(`📝 Publicando mensaje ${postNum}/${HILO_POSTS.length} en vivo`);
            console.log(`--------------------------------------------------`);

            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;

                    if (postNum === 1) {
                        // First post to home
                        console.log("Navegando al inicio para publicar el primer mensaje...");
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 3000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const textArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!textArea) throw new Error("Caja de texto no encontrada en inicio");

                        await textArea.click();
                        await new Promise(r => setTimeout(r, 800));
                        await xPage.evaluate(el => el.focus(), textArea);

                        // Upload Media
                        if (mediaFiles.length > 0) {
                            console.log(`[Media] Subiendo ${mediaFiles.length} imágenes...`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                const validFiles = mediaFiles.filter(f => fs.existsSync(f));
                                if (validFiles.length > 0) {
                                    await fileInputs[0].uploadFile(...validFiles);
                                    console.log("[Media] Imágenes cargadas en input");
                                }
                            }
                        }

                        // Type text
                        await xPage.keyboard.down('Control');
                        await xPage.keyboard.press('A');
                        await xPage.keyboard.up('Control');
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 800));

                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.type(postText, { delay: 10 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Wait for publish button to be ready
                        console.log("[Media] Esperando que el botón de publicación esté habilitado (máximo 60 segundos)...");
                        let buttonReady = false;
                        for (let check = 0; check < 60; check++) {
                            buttonReady = await xPage.evaluate(() => {
                                const btn = document.querySelector('[data-testid="tweetButtonInline"]') || document.querySelector('[data-testid="tweetButton"]');
                                return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
                            });
                            if (buttonReady) break;
                            await new Promise(r => setTimeout(r, 1000));
                        }
                        if (!buttonReady) throw new Error("El botón de publicación permaneció deshabilitado");

                        // Click Publish Button
                        console.log("[Componer] Enviando tweet...");
                        const postClicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled && inlineBtn.getAttribute('aria-disabled') !== 'true') {
                                inlineBtn.click(); return 'ok';
                            }
                            const mainBtn = document.querySelector('[data-testid="tweetButton"]');
                            if (mainBtn && !mainBtn.disabled && mainBtn.getAttribute('aria-disabled') !== 'true') {
                                mainBtn.click(); return 'ok';
                            }
                            return 'fail';
                        });

                        if (postClicked === 'fail') throw new Error("Botón de publicación no encontrado");
                        console.log("[Componer] Publicación enviada, obteniendo ID...");

                        await new Promise(r => setTimeout(r, 5000));

                        let newUrl = null;
                        const start = Date.now();
                        while (Date.now() - start < 15000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/i/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en el perfil del usuario...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener el ID del mensaje principal");
                        parentTweetUrl = newUrl;
                        console.log(`🎯 Mensaje principal publicado en: ${parentTweetUrl}`);
                        success = true;
                    } else {
                        // Subsequent replies
                        console.log(`Respondiendo a publicación previa: ${parentTweetUrl}`);
                        await xPage.goto(parentTweetUrl, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!replyArea) throw new Error("Caja de respuesta no encontrada");

                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 600));
                        await xPage.evaluate(el => el.focus(), replyArea);

                        // Upload Media for reply
                        if (mediaFiles.length > 0) {
                            console.log(`[Media] Subiendo ${mediaFiles.length} imágenes para la respuesta...`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                const validFiles = mediaFiles.filter(f => fs.existsSync(f));
                                if (validFiles.length > 0) {
                                    await fileInputs[0].uploadFile(...validFiles);
                                    console.log("[Media] Imágenes de respuesta cargadas en input");
                                }
                            }
                        }

                        await xPage.keyboard.type(postText, { delay: 10 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Wait for reply button to be ready
                        console.log("[Media] Esperando que el botón de respuesta esté habilitado (máximo 60 segundos)...");
                        let buttonReady = false;
                        for (let check = 0; check < 60; check++) {
                            buttonReady = await xPage.evaluate(() => {
                                const btn = document.querySelector('[data-testid="tweetButtonInline"]') || 
                                           document.querySelector('[data-testid="tweetButton"]') ||
                                           document.querySelector('[role="button"][data-testid*="reply"]');
                                return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
                            });
                            if (buttonReady) break;
                            await new Promise(r => setTimeout(r, 1000));
                        }

                        const replyClicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled && inlineBtn.getAttribute('aria-disabled') !== 'true') {
                                inlineBtn.click(); return 'ok';
                            }
                            const all = Array.from(document.querySelectorAll('[role="button"]'));
                            for (const b of all) {
                                const t = (b.innerText || '').trim().toLowerCase();
                                const tid = (b.getAttribute('data-testid') || '').toLowerCase();
                                if ((tid.includes('tweetbutton') || t === 'reply' || t === 'responder' || t === 'post' || t === 'publicar') && !b.disabled && b.getAttribute('aria-disabled') !== 'true') {
                                    b.click(); return 'ok';
                                }
                            }
                            return 'fail';
                        });

                        if (replyClicked === 'fail') throw new Error("Botón de respuesta no encontrado");
                        console.log("[Componer] Respuesta enviada, obteniendo ID...");

                        await new Promise(r => setTimeout(r, 5000));

                        let newUrl = null;
                        const start = Date.now();
                        while (Date.now() - start < 15000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/i/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en el perfil del usuario...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener el ID del mensaje de respuesta");
                        parentTweetUrl = newUrl;
                        console.log(`🎯 Mensaje ${postNum} publicado en: ${parentTweetUrl}`);
                        success = true;
                    }
                } catch (err) {
                    retries++;
                    console.error(`❌ Error en publicación ${postNum}, intento ${retries}: ${err.message}`);
                    try {
                        await xPage.keyboard.press('Escape');
                        await new Promise(r => setTimeout(r, 1000));
                        await xPage.keyboard.press('Escape');
                    } catch (e) {}
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (!success) {
                console.error(`💀 Fallo definitivo en publicación ${postNum}. Deteniendo.`);
                process.exit(1);
            }
        }

        console.log("\n==================================================");
        console.log(`🎉 HILO PUBLICADO CON EXITO LIVE: ${HILO_POSTS.length}/${HILO_POSTS.length} posts`);
        console.log("==================================================");
        await browser.close();
    } catch (err) {
        console.error("💀 Fallo crítico:", err);
        process.exit(1);
    }
})();
