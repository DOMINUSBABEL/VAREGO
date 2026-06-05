const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// ============================================================
// HILO: Carta al CD - Continuar desde post 2/6
// Username: NeoDominusBabel
// El post 1/6 ya fue publicado manualmente
// ============================================================

const OWN_USERNAME = 'NeoDominusBabel';

// Posts 2/6 a 6/6 (el 1/6 ya está publicado)
const HILO_POSTS = [
    `Todos vimos su protagonismo visible en la campaña: coordinando esfuerzos, recorriendo Colombia y encarnando el voto duro uribista.

Sin embargo, ante las primeras dificultades y la aparición de otro proyecto que parece más ventajoso, se produce el cambio de posición.

Las circunstancias históricas señalan que eso no es análisis: es un comportamiento que debilita la confianza y genera decepción profunda en quienes sí han cumplido con lealtad.

2/6`,

    `Esta división que hoy hiere al Centro Democrático y a toda la oposición se alimenta precisamente de actitudes afanosas y oportunistas:

Personas que corren a arrimarse al árbol que más brilla, sin golpear nunca el tronco para comprobar si está hueco.

Y los troncos huecos, @Danielbricen, se derrumban en cuestión de segundos… arrastrando a quienes solo buscaron el brillo momentáneo.

3/6`,

    `Paloma Valencia ha demostrado coraje, consistencia y temple en los momentos más difíciles, cuando otros guardaban silencio.

Las circunstancias históricas condenan que hoy se le retire respaldo público o se la cuestione para ganar posicionamiento, porque eso solo revela:

Cálculo puro.
Cero convicción.
Cero gratitud.

4/6`,

    `Centro Democrático: si no corrige con claridad este tipo de conductas y permite que el oportunismo se normalice, las circunstancias históricas dictan que perderá toda autoridad moral para llamarse partido de principios.

A usted, @Danielbricen: el voto duro y consciente que tanto invoca no olvida a quienes abandonan el barco en plena tormenta.

La historia política está repleta de figuras que brillaron por conveniencia y terminaron en el más absoluto olvido.

5/6`,

    `Disciplina o división.
Lealtad verdadera o fractura permanente.

No existe punto medio.

Quien tenga oídos para escuchar, que escuche.
Quien tenga dignidad y vergüenza política, que actúe.

Centro Democrático, esto es una advertencia seria que nos da la realidad.

6/6 🔚`
];

const DELAY_BETWEEN_POSTS_MS = 150000; // 2.5 minutos

(async () => {
    try {
        console.log("============================================");
        console.log("VAREGO - Carta al CD (Continuación 2/6 → 6/6)");
        console.log(`Username: @${OWN_USERNAME}`);
        console.log(`Posts restantes: ${HILO_POSTS.length}`);
        console.log(`Delay: ${DELAY_BETWEEN_POSTS_MS / 60000} min entre posts`);
        console.log("============================================\n");

        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de HILO CARTA CD en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

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

        // Network interception
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
                        console.log(`[RED] ✅ Tweet ID interceptado: ${interceptedTweetId}`);
                    }
                }
            } catch (e) {}
        });

        // Navigate and wait for login
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Esperando sesión...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("✅ Sesión activa\n");
        await new Promise(r => setTimeout(r, 3000));

        // ============================================
        // STEP 1: Find the 1/6 tweet URL from profile
        // ============================================
        console.log(`🔍 Buscando tweet 1/6 en perfil @${OWN_USERNAME}...`);
        await xPage.goto(`https://x.com/${OWN_USERNAME}`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 5000));

        let parentTweetUrl = await xPage.evaluate((uname) => {
            const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
            for (const cell of cells) {
                const isPinned = cell.innerText.includes('Fijado') || cell.innerText.includes('Pinned') || cell.innerText.includes('Fijar');
                if (isPinned) continue;

                const links = Array.from(cell.querySelectorAll('a'));
                const statusLink = links.find(l => l.href.includes(`/${uname}/status/`));
                if (statusLink) return statusLink.href;
            }
            return null;
        }, OWN_USERNAME);

        if (!parentTweetUrl) {
            console.error("💀 No se encontró el tweet 1/6 en el perfil. Abortando.");
            process.exit(1);
        }

        console.log(`✅ Tweet 1/6 encontrado: ${parentTweetUrl}\n`);

        // ============================================
        // STEP 2: Post replies 2/6 → 6/6
        // ============================================
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const postText = HILO_POSTS[i];
            const postNum = i + 2; // 2/6, 3/6, etc.

            // Wait between posts (except before first reply)
            if (i > 0) {
                console.log(`\n⏳ Esperando ${DELAY_BETWEEN_POSTS_MS / 60000} min antes del post ${postNum}/6...`);
                const waitStart = Date.now();
                while (Date.now() - waitStart < DELAY_BETWEEN_POSTS_MS) {
                    const remaining = Math.round((DELAY_BETWEEN_POSTS_MS - (Date.now() - waitStart)) / 1000);
                    if (remaining % 30 === 0 && remaining > 0) {
                        console.log(`   ⏱️  ${remaining}s restantes`);
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            console.log(`\n${'='.repeat(50)}`);
            console.log(`📝 Post ${postNum}/6 — Reply a: ${parentTweetUrl}`);
            console.log(`${'='.repeat(50)}`);

            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;

                    // Navigate to parent tweet
                    await xPage.goto(parentTweetUrl, { waitUntil: 'domcontentloaded' });
                    await new Promise(r => setTimeout(r, 4000));

                    // Wait for reply textarea
                    await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                    const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                    if (!replyArea) throw new Error("Reply textarea no encontrada");

                    await replyArea.click();
                    await new Promise(r => setTimeout(r, 600));

                    // Type the post
                    await xPage.keyboard.type(postText, { delay: 12 });
                    await new Promise(r => setTimeout(r, 1000));

                    // Click reply button
                    const clicked = await xPage.evaluate(() => {
                        const btn = document.querySelector('[data-testid="tweetButtonInline"]');
                        if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                            btn.click(); return 'ok';
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
                    if (clicked === 'fail') throw new Error("Botón de reply no encontrado");
                    console.log("✅ Reply enviado, capturando URL...");

                    // Wait for network interception (poll for 12 seconds)
                    let newUrl = null;
                    const start = Date.now();
                    while (Date.now() - start < 12000) {
                        if (interceptedTweetId) {
                            newUrl = `https://x.com/${OWN_USERNAME}/status/${interceptedTweetId}`;
                            break;
                        }
                        await new Promise(r => setTimeout(r, 500));
                    }

                    // Fallback: scrape profile
                    if (!newUrl) {
                        console.log("[FALLBACK] Scraping perfil para URL...");
                        await xPage.goto(`https://x.com/${OWN_USERNAME}`, { waitUntil: 'networkidle2' });
                        await new Promise(r => setTimeout(r, 5000));
                        
                        newUrl = await xPage.evaluate((uname) => {
                            const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
                            for (const cell of cells) {
                                const isPinned = cell.innerText.includes('Fijado') || cell.innerText.includes('Pinned') || cell.innerText.includes('Fijar');
                                if (isPinned) continue;
                                const links = Array.from(cell.querySelectorAll('a'));
                                const statusLink = links.find(l => l.href.includes(`/${uname}/status/`));
                                if (statusLink) return statusLink.href;
                            }
                            return null;
                        }, OWN_USERNAME);
                    }

                    if (!newUrl) {
                        throw new Error("No se capturó URL del reply");
                    }

                    parentTweetUrl = newUrl;
                    console.log(`🎯 Post ${postNum}/6 publicado: ${parentTweetUrl}`);
                    success = true;

                } catch (err) {
                    retries++;
                    console.error(`❌ Error post ${postNum}/6, intento ${retries}: ${err.message}`);
                    try {
                        await xPage.keyboard.press('Escape');
                        await new Promise(r => setTimeout(r, 1500));
                        await xPage.keyboard.press('Escape');
                        await new Promise(r => setTimeout(r, 1500));
                    } catch (e) {}
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (!success) {
                console.error(`💀 FALLO CRÍTICO post ${postNum}/6. Abortando.`);
                process.exit(1);
            }
        }

        console.log("\n============================================");
        console.log("🎉 ¡HILO COMPLETO! 6/6 posts publicados");
        console.log("============================================\n");
        await browser.disconnect();

    } catch (err) {
        console.error("💀 Fallo fatal:", err);
        process.exit(1);
    }
})();
