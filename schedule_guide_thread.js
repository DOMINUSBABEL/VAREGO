const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

const VIDEO_PATH = './miles_video.mp4';

// El hilo de 3 posts de la guía de Hermes, sin comillas ni guiones
const HILO_POSTS = [
    {
        date: "2026-06-05T07:00:00-05:00",
        text: "La organización Nous Research publicó una guía detallada para construir complementos de agentes personalizados en Hermes.\n\nEste sistema permite integrar herramientas que los modelos de lenguaje invocan de forma autónoma.\n\nIniciamos una explicación detallada sobre su funcionamiento en esta plataforma. 👇"
    },
    {
        date: "2026-06-05T07:03:00-05:00",
        text: "Para definir la estructura de un complemento personalizado se edita el archivo de configuración en la ruta local de la carpeta de configuraciones.\n\nEste manifiesto establece los metadatos principales del sistema las herramientas provistas y las rutinas de ejecución. 📁"
    },
    {
        date: "2026-06-05T07:06:00-05:00",
        text: "La definición técnica de los parámetros e instrucciones de las herramientas se realiza en el archivo de esquemas de python.\n\nDe este modo el modelo comprende el momento exacto en el que debe invocar cada proceso para lograr total autonomía. ⚙️"
    }
];

(async () => {
    try {
        console.log("==================================================");
        console.log("VAREGO - Orquestador de Programación de Guía Hermes");
        console.log(`Mensajes a programar: ${HILO_POSTS.length}`);
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

        // Navigate and wait for login session
        console.log("Navegando a X.com...");
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        console.log("Esperando inicio de sesión...");
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        console.log("✅ Sesión detectada activa");
        await new Promise(r => setTimeout(r, 3000));

        // Loop HILO_POSTS
        for (let i = 0; i < HILO_POSTS.length; i++) {
            const post = HILO_POSTS[i];
            const postNum = i + 1;
            const postDate = new Date(post.date);

            console.log(`\n[Programación] Procesando publicación ${postNum}/${HILO_POSTS.length} para el ${postDate.toLocaleString()}`);

            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                    await new Promise(r => setTimeout(r, 2000));
                    await xPage.evaluate(() => window.scrollTo(0, 0));

                    await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                    const textArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                    if (!textArea) throw new Error("Caja de texto no encontrada");

                    await textArea.click();
                    await new Promise(r => setTimeout(r, 800));
                    await xPage.evaluate(el => el.focus(), textArea);

                    // Upload Video on Post 1
                    if (postNum === 1) {
                        if (fs.existsSync(VIDEO_PATH)) {
                            console.log(`[Media] Subiendo video desde: ${VIDEO_PATH}`);
                            const fileInputs = await xPage.$$('input[type="file"]');
                            if (fileInputs.length > 0) {
                                await fileInputs[0].uploadFile(VIDEO_PATH);
                                console.log("[Media] Video subido, esperando procesamiento multimedia (20 segundos)...");
                                await new Promise(r => setTimeout(r, 20000));
                            } else {
                                console.log("[Media] Advertencia: No se encontró el selector de archivos.");
                            }
                        } else {
                            throw new Error(`Video no encontrado en: ${VIDEO_PATH}`);
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
                    await xPage.keyboard.type(post.text, { delay: 10 });
                    await new Promise(r => setTimeout(r, 1000));

                    // Click Schedule Button
                    console.log("[Modal] Abriendo modal de programación...");
                    const scheduleButtons = await xPage.$$('[data-testid="scheduleOption"]');
                    const scheduleBtn = scheduleButtons[0];
                    if (!scheduleBtn) throw new Error("Botón de programación no encontrado");
                    await xPage.evaluate(el => el.click(), scheduleBtn);

                    // Wait for scheduling modal Select tags
                    await Promise.race([
                        xPage.waitForSelector('[aria-modal="true"] select', { visible: true, timeout: 15000 }),
                        xPage.waitForSelector('[role="dialog"] select', { visible: true, timeout: 15000 })
                    ]);
                    await new Promise(r => setTimeout(r, 1000));

                    const monthVal = postDate.getMonth() + 1;
                    const dayVal = postDate.getDate();
                    const yearVal = postDate.getFullYear();
                    const hourVal = postDate.getHours();
                    const minuteVal = postDate.getMinutes();

                    const selectRoles = await xPage.evaluate(() => {
                        const selects = Array.from(document.querySelectorAll('[aria-modal="true"] select, [role="dialog"] select'));
                        let monthIdx = -1, dayIdx = -1, yearIdx = -1, hourIdx = -1, minuteIdx = -1, ampmIdx = -1;

                        selects.forEach((sel, index) => {
                            const optCount = sel.options.length;
                            const optValues = Array.from(sel.options).map(o => o.value).filter(v => v !== "");
                            if (optCount === 2 || optCount === 3) ampmIdx = index;
                            else if (optValues.length > 0 && optValues.every(v => v.length === 4 && !isNaN(v))) yearIdx = index;
                            else if (optCount === 60 || optCount === 61) minuteIdx = index;
                            else if (optCount >= 28 && optCount <= 32) dayIdx = index;
                            else if (optCount === 12 || optCount === 13) {
                                const texts = Array.from(sel.options).map(o => o.text.toLowerCase());
                                const hasMonthNames = texts.some(t => t.includes('enero') || t.includes('january') || t.includes('mayo') || t.includes('may') || t.includes('febrero'));
                                if (hasMonthNames) monthIdx = index;
                                else hourIdx = index;
                            } else if (optCount === 24 || optCount === 25) hourIdx = index;
                        });

                        return { monthIdx, dayIdx, yearIdx, hourIdx, minuteIdx, ampmIdx };
                    });

                    const selects = await xPage.$$('[aria-modal="true"] select, [role="dialog"] select');

                    const selectValueOnHandle = async (handle, targetValue) => {
                        if (!handle) return;
                        const targetStr = targetValue.toString();
                        const targetPadded = targetStr.padStart(2, '0');
                        const options = await handle.evaluate(sel => Array.from(sel.options).map(o => ({ value: o.value, text: o.text })));
                        
                        let matchedValue = null;
                        for (const opt of options) {
                            if (opt.value === targetStr || opt.value === targetPadded) {
                                matchedValue = opt.value;
                                break;
                            }
                        }
                        if (matchedValue) {
                            await handle.select(matchedValue);
                            await handle.evaluate((sel, val) => {
                                sel.value = val;
                                sel.dispatchEvent(new Event('change', { bubbles: true }));
                                sel.dispatchEvent(new Event('input', { bubbles: true }));
                            }, matchedValue);
                            await new Promise(r => setTimeout(r, 300));
                        }
                    };

                    if (selectRoles.yearIdx !== -1 && selects[selectRoles.yearIdx]) await selectValueOnHandle(selects[selectRoles.yearIdx], yearVal);
                    if (selectRoles.monthIdx !== -1 && selects[selectRoles.monthIdx]) await selectValueOnHandle(selects[selectRoles.monthIdx], monthVal);
                    if (selectRoles.dayIdx !== -1 && selects[selectRoles.dayIdx]) await selectValueOnHandle(selects[selectRoles.dayIdx], dayVal);
                    if (selectRoles.minuteIdx !== -1 && selects[selectRoles.minuteIdx]) await selectValueOnHandle(selects[selectRoles.minuteIdx], minuteVal);
                    
                    if (selectRoles.ampmIdx !== -1 && selects[selectRoles.ampmIdx]) {
                        const isPM = hourVal >= 12;
                        const targetText = isPM ? 'pm' : 'am';
                        const ampmOptions = await selects[selectRoles.ampmIdx].evaluate(sel => Array.from(sel.options).map(o => ({ value: o.value, text: o.text })));
                        
                        let matchedValue = null;
                        for (const opt of ampmOptions) {
                            const valText = (opt.value || '').toLowerCase().replace(/\./g, '').replace(/\s/g, '');
                            const optText = (opt.text || '').toLowerCase().replace(/\./g, '').replace(/\s/g, '');
                            if (valText.includes(targetText) || optText.includes(targetText)) {
                                matchedValue = opt.value;
                                break;
                            }
                        }
                        if (matchedValue) {
                            await selects[selectRoles.ampmIdx].select(matchedValue);
                            await selects[selectRoles.ampmIdx].evaluate((sel, val) => {
                                sel.value = val;
                                sel.dispatchEvent(new Event('change', { bubbles: true }));
                                sel.dispatchEvent(new Event('input', { bubbles: true }));
                            }, matchedValue);
                            await new Promise(r => setTimeout(r, 300));
                        }
                        const hour12 = hourVal % 12 === 0 ? 12 : hourVal % 12;
                        if (selectRoles.hourIdx !== -1 && selects[selectRoles.hourIdx]) await selectValueOnHandle(selects[selectRoles.hourIdx], hour12);
                    } else {
                        if (selectRoles.hourIdx !== -1 && selects[selectRoles.hourIdx]) await selectValueOnHandle(selects[selectRoles.hourIdx], hourVal);
                    }

                    await new Promise(r => setTimeout(r, 1500));
                    
                    // Click Confirm Modal Button
                    console.log("[Modal] Confirmando fecha y hora...");
                    await xPage.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-modal="true"] [role="button"], [role="dialog"] [role="button"]');
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (text === 'confirm' || text === 'confirmar' || text === 'update' || text === 'actualizar' || testid.includes('confirm')) {
                                btn.click();
                                break;
                            }
                        }
                    });
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    // Click Schedule Submit Button
                    console.log("[Modal] Enviando a programación...");
                    const clickScheduleStatus = await xPage.evaluate(() => {
                        const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                        if (inlineBtn && !inlineBtn.disabled) {
                            inlineBtn.click(); return 'ok';
                        }
                        const mainBtn = document.querySelector('[data-testid="tweetButton"]');
                        if (mainBtn && !mainBtn.disabled) {
                            mainBtn.click(); return 'ok';
                        }
                        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (testid === 'tweetbutton' || testid === 'tweetbuttoninline' || text === 'schedule' || text === 'programar' || text === 'post' || text === 'publicar') {
                                if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                    btn.click();
                                    return 'ok';
                                }
                            }
                        }
                        return 'fail';
                    });
                    
                    if (clickScheduleStatus === 'fail') throw new Error("Botón de envío no encontrado o inactivo");
                    console.log(`✅ Publicación ${postNum} programada con éxito en X.`);
                    
                    await new Promise(r => setTimeout(r, 6000));
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`❌ Error en programación ${postNum}, intento ${retries}: ${err.message}`);
                    try {
                        await xPage.keyboard.press('Escape');
                        await new Promise(r => setTimeout(r, 1000));
                        await xPage.keyboard.press('Escape');
                    } catch (e) {}
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (!success) {
                console.error(`💀 Fallo definitivo en programación del post ${postNum}. Deteniendo.`);
                process.exit(1);
            }
        }

        console.log("\n==================================================");
        console.log("🎉 HILO PROGRAMADO NATIVAMENTE CON EXITO: 3/3 posts");
        console.log("==================================================");
        await browser.close();
    } catch (err) {
        console.error("💀 Fallo crítico:", err);
        process.exit(1);
    }
})();
