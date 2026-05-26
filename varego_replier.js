const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

// Reference Links (No colons used!)
const LINK_THREAD1 = 'x.com/i/status/2059103530598703393';
const LINK_THREAD2 = 'x.com/i/status/2059116110633406489';

// Reply templates (Strictly: No quotes, No colons)
const TEMPLATES = {
    T1_ES: [
        "Una reflexión descarnada sobre cómo el silicio y los algoritmos nos arrebatan la soberanía de la mente. Te invito a ver nuestro análisis en " + LINK_THREAD1,
        "El amo digital nos vigila en la noche mientras entregamos nuestra palabra. Si quieres profundizar en esta dialéctica lee nuestro hilo en " + LINK_THREAD1,
        "No hay salvación en la sumisión tecnológica voluntaria. Analizamos esta encíclica desde la perspectiva de la autopropiedad en " + LINK_THREAD1,
        "El silicio no entiende de perdón ni de piedad, pero le entregamos nuestra conciencia. Lee nuestra áspera reflexión en " + LINK_THREAD1
    ],
    T1_EN: [
        "A deep analysis on how we surrender our cognitive agency to the silicon master. Read our full thread here " + LINK_THREAD1,
        "We believe we control the machine but we are becoming its data slaves. Check out our philosophical breakdown at " + LINK_THREAD1,
        "The new master of the earth lives in the cloud and feeds on our digital confessions. Read our reflection in " + LINK_THREAD1,
        "Technology is not neutral and carries the face of its owners. Explore our dialectical view on this at " + LINK_THREAD1
    ],
    T2_ES: [
        "La farsa de la optimización absoluta y el diseño de una nueva Babel que aniquila la libertad humana. Puedes leer nuestro hilo en " + LINK_THREAD2,
        "Prefiero el riesgo del abismo antes que la paz de cementerio que nos vende la técnica corporativa. Te invito a leer nuestra reflexión en " + LINK_THREAD2,
        "Cuando extirpamos la fragilidad humana cancelamos la posibilidad del espíritu. Un análisis profundo de la encíclica en " + LINK_THREAD2,
        "La utopía de un mundo optimizado por algoritmos es solo una jaula de cristal. Te invito a debatir en nuestro hilo " + LINK_THREAD2
    ],
    T2_EN: [
        "The illusion of frictionless optimization is the death of human freedom. Join the discussion in our thread " + LINK_THREAD2,
        "Building a new Babel with silicon bricks only leads to digital uniformization. Read our perspective here " + LINK_THREAD2,
        "A critique of post-humanism and the technocratic paradigm. Read the analysis at " + LINK_THREAD2,
        "Friction and vulnerability are what make us human. Read our philosophical reply to the Pope's text at " + LINK_THREAD2
    ]
};

// Heuristic to detect if text is English
function isEnglishText(text) {
    const englishWords = ['the', 'and', 'pope', 'encyclical', 'leo', 'artificial', 'intelligence', 'church', 'vatican', 'humanity', 'technology', 'silicon'];
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;
    words.forEach(w => {
        if (englishWords.includes(w)) count++;
    });
    return count >= 2 || (count >= 1 && !text.includes(' de ') && !text.includes(' el ') && !text.includes(' la '));
}

(async () => {
    try {
        let progress = {
            stage: 'collect',
            popular_tweets: [],
            recent_tweets: [],
            posted_count: 0
        };

        if (fs.existsSync('progress_replies.json')) {
            progress = JSON.parse(fs.readFileSync('progress_replies.json', 'utf8'));
            console.log("Resuming progress from progress_replies.json. Stage:", progress.stage);
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

        // Get own username to filter out own tweets
        console.log("Waiting for profile navigation link...");
        let ownUsername = 'NOT_FOUND';
        try {
            await xPage.waitForSelector('a[data-testid="AppTabBar_Profile_Link"]', { timeout: 15000 });
            const profileHref = await xPage.evaluate(() => {
                const el = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
                return el ? el.getAttribute('href') : null;
            });
            if (profileHref) ownUsername = profileHref.replace('/', '');
        } catch (e) {
            console.log("AppTabBar_Profile_Link timeout, trying SideNav_AccountSidebar_ProfileLink...");
            try {
                await xPage.waitForSelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]', { timeout: 5000 });
                const profileHref = await xPage.evaluate(() => {
                    const el = document.querySelector('[data-testid="SideNav_AccountSidebar_ProfileLink"]');
                    return el ? el.getAttribute('href') : null;
                });
                if (profileHref) ownUsername = profileHref.replace('/', '');
            } catch (err) {
                console.error("Could not determine own username automatically.");
            }
        }
        console.log(`Own username detected: ${ownUsername}`);

        // Helper to scrape status links on a search page
        const scrapeSearchPage = async (page, url) => {
            console.log(`Navigating to search URL: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 4000));
            
            // Scroll down a few times to load tweets
            for (let i = 0; i < 3; i++) {
                await page.evaluate(() => window.scrollBy(0, 1000));
                await new Promise(r => setTimeout(r, 2000));
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

        if (progress.stage === 'collect') {
            console.log("Collecting candidate tweets for replies...");
            
            // 1. Collect popular tweets (Top search)
            const popQueries = [
                'https://x.com/search?q=%22Magnifica%20Humanitas%22&f=top',
                'https://x.com/search?q=%22Leon%20XIV%22%20OR%20%22Le%C3%B3n%20XIV%22&f=top',
                'https://x.com/search?q=Pope%20Leo%20XIV%20artificial&f=top'
            ];
            
            let popCandidates = [];
            for (const q of popQueries) {
                try {
                    const links = await scrapeSearchPage(xPage, q);
                    popCandidates.push(...links);
                } catch (e) {
                    console.error("Error scraping query:", q, e.message);
                }
            }
            popCandidates = [...new Set(popCandidates)].filter(url => !url.includes(`/${ownUsername}/`));
            console.log(`Collected ${popCandidates.length} unique popular candidates.`);

            // 2. Collect recent tweets (Latest search)
            const recQueries = [
                'https://x.com/search?q=%22Magnifica%20Humanitas%22&f=live',
                'https://x.com/search?q=%22Leon%20XIV%22%20OR%20%22Le%C3%B3n%20XIV%22&f=live',
                'https://x.com/search?q=Pope%20Leo%20XIV%20artificial&f=live'
            ];
            
            let recCandidates = [];
            for (const q of recQueries) {
                try {
                    const links = await scrapeSearchPage(xPage, q);
                    recCandidates.push(...links);
                } catch (e) {
                    console.error("Error scraping query:", q, e.message);
                }
            }
            recCandidates = [...new Set(recCandidates)]
                .filter(url => !url.includes(`/${ownUsername}/`))
                .filter(url => !popCandidates.includes(url)); // Exclude popular candidates
            
            console.log(`Collected ${recCandidates.length} unique recent candidates.`);

            // Select targets
            progress.popular_tweets = popCandidates.slice(0, 14);
            progress.recent_tweets = recCandidates.slice(0, 10);
            
            if (progress.popular_tweets.length < 14) {
                console.log("Warning: Less than 14 popular tweets found. Padding with recent ones.");
                const needed = 14 - progress.popular_tweets.length;
                const pad = progress.recent_tweets.slice(0, needed);
                progress.popular_tweets.push(...pad);
                progress.recent_tweets = progress.recent_tweets.slice(needed);
            }
            
            progress.stage = 'posting';
            fs.writeFileSync('progress_replies.json', JSON.stringify(progress, null, 4));
            console.log(`Selection completed: 14 Popular, 10 Recent.`);
        }

        // Now start the replying loops
        const targetQueue = [];
        // Target 14 Popular
        for (let i = 0; i < progress.popular_tweets.length; i++) {
            targetQueue.push({
                url: progress.popular_tweets[i],
                category: 'popular',
                thread_target: i < 7 ? 1 : 2 // 7 for Thread 1, 7 for Thread 2
            });
        }
        // Target 10 Recent
        for (let i = 0; i < progress.recent_tweets.length; i++) {
            targetQueue.push({
                url: progress.recent_tweets[i],
                category: 'recent',
                thread_target: i < 5 ? 1 : 2 // 5 for Thread 1, 5 for Thread 2
            });
        }

        console.log(`Total queue size for posting: ${targetQueue.length}. Already posted: ${progress.posted_count}`);

        for (let i = progress.posted_count; i < targetQueue.length; i++) {
            const task = targetQueue[i];
            console.log(`Processing reply ${i+1}/${targetQueue.length} on tweet: ${task.url}`);
            
            let success = false;
            let skipped = false;
            let retries = 0;
            
            while (!success && retries < 3) {
                try {
                    await xPage.goto(task.url, { waitUntil: 'domcontentloaded' });
                    await new Promise(r => setTimeout(r, 4000));
                    
                    // Check if we already replied to this tweet
                    if (ownUsername !== 'NOT_FOUND') {
                        const alreadyReplied = await xPage.evaluate((username) => {
                            const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
                            for (const tweet of tweets) {
                                const links = Array.from(tweet.querySelectorAll('a'));
                                const isFromUs = links.some(l => {
                                    const href = l.getAttribute('href');
                                    return href === '/' + username;
                                });
                                if (isFromUs) return true;
                            }
                            return false;
                        }, ownUsername);

                        if (alreadyReplied) {
                            console.log(`Already replied to this tweet (from ${ownUsername}). Skipping...`);
                            skipped = true;
                            success = true;
                            break;
                        }
                    }
                    
                    // Extract text
                    const tweetText = await xPage.evaluate(() => {
                        const el = document.querySelector('[data-testid="tweetText"]');
                        return el ? el.innerText : '';
                    });
                    
                    const isEnglish = isEnglishText(tweetText);
                    console.log(`Target tweet language: ${isEnglish ? 'English' : 'Spanish'}`);
                    
                    // Select template
                    let templateList = [];
                    if (task.thread_target === 1) {
                        templateList = isEnglish ? TEMPLATES.T1_EN : TEMPLATES.T1_ES;
                    } else {
                        templateList = isEnglish ? TEMPLATES.T2_EN : TEMPLATES.T2_ES;
                    }
                    
                    const replyText = templateList[Math.floor(Math.random() * templateList.length)];
                    console.log(`Selected reply text: ${replyText}`);

                    // Write reply
                    await xPage.waitForSelector('[data-testid="tweetTextarea_0"]', { visible: true, timeout: 15000 });
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
                    console.log(`Reply click status: ${clicked}`);
                    if (clicked === 'no_reply_button_found') throw new Error("Reply button not found");
                    
                    await new Promise(r => setTimeout(r, 4000));
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`Error reply on index ${i}, retry ${retries}:`, err.message);
                    try {
                        await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                    } catch (e) {}
                }
            }

            if (success) {
                progress.posted_count = i + 1;
                fs.writeFileSync('progress_replies.json', JSON.stringify(progress, null, 4));
                if (skipped) {
                    console.log(`Skipped (already replied). Moving to next.`);
                } else {
                    console.log(`Successful reply!`);
                    
                    if (i + 1 < targetQueue.length) {
                        // Random delay of 1 to 2 minutes (60 to 120 seconds)
                        const delayMs = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
                        console.log(`Waiting ${Math.round(delayMs / 1000)} seconds before the next reply to mitigate rate limits...`);
                        await new Promise(r => setTimeout(r, delayMs));
                    }
                }
            } else {
                console.error(`Failed to reply on index ${i} after 3 retries. Skipping.`);
                progress.posted_count = i + 1;
                fs.writeFileSync('progress_replies.json', JSON.stringify(progress, null, 4));
            }
        }

        console.log("All replies processed successfully.");
        await browser.disconnect();
    } catch (e) {
        console.error("Fatal error in replier script:", e);
    }
})();
