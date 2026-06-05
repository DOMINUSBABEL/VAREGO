// Dynamic pacing utility to avoid rate limits
async function applyPacingDelay(platform) {
    const delays = {
        instagram: 60000, // 1 min
        tiktok: 90000,    // 1.5 mins
        facebook: 45000,  // 45s
        youtube: 120000   // 2 mins
    };
    const target = delays[platform.toLowerCase()] || 30000;
    console.log(`Pacing delay active: waiting ${target / 1000}s for ${platform}...`);
    await new Promise(r => setTimeout(r, target + Math.random() * 10000));
}
module.exports = { applyPacingDelay };
