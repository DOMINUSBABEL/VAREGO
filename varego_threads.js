const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const { getHeadlessOption } = require('./utils/headless_ask');

// Helper to pad numbers
const pad = (n) => n.toString().padStart(2, '0');

(async () => {
    try {
        console.log("Loading posts from posts.json...");
        const posts = JSON.parse(fs.readFileSync(path.join('..', 'output', '177_posts', 'posts.json'), 'utf8'));
        console.log(`Loaded ${posts.length} posts.`);

        let progress = {};
        if (fs.existsSync('progress_threads.json')) {
            progress = JSON.parse(fs.readFileSync('progress_threads.json', 'utf8'));
            console.log(`Resuming from progress state:`, JSON.stringify(progress));
        } else {
            progress = {
                scheduled_done: false,
                thread_post_index: 0,
                parent_tweet_url: null
            };
        }

        const headless = await getHeadlessOption("¿Desea ejecutar el navegador de HILOS en modo invisible (headless) o mostrando el navegador para auditar el proceso de publicación? (s = invisible / n = mostrar para auditar, por defecto 'n'): ");

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
        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        
        console.log("-----------------------------------------------------");
        console.log("ESPERANDO INICIO DE SESIÓN...");
        console.log("Por favor, inicia sesión manualmente en la ventana de Chrome.");
        console.log("El bot detectará automáticamente cuando estés en el Home y empezará.");
        console.log("-----------------------------------------------------");

        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 0 });
        
        console.log("¡Inicio de sesión detectado!");
        await new Promise(r => setTimeout(r, 3000));

        // Get the profile href for our user to enable profile scraping
        const profileHref = await xPage.evaluate(() => {
            const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]');
            return el ? el.getAttribute('href') : null;
        });
        console.log(`Logged in as user profile: ${profileHref}`);
        if (!profileHref) {
            console.error("Warning: Could not detect profile username. Fallback scraping might be impaired.");
        }

        // Helper to scrape the latest tweet URL from profile (skipping pinned)
        const getLatestTweetUrl = async (page, pRealHref) => {
            if (!pRealHref) return null;
            try {
                console.log(`Navigating to profile to find latest tweet: https://x.com${pRealHref}`);
                await page.goto(`https://x.com${pRealHref}`, { waitUntil: 'networkidle2' });
                await new Promise(r => setTimeout(r, 4000));
                
                const url = await page.evaluate((pHref) => {
                    const cells = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'));
                    for (const cell of cells) {
                        const isPinned = cell.innerText.includes('Fijado') || cell.innerText.includes('Pinned') || cell.innerText.includes('Fijar');
                        if (isPinned) continue;
                        
                        const links = Array.from(cell.querySelectorAll('a'));
                        const statusLink = links.find(l => l.href.includes(pHref + '/status/'));
                        if (statusLink) {
                            return statusLink.href;
                        }
                    }
                    return null;
                }, pRealHref);
                
                console.log(`Found latest tweet URL: ${url}`);
                return url;
            } catch (err) {
                console.error(`Error scraping latest tweet URL:`, err.message);
                return null;
            }
        };

        // Network interception for new Tweet IDs as a high-fidelity mechanism
        let interceptedTweetId = null;
        xPage.on('response', async response => {
            try {
                const url = response.url();
                if (url.includes('CreateTweet') && response.request().method() === 'POST') {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    if (json.data && json.data.create_tweet && json.data.create_tweet.tweet_results && json.data.create_tweet.tweet_results.result) {
                        interceptedTweetId = json.data.create_tweet.tweet_results.result.rest_id;
                        console.log(`Intercepted Tweet ID from network response: ${interceptedTweetId}`);
                    }
                }
            } catch (e) {
                // Silence parsing errors for other calls
            }
        });

        // 1. SCHEDULE TOMORROW'S POSTS FIRST
        if (!progress.scheduled_done) {
            console.log("Starting scheduling process for tomorrow's posts...");
            const singlePosts = posts.filter(p => p.type === 'single');
            
            for (let i = 0; i < singlePosts.length; i++) {
                const post = singlePosts[i];
                console.log(`Scheduling post ${i+1}/${singlePosts.length} (Global ID ${post.id}) for ${post.date}`);
                
                let success = false;
                let retries = 0;
                
                while (!success && retries < 3) {
                    try {
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 2000));
                        await xPage.evaluate(() => window.scrollTo(0, 0));
                        
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
                        await new Promise(r => setTimeout(r, 800));

                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        
                        await xPage.keyboard.type(post.text, { delay: 15 });
                        
                        const scheduleButtons = await xPage.$$('[data-testid="scheduleOption"]');
                        const scheduleBtn = scheduleButtons[0];
                        if (!scheduleBtn) throw new Error("Schedule button not found");
                        
                        await xPage.evaluate(el => el.click(), scheduleBtn);
                        
                        await Promise.race([
                            xPage.waitForSelector('[aria-modal="true"] select', { visible: true, timeout: 15000 }),
                            xPage.waitForSelector('[role="dialog"] select', { visible: true, timeout: 15000 })
                        ]);
                        await new Promise(r => setTimeout(r, 1000));
                        
                        const postDate = new Date(post.date);
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
                                return `selected_${matchedValue}`;
                            }
                            return `value_${targetStr}_not_found`;
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
                                if (testid === 'tweetbutton' || testid === 'tweetbuttoninline' || text === 'schedule' || text === 'programar' || text === 'post' || text === 'publicar') {
                                    if (!btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                        btn.click();
                                        return `clicked_role_button_with_text_${text}_and_testid_${testid}`;
                                    }
                                }
                            }
                            return 'no_active_schedule_or_post_button_found';
                        });
                        console.log(`Click schedule status: ${clickScheduleStatus}`);
                        
                        await new Promise(r => setTimeout(r, 4000));
                        success = true;
                    } catch (err) {
                        retries++;
                        console.error(`Error scheduling post ${post.id}, retry ${retries}:`, err.message);
                        try {
                            await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                            await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                        } catch (e) {}
                    }
                }
                
                if (!success) {
                    console.error(`Failed to schedule post ${post.id} after 3 retries. Skipping to next.`);
                }
                await new Promise(r => setTimeout(r, 2000));
            }

            progress.scheduled_done = true;
            fs.writeFileSync('progress_threads.json', JSON.stringify(progress, null, 4));
            console.log("All tomorrow's scheduled posts completed successfully.");
        }

        // 2. LIVE POSTING THREADS
        console.log("Starting live thread deployment loops...");
        const threadPosts = posts.filter(p => p.type === 'thread');

        for (let i = progress.thread_post_index; i < threadPosts.length; i++) {
            const post = threadPosts[i];
            const targetTime = new Date(post.date);

            // Idle wait loop until target time
            while (true) {
                const now = new Date();
                const diffMs = targetTime.getTime() - now.getTime();
                if (diffMs <= 0) {
                    break;
                }
                console.log(`Waiting for post ${post.id} (Thread ${post.thread_id}, Index ${post.thread_index}) at ${targetTime.toLocaleTimeString()}. Time left: ${Math.round(diffMs / 1000)} seconds...`);
                // Sleep for up to 30 seconds
                const sleepTime = Math.min(diffMs, 30000);
                await new Promise(r => setTimeout(r, sleepTime));
            }

            console.log(`Deploying live post ${post.id} (Thread ${post.thread_id}, Index ${post.thread_index})`);
            let success = false;
            let retries = 0;

            while (!success && retries < 3) {
                try {
                    interceptedTweetId = null;
                    
                    if (post.thread_index === 0) {
                        // First post of the thread: Post to home page
                        console.log("Posting first tweet of the thread to home...");
                        await xPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 3000));
                        
                        const textAreas = await xPage.$$('[data-testid="tweetTextarea_0"]');
                        const textArea = textAreas[0];
                        if (!textArea) throw new Error("Home text area not found");
                        
                        await textArea.click();
                        await new Promise(r => setTimeout(r, 800));
                        await xPage.evaluate(el => el.focus(), textArea);
                        
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        
                        await xPage.keyboard.type(post.text, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Click post button
                        const clicked = await xPage.evaluate(() => {
                            const inlineBtn = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (inlineBtn && !inlineBtn.disabled) {
                                inlineBtn.click(); return 'clicked_tweetButtonInline';
                            }
                            const mainBtn = document.querySelector('[data-testid="tweetButton"]');
                            if (mainBtn && !mainBtn.disabled) {
                                mainBtn.click(); return 'clicked_tweetButton';
                            }
                            return 'no_post_button_found';
                        });
                        console.log(`Home post click status: ${clicked}`);
                        if (clicked === 'no_post_button_found') throw new Error("Could not find post button");
                        
                        await new Promise(r => setTimeout(r, 5000));
                        
                        // Grab the new Tweet URL
                        let tweetUrl = null;
                        if (interceptedTweetId) {
                            tweetUrl = `https://x.com/i/status/${interceptedTweetId}`;
                        } else {
                            // Fallback to scraping profile
                            tweetUrl = await getLatestTweetUrl(xPage, profileHref);
                        }

                        if (!tweetUrl) {
                            throw new Error("Could not capture new tweet URL");
                        }
                        
                        progress.parent_tweet_url = tweetUrl;
                        success = true;
                    } else {
                        // Reply post: Navigate to parent and reply
                        const parentUrl = progress.parent_tweet_url;
                        if (!parentUrl) {
                            throw new Error("Parent tweet URL is null for thread reply");
                        }
                        console.log(`Replying to parent URL: ${parentUrl}`);
                        await xPage.goto(parentUrl, { waitUntil: 'domcontentloaded' });
                        await new Promise(r => setTimeout(r, 4000));
                        
                        // Check if reply box is visible
                        await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
                        const replyArea = await xPage.$('[data-testid="tweetTextarea_0"]');
                        await replyArea.click();
                        await new Promise(r => setTimeout(r, 500));
                        await xPage.evaluate(el => el.focus(), replyArea);
                        
                        await xPage.keyboard.type(' ');
                        await new Promise(r => setTimeout(r, 200));
                        await xPage.keyboard.press('Backspace');
                        await new Promise(r => setTimeout(r, 200));
                        
                        await xPage.keyboard.type(post.text, { delay: 15 });
                        await new Promise(r => setTimeout(r, 1000));

                        // Click reply button
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
                                        return `clicked_button_with_text_${text}_and_testid_${testid}`;
                                    }
                                }
                            }
                            return 'no_reply_button_found';
                        });
                        console.log(`Reply post click status: ${clicked}`);
                        if (clicked === 'no_reply_button_found') throw new Error("Could not find reply button");
                        
                        await new Promise(r => setTimeout(r, 5000));

                        let tweetUrl = null;
                        if (interceptedTweetId) {
                            tweetUrl = `https://x.com/i/status/${interceptedTweetId}`;
                        } else {
                            // Fallback to profile scrape
                            tweetUrl = await getLatestTweetUrl(xPage, profileHref);
                        }

                        if (!tweetUrl) {
                            throw new Error("Could not capture reply tweet URL");
                        }
                        
                        progress.parent_tweet_url = tweetUrl;
                        success = true;
                    }
                } catch (err) {
                    retries++;
                    console.error(`Error on live thread post ${post.id}, retry ${retries}:`, err.message);
                    try {
                        await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                    } catch (e) {}
                }
            }

            if (success) {
                progress.thread_post_index = i + 1;
                fs.writeFileSync('progress_threads.json', JSON.stringify(progress, null, 4));
                console.log(`Success posting post ${post.id}!`);
                await new Promise(r => setTimeout(r, 3000));
            } else {
                console.error(`Failed to post live thread post ${post.id} after 3 retries. Skipping to next.`);
                progress.thread_post_index = i + 1;
                // If a post failed, we reset the parent URL to scrape our profile for the next thread post
                progress.parent_tweet_url = await getLatestTweetUrl(xPage, profileHref);
                fs.writeFileSync('progress_threads.json', JSON.stringify(progress, null, 4));
            }
        }

        console.log("Finished all thread posts and schedules.");
        await browser.disconnect();
    } catch (e) {
        console.error("Fatal Error in automation script:", e);
    }
})();
