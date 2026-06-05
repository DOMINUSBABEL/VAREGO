const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

const VIDEO_PATH = './julian_video.mp4';

// El hilo de 8 posts altamente espaciados (Post 1 con vídeo, Posts 2-8 explicativos)
// Cada post de 240 a 450 caracteres, sin comillas ni guiones
const HILO_POSTS = [
    {
        date: "2026-06-05T06:04:00-05:00",
        text: "La última actualización del agente autónomo de inteligencia artificial Hermes marca un antes y un después en la productividad.\n\nEl sistema ahora cuenta con un aplicativo nativo de escritorio para Windows que simplifica drásticamente su ejecución y control.\n\nEn este hilo analizaremos en detalle sus nuevas capacidades y cómo puedes desplegarlo de forma sencilla en tu computadora. 👇"
    },
    {
        date: "2026-06-05T06:07:00-05:00",
        text: "La gran novedad de esta versión es la interfaz gráfica de usuario.\n\nEl panel de control visual elimina la necesidad de interactuar constantemente con la terminal de comandos.\n\nAhora cualquier persona puede gestionar las tareas de sus agentes, revisar el historial de sesiones y configurar memorias persistentes de forma intuitiva. 📁"
    },
    {
        date: "2026-06-05T06:10:00-05:00",
        text: "El despliegue en sistemas operativos de Microsoft se ha simplificado a niveles históricos.\n\nAnteriormente se requería configurar contenedores virtuales de docker o dependencias complejas del subsistema de linux para windows.\n\nHoy en día es posible levantarlo de forma nativa utilizando un sencillo script ejecutable en la consola de comandos de powershell. ⚙️"
    },
    {
        date: "2026-06-05T06:13:00-05:00",
        text: "El rendimiento de la versión de escritorio de windows destaca por su bajo consumo de recursos y su comunicación optimizada con el hardware local.\n\nEl agente lee directamente el contexto del sistema operativo y gestiona los archivos locales con total fluidez.\n\nEsto le permite operar como un asistente virtual integrado de primer nivel. 🖥️"
    },
    {
        date: "2026-06-05T06:16:00-05:00",
        text: "Además del entorno visual, el motor lógico de Hermes se beneficia de una integración nativa con el protocolo de contexto de modelo.\n\nEsta arquitectura abierta permite conectar de manera limpia servidores y bases de datos externas.\n\nDe esta forma, el agente puede acceder a herramientas de análisis financiero y APIs web sin requerir configuraciones complejas. 📈"
    },
    {
        date: "2026-06-05T06:19:00-05:00",
        text: "Otro avance clave es el soporte para plugins de agentes personalizados que se pueden estructurar localmente.\n\nBasta con crear una carpeta y un archivo de configuración en formato yaml para indicarle al agente las directrices de su tarea.\n\nEsto abre un abanico enorme de personalización para flujos de trabajo específicos en cada sector empresarial. 💼"
    },
    {
        date: "2026-06-05T06:22:00-05:00",
        text: "Para los desarrolladores, la definición técnica de los parámetros e instrucciones de las herramientas se realiza en el archivo schemas.py.\n\nA través de esta configuración, el modelo de lenguaje interpreta en qué momento exacto debe ejecutar cada proceso.\n\nEl resultado es un comportamiento autónomo guiado por lógica de negocio rigurosa. 🛠️"
    },
    {
        date: "2026-06-05T06:25:00-05:00",
        text: "El futuro de la automatización en el escritorio de windows es hoy una realidad accesible y modular.\n\nCon estas facilidades de instalación y la nueva interfaz de usuario, la automatización de procesos complejos está al alcance de todos.\n\nSi quieres profundizar en este ecosistema, te invito a explorar las guías oficiales y comenzar tus pruebas locales. 🔚"
    }
];

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Programador de Hilo Hermes (8 Posts)");
        console.log(`Primer post programado: ${HILO_POSTS[0].date}`);
        console.log(`Último post programado: ${HILO_POSTS[HILO_POSTS.length - 1].date}`);
        console.log("==================================================\n");

        // Preguntar al usuario si desea modo headless o auditar
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
                if (url.includes('CreateTweet') && response.request().method() === 'POST') {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    const result = json?.data?.create_tweet?.tweet_results?.result;
                    if (result) {
                        interceptedTweetId = result.rest_id;
                        console.log(`[Red] ✅ Identificador de publicación interceptado: ${interceptedTweetId}`);
                    }
                }
            } catch (e) {}
        });

        // Navigate and wait for login session
        console.log("Navegando a X.com...");
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Esperando inicio de sesión...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("✅ Sesión detectada activa");
        await new Promise(r => setTimeout(r, 3000));

        let parentTweetUrl = null;

        // Loop HILO_POSTS
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const post = HILO_POSTS[i];
            const postNum = i + 1;
            const targetTime = new Date(post.date);

            // Wait loop
            while (true) {
                const now = new Date();
                const diffMs = targetTime.getTime() - now.getTime();
                if (diffMs <= 0) {
                    break;
                }
                console.log(`[Programador] Post ${postNum}/${HILO_POSTS.length} programado para las ${targetTime.toLocaleTimeString()}. Tiempo restante: ${Math.round(diffMs / 1000)} segundos...`);
                // Sleep up to 15 seconds
                const sleepTime = Math.min(diffMs, 15000);
                await new Promise(r => setTimeout(r, sleepTime));
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
                        // First post to home (with video)
                        console.log("Navegando al inicio para publicar el primer mensaje...");
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 3000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const textArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!textArea) throw new Error("Caja de texto no encontrada en inicio");

                        await textArea.click();
                        await new Promise(r => setTimeout(r, 800));
                        await xPage.evaluate(el => el.focus(), textArea);

                        // Upload Video
                        if (fs.existsSync(VIDEO_PATH)) {
                            console.log(`Subiendo video desde: ${VIDEO_PATH}`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                await fileInputs[0].uploadFile(VIDEO_PATH);
                                console.log("Video subido, esperando procesamiento multimedia (20 segundos)...");
                                await new Promise(r => setTimeout(r, 20000)); // Esperar procesamiento de X
                            } else {
                                console.log("Advertencia: No se encontró el cargador de archivos.");
                            }
                        } else {
                            throw new Error(`Video no encontrado en: ${VIDEO_PATH}`);
                        }

                        // Type text
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.type(post.text, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

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
                        console.log("Publicación con video enviada, obteniendo enlace...");

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
                            throw new Error("No se pudo obtener la URL de la publicación principal");
                        }
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

                        await xPage.keyboard.type(post.text, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

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
                        console.log("Respuesta enviada, obteniendo enlace...");

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
                            throw new Error("No se pudo obtener la URL del hilo");
                        }
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
                console.error(`💀 Fallo definitivo en publicación ${postNum}. Deteniendo ejecución.`);
                process.exit(1);
            }
        }

        console.log("\n==================================================");
        console.log(`🎉 HILO PUBLICADO CON ÉXITO: ${HILO_POSTS.length}/${HILO_POSTS.length} mensajes en vivo`);
        console.log("==================================================");
        await browser.disconnect();
    } catch (err) {
        console.error("💀 Fallo crítico:", err);
        process.exit(1);
    }
})();
