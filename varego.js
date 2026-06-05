const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function askHeadlessMode() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("¿Desea ejecutar el navegador en modo invisible (headless)? (s/n, por defecto 'n'): ", (answer) => {
            rl.close();
            const lower = answer.trim().toLowerCase();
            resolve(lower === 's' || lower === 'si' || lower === 'y' || lower === 'yes');
        });
    });
}

(async () => {
    try {
        let headless = false;
        if (process.argv.includes('--headless')) {
            headless = true;
        } else if (process.argv.includes('--headful')) {
            headless = false;
        } else {
            headless = await askHeadlessMode();
        }

        if (process.argv.includes('--meta') || process.env.VAREGO_META === 'true') {
            console.log("Redirecting to VAREGO META scheduling campaign...");
            const { processCampaign } = require('./meta/scheduler');
            await processCampaign(headless);
            return;
        }

        let posts = JSON.parse(fs.readFileSync(path.join('..', 'output', '177_posts', 'posts.json'), 'utf8'));
        
        let progress = 0;
        if (fs.existsSync('progress.json')) {
            progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));
            console.log(`Resuming from post index ${progress}`);
        }

        // Dynamically adjust remaining post dates if they are in the past
        const now = new Date();
        const baseStart = new Date("2026-05-21T18:07:00");
        const safeStart = new Date(Math.max(baseStart.getTime(), now.getTime() + 5 * 60 * 1000));
        
        if (progress < posts.length) {
            const nextPostDate = new Date(posts[progress].date);
            if (nextPostDate.getTime() < safeStart.getTime()) {
                console.log(`Adjusting remaining post dates starting from: ${safeStart.toLocaleString()}`);
                const remainingCount = posts.length - progress;
                const totalHours = process.env.VAREGO_HOURS ? parseFloat(process.env.VAREGO_HOURS) : 3;
                const totalSeconds = totalHours * 3600;
                
                // Generate random sorted offsets for the remaining posts
                const offsets = [];
                for (let k = 0; k < remainingCount; k++) {
                    offsets.push(Math.random() * totalSeconds);
                }
                offsets.sort((a, b) => a - b);
                
                for (let k = 0; k < remainingCount; k++) {
                    const postIndex = progress + k;
                    const postDate = new Date(safeStart.getTime() + offsets[k] * 1000);
                    const pad = (n) => n.toString().padStart(2, '0');
                    const dateStr = `${postDate.getFullYear()}-${pad(postDate.getMonth()+1)}-${pad(postDate.getDate())} ${pad(postDate.getHours())}:${pad(postDate.getMinutes())}:${pad(postDate.getSeconds())}`;
                    posts[postIndex].date = dateStr;
                }
                
                // Save back to posts.json
                fs.writeFileSync(path.join('..', 'output', '177_posts', 'posts.json'), JSON.stringify(posts, null, 4), 'utf8');
                console.log("Successfully updated posts.json with adjusted future dates.");
            }
        }
        
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
        
        // Emular un User-Agent humano real
        await xPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await xPage.setViewport({ width: 1280, height: 800 });
        
        await xPage.bringToFront();
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        
        console.log("-----------------------------------------------------");
        console.log("ESPERANDO INICIO DE SESIÓN...");
        console.log("Por favor, inicia sesión manualmente en la ventana de Chrome.");
        console.log("El bot detectará automáticamente cuando estés en el Home y empezará.");
        console.log("-----------------------------------------------------");

        // Wait until the tweet textarea is visible, meaning the user is logged in and on the home page
        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 }); // timeout 0 means wait indefinitely
        
        console.log("¡Inicio de sesión detectado! Comenzando matriz de publicaciones...");
        await new Promise(r => setTimeout(r, 3000)); // Small buffer after login

        for (let i = progress; i < posts.length; i++) {
            const post = posts[i];
            const postDate = new Date(post.date);
            
            console.log(`Scheduling post ${i+1}/${posts.length} for ${postDate.toLocaleString()}`);
            
            let success = false;
            let retries = 0;
            
            while (!success && retries < 3) {
                try {
                    await xPage.evaluate(() => window.scrollTo(0, 0));
                    await new Promise(r => setTimeout(r, 1000));
                    
                    const textAreas = await xPage.$$('[data-testid="tweetTextarea_0"]');
                    const textArea = textAreas[0];
                    if (!textArea) throw new Error("Textarea not found");
                    
                    await textArea.click();
                    await new Promise(r => setTimeout(r, 800));
                    await xPage.evaluate(el => el.focus(), textArea);
                    await new Promise(r => setTimeout(r, 200));
                    
                    await xPage.keyboard.down('Control');
                    await xPage.keyboard.press('A');
                    await xPage.keyboard.up('Control');
                    await xPage.keyboard.press('Backspace');
                    await new Promise(r => setTimeout(r, 800)); // Increased wait time to ensure DOM settles

                    // Upload Image if present
                    if (post.image_path && fs.existsSync(post.image_path)) {
                        const fileInputs = await xPage.$$('input[type="file"]');
                        if (fileInputs.length > 0) {
                            await fileInputs[0].uploadFile(post.image_path);
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }

                    // Type text carefully, ensuring first char is not swallowed by React state delays
                    // Strategy: Type a space, then backspace, then type the real text.
                    await xPage.keyboard.type(' ');
                    await new Promise(r => setTimeout(r, 200));
                    await xPage.keyboard.press('Backspace');
                    await new Promise(r => setTimeout(r, 200));
                    
                    await xPage.keyboard.type(post.text, { delay: 15 });
                    
                    const scheduleButtons = await xPage.$$('[data-testid="scheduleOption"]');
                    const scheduleBtn = scheduleButtons[0];
                    if (!scheduleBtn) throw new Error("Schedule button not found");
                    
                    // Click schedule button via evaluate to be more reliable
                    await xPage.evaluate(el => el.click(), scheduleBtn);
                    
                    // Wait for the modal select dropdowns to appear (supporting both aria-modal and role="dialog")
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
                            
                            // AM/PM Select: 2 or 3 options
                            if (optCount === 2 || optCount === 3) {
                                ampmIdx = index;
                            } 
                            // Year Select: non-empty values are 4-digit numbers
                            else if (optValues.length > 0 && optValues.every(v => v.length === 4 && !isNaN(v))) {
                                yearIdx = index;
                            } 
                            // Minute Select: 60 or 61 options
                            else if (optCount === 60 || optCount === 61) {
                                minuteIdx = index;
                            } 
                            // Day Select: 28 to 32 options
                            else if (optCount >= 28 && optCount <= 32) {
                                dayIdx = index;
                            } 
                            // Month Select: 12 or 13 options and has month name texts
                            else if (optCount === 12 || optCount === 13) {
                                const texts = Array.from(sel.options).map(o => o.text.toLowerCase());
                                const hasMonthNames = texts.some(t => t.includes('enero') || t.includes('january') || t.includes('mayo') || t.includes('may') || t.includes('febrero') || t.includes('february'));
                                if (hasMonthNames) {
                                    monthIdx = index;
                                } else {
                                    hourIdx = index;
                                }
                            } 
                            // Hour Select (24-hour format): 24 or 25 options
                            else if (optCount === 24 || optCount === 25) {
                                hourIdx = index;
                            }
                        });

                        // Fallback using DOM layout order if mapping failed
                        if (monthIdx === -1 && selects[0]) monthIdx = 0;
                        if (dayIdx === -1 && selects[1]) dayIdx = 1;
                        if (yearIdx === -1 && selects[2]) yearIdx = 2;
                        if (hourIdx === -1 && selects[3]) hourIdx = 3;
                        if (minuteIdx === -1 && selects[4]) minuteIdx = 4;
                        if (ampmIdx === -1 && selects[5]) ampmIdx = 5;

                        return { monthIdx, dayIdx, yearIdx, hourIdx, minuteIdx, ampmIdx };
                    });

                    const selects = await xPage.$$('[aria-modal="true"] select, [role="dialog"] select');

                    const selectValueOnHandle = async (handle, targetValue) => {
                        if (!handle) return 'missing';
                        const targetStr = targetValue.toString();
                        const targetPadded = targetStr.padStart(2, '0');
                        
                        const options = await handle.evaluate(sel => {
                            return Array.from(sel.options).map(o => ({ value: o.value, text: o.text }));
                        });
                        
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
                            return `selected_${matchedValue}`;
                        }
                        return `value_${targetStr}_not_found`;
                    };

                    const selectStatus = {
                        year: 'missing',
                        month: 'missing',
                        day: 'missing',
                        hour: 'missing',
                        minute: 'missing',
                        ampm: 'not_applicable'
                    };

                    if (selectRoles.yearIdx !== -1 && selects[selectRoles.yearIdx]) {
                        selectStatus.year = await selectValueOnHandle(selects[selectRoles.yearIdx], yearVal);
                    }
                    if (selectRoles.monthIdx !== -1 && selects[selectRoles.monthIdx]) {
                        selectStatus.month = await selectValueOnHandle(selects[selectRoles.monthIdx], monthVal);
                    }
                    if (selectRoles.dayIdx !== -1 && selects[selectRoles.dayIdx]) {
                        selectStatus.day = await selectValueOnHandle(selects[selectRoles.dayIdx], dayVal);
                    }
                    if (selectRoles.minuteIdx !== -1 && selects[selectRoles.minuteIdx]) {
                        selectStatus.minute = await selectValueOnHandle(selects[selectRoles.minuteIdx], minuteVal);
                    }
                    if (selectRoles.ampmIdx !== -1 && selects[selectRoles.ampmIdx]) {
                        const isPM = hourVal >= 12;
                        const targetText = isPM ? 'pm' : 'am';
                        
                        const ampmOptions = await selects[selectRoles.ampmIdx].evaluate(sel => {
                            return Array.from(sel.options).map(o => ({ value: o.value, text: o.text }));
                        });
                        
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
                            selectStatus.ampm = `selected_${matchedValue}`;
                        } else {
                            selectStatus.ampm = `target_${targetText}_not_found`;
                        }
                        
                        const hour12 = hourVal % 12 === 0 ? 12 : hourVal % 12;
                        if (selectRoles.hourIdx !== -1 && selects[selectRoles.hourIdx]) {
                            selectStatus.hour = await selectValueOnHandle(selects[selectRoles.hourIdx], hour12);
                        }
                    } else {
                        if (selectRoles.hourIdx !== -1 && selects[selectRoles.hourIdx]) {
                            selectStatus.hour = await selectValueOnHandle(selects[selectRoles.hourIdx], hourVal);
                        }
                    }

                    console.log(`Select elements configuration status:`, JSON.stringify(selectStatus));
                    
                    await new Promise(r => setTimeout(r, 1500));
                    
                    const clickConfirmStatus = await xPage.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-modal="true"] [role="button"], [role="dialog"] [role="button"]');
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (text === 'confirm' || text === 'confirmar' || text === 'update' || text === 'actualizar' || testid.includes('confirm')) {
                                btn.click();
                                return `clicked_button_with_text_${text}_and_testid_${testid}`;
                            }
                        }
                        return 'no_confirm_button_found';
                    });
                    console.log(`Click confirm button status: ${clickConfirmStatus}`);
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    const clickScheduleStatus = await xPage.evaluate(() => {
                        const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                        if (inlineBtn && !inlineBtn.disabled) {
                            inlineBtn.click(); return 'clicked_tweetButtonInline';
                        }
                        const mainBtn = document.querySelector('[data-testid="tweetButton"]');
                        if (mainBtn && !mainBtn.disabled) {
                            mainBtn.click(); return 'clicked_tweetButton';
                        }
                        const buttons = Array.from(document.querySelectorAll('[role="button"]'));
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (
                                testid === 'tweetbutton' || 
                                testid === 'tweetbuttoninline' || 
                                text === 'schedule' || 
                                text === 'programar' || 
                                text === 'post' || 
                                text === 'publicar'
                            ) {
                                if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                    btn.click();
                                    return `clicked_role_button_with_text_${text}_and_testid_${testid}`;
                                }
                            }
                        }
                        return 'no_active_schedule_or_post_button_found';
                    });
                    console.log(`Click schedule/post button status: ${clickScheduleStatus}`);
                    
                    // Wait for the post to be scheduled and composer to clear
                    await new Promise(r => setTimeout(r, 4000));
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`Error on post ${i+1}, retry ${retries}:`, err.message);
                    if (xPage && !xPage.isClosed()) {
                        try {
                            const screenshotPath = path.join(__dirname, `error_post_${i+1}_retry_${retries}.png`);
                            await xPage.screenshot({ path: screenshotPath });
                            console.log(`Saved error screenshot to: ${screenshotPath}`);
                        } catch (ssErr) {
                            console.error("Failed to take screenshot:", ssErr.message);
                        }
                        try {
                            await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                            await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                            await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        } catch (e) {
                            console.error("Navigation/Escape recovery error inside catch block ignored:", e.message);
                        }
                    } else {
                        console.error("xPage is closed or disconnected, breaking retry loop.");
                        break;
                    }
                }
            }
            
            if (success) {
                fs.writeFileSync('progress.json', JSON.stringify(i + 1));
                console.log(`Success! Waiting before next post...`);
                await new Promise(r => setTimeout(r, 3000 + Math.random() * 3000));
            } else {
                console.error(`Failed to schedule post ${i+1} after 3 retries. Skipping to next.`);
                fs.writeFileSync('progress.json', JSON.stringify(i + 1));
            }
        }
        
        console.log("Finished scheduling all posts.");
        await browser.disconnect();
    } catch (e) {
        console.error("Fatal Error in automation:", e);
    }
})();
