const puppeteer = require('puppeteer-core');
const fs = require('fs');

function generateRandomDates(startDate, count, durationHours) {
    const dates = [];
    const endMs = startDate.getTime() + (durationHours * 60 * 60 * 1000);
    const startMs = startDate.getTime();
    
    for (let i = 0; i < count; i++) {
        const randomMs = startMs + Math.random() * (endMs - startMs);
        dates.push(new Date(randomMs));
    }
    
    return dates.sort((a, b) => a.getTime() - b.getTime());
}

(async () => {
    try {
        const quotes = JSON.parse(fs.readFileSync('quotes.json', 'utf8'));
        const startDate = new Date("2026-05-18T04:32:00.000-05:00"); // 4:32 AM
        
        let progress = 0;
        if (fs.existsSync('progress.json')) {
            progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));
            console.log(`Resuming from quote index ${progress}`);
        }
        
        const randomDates = generateRandomDates(startDate, quotes.length, 96);

        const browserURL = 'http://127.0.0.1:9222';
        const browser = await puppeteer.connect({ browserURL });
        const pages = await browser.pages();
        let xPage = pages.find(p => p.url().includes('x.com'));
        if (!xPage) {
            console.log("No X page found, opening a new tab...");
            xPage = await browser.newPage();
        }
        
        await xPage.bringToFront();
        await xPage.goto('https://x.com/home', { waitUntil: 'networkidle2' });
        
        for (let i = progress; i < quotes.length; i++) {
            const quote = quotes[i];
            const postDate = randomDates[i];
            
            console.log(`Scheduling quote ${i+1}/${quotes.length} for ${postDate.toLocaleString()}`);
            
            let success = false;
            let retries = 0;
            
            while (!success && retries < 3) {
                try {
                    // Scroll to top to ensure inline composer is visible
                    await xPage.evaluate(() => window.scrollTo(0, 0));
                    await new Promise(r => setTimeout(r, 1000));
                    
                    // Click the inline tweet textarea directly
                    const textAreas = await xPage.$$('[data-testid="tweetTextarea_0"]');
                    const textArea = textAreas[0]; // The first one is usually the inline one
                    
                    if (!textArea) throw new Error("Textarea not found");
                    
                    // Clear it and focus
                    await textArea.click();
                    await new Promise(r => setTimeout(r, 800));
                    
                    await xPage.keyboard.down('Control');
                    await xPage.keyboard.press('A');
                    await xPage.keyboard.up('Control');
                    await xPage.keyboard.press('Backspace');
                    await new Promise(r => setTimeout(r, 500));

                    // Type quote using keyboard events
                    await xPage.keyboard.type(quote, { delay: 15 });
                    
                    // Find and click the schedule button within the same composer
                    const scheduleButtons = await xPage.$$('[data-testid="scheduleOption"]');
                    const scheduleBtn = scheduleButtons[0];
                    if (!scheduleBtn) throw new Error("Schedule button not found");
                    
                    await scheduleBtn.click();
                    
                    // Wait for schedule modal to appear
                    await xPage.waitForSelector('[aria-modal="true"] select', { visible: true, timeout: 10000 });
                    await new Promise(r => setTimeout(r, 1000));
                    
                    const monthStr = (postDate.getMonth() + 1).toString();
                    const dayStr = postDate.getDate().toString();
                    const yearStr = postDate.getFullYear().toString();
                    const hourStr = postDate.getHours().toString(); // 24-hour format
                    const minuteStr = postDate.getMinutes().toString();

                    await xPage.evaluate(({monthStr, dayStr, yearStr, hourStr, minuteStr}) => {
                        const selects = document.querySelectorAll('[aria-modal="true"] select');
                        if (selects.length >= 5) {
                            selects[0].value = monthStr;
                            selects[0].dispatchEvent(new Event('change', { bubbles: true }));
                            
                            selects[1].value = dayStr;
                            selects[1].dispatchEvent(new Event('change', { bubbles: true }));
                            
                            selects[2].value = yearStr;
                            selects[2].dispatchEvent(new Event('change', { bubbles: true }));
                            
                            selects[3].value = hourStr;
                            selects[3].dispatchEvent(new Event('change', { bubbles: true }));
                            
                            selects[4].value = minuteStr;
                            selects[4].dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }, {monthStr, dayStr, yearStr, hourStr, minuteStr});
                    
                    await new Promise(r => setTimeout(r, 1500));
                    
                    // Click Confirm on the schedule modal
                    await xPage.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-modal="true"] [role="button"]');
                        for (const btn of buttons) {
                            const text = (btn.innerText || '').trim().toLowerCase();
                            const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                            if (text === 'confirm' || text === 'confirmar' || text === 'update' || text === 'actualizar' || testid.includes('confirm')) {
                                btn.click();
                                return;
                            }
                        }
                    });
                    
                    await new Promise(r => setTimeout(r, 2000));
                    
                    // Click Schedule on the inline composer
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
                                    btn.click();
                                    return;
                                }
                            }
                        }
                    });
                    
                    // Wait for progress bar or toast, indicating it was scheduled
                    await new Promise(r => setTimeout(r, 4000));
                    
                    // Verify the textarea is empty again or just assume success
                    success = true;
                } catch (err) {
                    retries++;
                    console.error(`Error on quote ${i+1}, retry ${retries}:`, err.message);
                    // Close any open modal just in case
                    await xPage.keyboard.press('Escape');
                    await new Promise(r => setTimeout(r, 1000));
                    await xPage.keyboard.press('Escape');
                    await new Promise(r => setTimeout(r, 1000));
                    
                    // Reload page to reset state if retrying
                    await xPage.goto('https://x.com/home', { waitUntil: 'networkidle2' });
                }
            }
            
            if (success) {
                fs.writeFileSync('progress.json', JSON.stringify(i + 1));
                console.log(`Success! Waiting before next post...`);
                // Wait between 3 to 6 seconds before next iteration
                await new Promise(r => setTimeout(r, 3000 + Math.random() * 3000));
            } else {
                console.error(`Failed to schedule quote ${i+1} after 3 retries. Skipping to next.`);
                fs.writeFileSync('progress.json', JSON.stringify(i + 1));
            }
        }
        
        console.log("Finished scheduling all posts.");
        await browser.disconnect();
    } catch (e) {
        console.error("Fatal Error in automation:", e);
    }
})();
