const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// Hilo de 10 posts sobre automatización de YouTube con Claude Desktop y Mac Mini
// Español impecable, sin comillas ni guiones
const HILO_POSTS = [
    "La automatización de canales de contenido audiovisual suele fracasar debido al esfuerzo manual constante. La creación de guiones y edición requiere abrir herramientas y subir archivos todos los días.\n\nUna solución consiste en delegar la orquestación en agentes inteligentes que operen de forma ininterrumpida desde un computador de bajo costo. 👇",
    "El computador seleccionado es un Mac Mini con arquitectura de memoria unificada. Esta máquina resulta óptima por su bajo consumo eléctrico de unos diez vatios y su capacidad para procesar modelos locales de forma silenciosa.\n\nAl contar con treinta y dos gigabytes de memoria el procesamiento de datos y la inferencia son sumamente ágiles. 💻",
    "La clave de esta infraestructura radica en el uso de la capacidad de control de pantalla del modelo Claude. Al otorgar permisos de accesibilidad el agente interactúa con el sistema operativo tal como lo haría un humano.\n\nEl modelo abre el navegador e interactúa con diversas aplicaciones sin necesidad de integraciones de código complejas. ⚙️",
    "Para mantener la seguridad y evitar límites de uso diarios configuramos una cuenta independiente para el agente autónomo.\n\nAdemás redirigimos la carpeta de salida a un almacenamiento en la nube. Esto nos permite enviar tareas y revisar los guiones completados o las descripciones de los videos directamente desde un dispositivo móvil. ☁️",
    "Las herramientas de conexión directa por interfaz de programación de aplicaciones con servicios en la nube agilizan el proceso.\n\nAl vincular el sistema con repositorios de almacenamiento y calendarios de publicación el agente escribe y organiza los archivos sin necesidad de interactuar visualmente con el navegador web en cada paso. 🔗",
    "La especialización de las instrucciones es fundamental para que el sistema funcione sin supervisión. Definimos las directrices y el tono para cada uno de los cinco canales temáticos.\n\nEstablecemos la estructura del guión con momentos de retención de audiencia y especificaciones de diseño para los generadores de imágenes automáticos. 📝",
    "Los cinco canales seleccionados abarcan documentales históricos de conspiraciones e inteligencia militar hasta compilaciones de juego relajantes.\n\nTambién incluimos canales sobre el estilo de vida de lujo y proyectos de infraestructura. Estas temáticas aseguran una alta rentabilidad y un flujo de ideas constante y automatizable. 📈",
    "Para lograr un funcionamiento pasivo programamos el trabajo en un calendario semanal. El lunes se realiza la investigación del canal de documentales y el martes la del canal de lujo.\n\nAsí el enjambre de agentes procesa un canal cada noche y consolida los entregables. El fin de semana solo requiere una breve sesión humana de aprobación. 📅",
    "El análisis económico a doce meses demuestra la viabilidad del proyecto. Con una inversión inicial menor a los mil quinientos dólares que cubre el hardware y las licencias de software los retornos proyectados pueden superar los cuatro mil dólares mensuales.\n\nEsto se debe a que la consistencia operativa elimina el factor del cansancio humano. 💰",
    "El mayor desafío inicial es la paciencia técnica. Los primeros tres meses apenas generan ingresos mientras el algoritmo de distribución clasifica el contenido.\n\nLa consistencia en la publicación y el diseño manual de las portadas son los factores que determinan el éxito del sistema. Te invitamos a construir tus propias redes de agentes. 🔚"
];

// Distribución de las 16 imágenes en las primeras 4 publicaciones
const POST_MEDIA = {
    0: [
        path.join(__dirname, 'downloaded_media_4', 'media_1.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_2.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_3.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_4.png')
    ],
    1: [
        path.join(__dirname, 'downloaded_media_4', 'media_5.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_6.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_7.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_8.jpg')
    ],
    2: [
        path.join(__dirname, 'downloaded_media_4', 'media_9.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_10.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_11.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_12.jpg')
    ],
    3: [
        path.join(__dirname, 'downloaded_media_4', 'media_13.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_14.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_15.jpg'),
        path.join(__dirname, 'downloaded_media_4', 'media_16.jpg')
    ]
};

const DELAY_MS = 8000;

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Publicador Live del Hilo Mac Mini YouTube Automation");
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
