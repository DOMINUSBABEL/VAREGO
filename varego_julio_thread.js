const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// Array of 4 posts for the thread about the July 9th holiday (Ley 2578 de 2026)
const HILO_POSTS = [
    "La sanción de la Ley 2578 de 2026 oficializa el 9 de julio como nuevo día festivo nacional en Colombia. Desde el derecho público, esta norma no solo rinde homenaje a la Virgen de Chiquinquirá, sino que busca promover el desarrollo patrimonial y turístico de la región. 1/4",
    "El debate de constitucionalidad radica en el carácter laico del Estado. Aunque la Corte Constitucional exige neutralidad religiosa, admite festividades de origen confesional si poseen un valor cultural e histórico prevalente que trascienda el culto directo. 2/4",
    "En términos laborales y de técnica legislativa, el festivo se integra con la Ley Emiliani (Ley 51 de 1983). Esto implica el traslado de la jornada de descanso obligatorio al lunes de la semana siguiente, garantizando el derecho del trabajador al descanso remunerado. 3/4",
    "Finalmente, la ley plantea un análisis de proporcionalidad socioeconómica: sopesar el beneficio comercial para el turismo regional en Boyacá frente al impacto de un día no laborable adicional en la productividad y competitividad del aparato económico general. 4/4 🔚"
];

const DELAY_MS = 120000; // 2 minutes difference

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Publicación de Hilo de Ley 2578 de 2026");
        console.log(`Mensajes a publicar: ${HILO_POSTS.length}`);
        console.log(`Intervalo de espera: ${DELAY_MS / 1000} segundos (2 minutos)`);
        console.log("==================================================\n");

        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de HILO JULIO en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

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

        // Get own username
        let ownUsername = 'NeoDominusBabel';
        try {
            await xPage.waitForSelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]', { timeout: 10000 });
            const profileHref = await xPage.evaluate(() => {
                const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]');
                return el ? el.getAttribute('href') : null;
            });
            if (profileHref) {
                ownUsername = profileHref.replace('/', '');
            }
        } catch (e) {
            console.log("No se pudo obtener el nombre de usuario de forma dinámica. Se usará el valor predeterminado.");
        }
        console.log(`Nombre de usuario: @${ownUsername}\n`);

        const getLatestTweetUrl = async (page, uname) => {
            try {
                console.log(`[Búsqueda] Navegando al perfil: https://x.com/${uname}`);
                await page.goto(`https://x.com/${uname}`, { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, 5000));
                return await page.evaluate((un) => {
                    const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
                    for (const cell of cells) {
                        const isPinned = cell.innerText.includes('Fijado') || cell.innerText.includes('Pinned') || cell.innerText.includes('Fijar');
                        if (isPinned) continue;
                        const links = Array.from(cell.querySelectorAll('a'));
                        const statusLink = links.find(l => l.href.includes(`/${un}/status/`));
                        if (statusLink) return statusLink.href;
                    }
                    return null;
                }, uname);
            } catch (err) {
                console.error("[Búsqueda] Error al buscar publicación en perfil:", err.message);
                return null;
            }
        };

        let parentTweetUrl = null;

        // Loop through all HILO_POSTS
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const postText = HILO_POSTS[i];
            const postNum = i + 1;

            if (i > 0) {
                console.log(`\n⏳ Esperando ${DELAY_MS / 60000} minutos antes de la publicación ${postNum}/${HILO_POSTS.length}...`);
                const startWait = Date.now();
                while (Date.now() - startWait < DELAY_MS) {
                    const remaining = Math.round((DELAY_MS - (Date.now() - startWait)) / 1000);
                    if (remaining % 30 === 0 && remaining > 0) {
                        console.log(`   ⏱️  Faltan ${remaining} segundos`);
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            console.log(`\n--------------------------------------------------`);
            console.log(`📝 Publicando mensaje ${postNum}/${HILO_POSTS.length}`);
            console.log(`--------------------------------------------------`);

            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;

                    if (postNum === 1) {
                        // First post to home
                        console.log("Publicando primer mensaje en la página de inicio...");
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 3000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const textArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!textArea) throw new Error("Caja de texto no encontrada en inicio");

                        await textArea.click();
                        await new Promise(r => setTimeout(r, 800));
                        await xPage.evaluate(el => el.focus(), textArea);

                        // Clear input space check
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));

                        await xPage.keyboard.type(postText, { delay: 15 });
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
                        console.log("Publicación enviada, obteniendo enlace...");

                        await new Promise(r => setTimeout(r, 5000));

                        let newUrl = null;
                        const start = Date.now();
                        while (Date.now() - start < 12000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/${ownUsername}/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en perfil...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener la URL de la publicación principal");
                        parentTweetUrl = newUrl;
                        console.log(`🎯 Primer mensaje publicado en: ${parentTweetUrl}`);
                        success = true;
                    } else {
                        // Subsequent posts as replies
                        console.log(`Respondiendo a publicación previa: ${parentTweetUrl}`);
                        await xPage.goto(parentTweetUrl, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));

                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        if (!replyArea) throw new Error("Caja de respuesta no encontrada");

                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 600));
                        await xPage.evaluate(el => el.focus(), replyArea);

                        await xPage.keyboard.type(postText, { delay: 15 });
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
                        while (Date.now() - start < 12000) {
                            if (interceptedTweetId) {
                                newUrl = `https://x.com/${ownUsername}/status/${interceptedTweetId}`;
                                break;
                            }
                            await new Promise(r => setTimeout(r, 500));
                        }

                        if (!newUrl) {
                            console.log("[Fallback] Buscando en perfil...");
                            newUrl = await getLatestTweetUrl(xPage, ownUsername);
                        }

                        if (!newUrl) throw new Error("No se pudo obtener la URL del hilo");
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
        console.log("🎉 HILO PUBLICADO CON ÉXITO: 4/4 mensajes en vivo");
        console.log("==================================================");
        await browser.disconnect();
    } catch (err) {
        console.error("💀 Fallo crítico:", err);
        process.exit(1);
    }
})();
