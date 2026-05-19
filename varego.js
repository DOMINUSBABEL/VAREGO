const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const posts = JSON.parse(fs.readFileSync(path.join('..', 'output', '177_posts', 'posts.json'), 'utf8'));
        
        let progress = 0;
        if (fs.existsSync('progress.json')) {
            progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));
            console.log(`Resuming from post index ${progress}`);
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
        
        // Emular un User-Agent humano real
        await xPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await xPage.setViewport({ width: 1280, height: 800 });
        
        await xPage.bringToFront();
        await xPage.goto('https://x.com/home', { waitUntil: 'networkidle2' });
        
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
                    
                    await scheduleBtn.click();
                    
                    await xPage.waitForSelector('[aria-modal="true"] select', { visible: true, timeout: 10000 });
                    await new Promise(r => setTimeout(r, 1000));
                    
                    const monthStr = (postDate.getMonth() + 1).toString();
                    const dayStr = postDate.getDate().toString();
                    const yearStr = postDate.getFullYear().toString();
                    const hourStr = postDate.getHours().toString();
                    const minuteStr = postDate.getMinutes().toString();

                    await xPage.evaluate(({monthStr, dayStr, yearStr, hourStr, minuteStr}) => {
                        const selects = document.querySelectorAll('[aria-modal="true"] select');
                        if (selects.length >= 5) {
                            selects[0].value = monthStr; selects[0].dispatchEvent(new Event('change', { bubbles: true }));
                            selects[1].value = dayStr;   selects[1].dispatchEvent(new Event('change', { bubbles: true }));
                            selects[2].value = yearStr;  selects[2].dispatchEvent(new Event('change', { bubbles: true }));
                            selects[3].value = hourStr;  selects[3].dispatchEvent(new Event('change', { bubbles: true }));
                            selects[4].value = minuteStr;selects[4].dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }, {monthStr, dayStr, yearStr, hourStr, minuteStr});
                    
                    await new Promise(r => setTimeout(r, 1500));
                    
                    await xPage.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-modal="true"] [role="button"]');
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (text === 'confirm' || text === 'confirmar' || text === 'update' || text === 'actualizar' || testid.includes('confirm')) {
                                btn.click(); return;
                            }
                        }
                    });
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    await xPage.evaluate(() => {
                        const buttons = document.querySelectorAll('[data-testid="tweetButtonInline"]');
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            const allButtons = document.querySelectorAll('[role="button"]');
                            for (const btn of allButtons) {
                                const text = (btn.innerText || '').trim().toLowerCase();
                                const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                                if (testid === 'tweetButton' || testid === 'tweetButtonInline') {
                                    btn.click(); return;
                                }
                            }
                        }
                    });
                    
                    await new Promise(r => setTimeout(r, 4000));
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`Error on post ${i+1}, retry ${retries}:`, err.message);
                    await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                    await xPage.keyboard.press('Escape'); await new Promise(r => setTimeout(r, 1000));
                    await xPage.goto('https://x.com/home', { waitUntil: 'networkidle2' });
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
