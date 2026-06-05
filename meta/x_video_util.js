// Video processing wait helper
async function waitVideoProcessingX(page) {
    console.log("Waiting for X.com video processing backend to complete...");
    let processed = false;
    let attempts = 0;
    while (!processed && attempts < 10) {
        const errorMsg = await page.evaluate(() => {
            const el = document.querySelector('[data-testid="attachmentsPhoto"]');
            return el ? el.innerText.includes('Error') : false;
        });
        if (errorMsg) throw new Error("Video upload failed on X");
        await new Promise(r => setTimeout(r, 4000));
        attempts++;
    }
}
module.exports = { waitVideoProcessingX };
