// Chaining thread replies on X.com
async function chainThreadOnX(page, texts, filePaths = []) {
    console.log(`Starting chain of ${texts.length} replies on X...`);
    for (let i = 0; i < texts.length; i++) {
        const textAreas = await page.$$('[data-testid="tweetTextarea_0"]');
        await textAreas[0].click();
        await page.keyboard.type(texts[i], { delay: 10 });
        await new Promise(r => setTimeout(r, 1000));
        
        if (filePaths[i]) {
            const input = await page.$('input[type="file"]');
            await input.uploadFile(filePaths[i]);
            await new Promise(r => setTimeout(r, 4000));
        }
        
        const replyBtn = await page.waitForSelector('[data-testid="tweetButtonInline"]');
        await replyBtn.click();
        await new Promise(r => setTimeout(r, 6000));
    }
}
module.exports = { chainThreadOnX };
