const { InstagramPublisher } = require('./meta/instagram');
const { TikTokPublisher } = require('./meta/tiktok');
const { FacebookPublisher } = require('./meta/facebook');

(async () => {
    console.log("=== Testing Meta Publishers Login State ===");
    try {
        const ig = new InstagramPublisher();
        await ig.init();
        const igLoggedIn = await ig.verifyLogin().catch(() => false);
        console.log(`Instagram Login Status: ${igLoggedIn ? "LOGGED IN" : "NOT LOGGED IN"}`);
        await ig.close();
        
        const fb = new FacebookPublisher();
        await fb.init();
        const fbLoggedIn = await fb.verifyLogin().catch(() => false);
        console.log(`Facebook Login Status: ${fbLoggedIn ? "LOGGED IN" : "NOT LOGGED IN"}`);
        await fb.close();
    } catch (err) {
        console.error("Dry run verification error:", err.message);
    }
})();
