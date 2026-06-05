// Utility for staging multi-media uploads on X.com
async function uploadMediaListToX(page, filePaths) {
    console.log(`Uploading ${filePaths.length} media items to X...`);
    for (const file of filePaths) {
        const fileInput = await page.waitForSelector('input[type="file"]');
        await fileInput.uploadFile(file);
        await new Promise(r => setTimeout(r, 3000));
    }
}
module.exports = { uploadMediaListToX };
