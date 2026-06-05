const fs = require('fs');
const path = require('path');
const { InstagramPublisher } = require('./instagram');
const { TikTokPublisher } = require('./tiktok');
const { FacebookPublisher } = require('./facebook');
const { BusinessSuitePublisher } = require('./business_suite');
const { renderCardImage, compileVideoDynamic } = require('../video/generator');

// Read config file safely
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta_config.json'), 'utf8'));

async function processCampaign() {
    console.log("Starting Varego Meta Scheduling Campaign...");
    
    const postsPath = path.join(__dirname, '..', 'meta_posts.json');
    if (!fs.existsSync(postsPath)) {
        console.log(`No posts file found at ${postsPath}. Exiting.`);
        return;
    }
    
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    let progress = 0;
    const progressPath = path.join(__dirname, 'progress_meta.json');
    
    if (fs.existsSync(progressPath)) {
        progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
        console.log(`Resuming Meta campaign from index ${progress}`);
    }
    
    for (let i = progress; i < posts.length; i++) {
        const post = posts[i];
        console.log(`Processing Meta post ${i+1}/${posts.length}: Topic: ${post.topic}`);
        
        let videoPath = post.video_path;
        if (!videoPath || !fs.existsSync(videoPath)) {
            console.log("Generating video asset from post contents...");
            const tempImg = path.join(__dirname, `temp_card_${i}.png`);
            videoPath = path.join(__dirname, `temp_video_${i}.mp4`);
            
            await renderCardImage(post.text, post.topic, tempImg, { theme: post.theme || 'warm' });
            await compileVideoDynamic(tempImg, videoPath, config.videoSettings.duration, config.videoSettings.fps);
            
            if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
            post.video_path = videoPath;
        }
        
        let success = true;
        
        if (config.businessSuite.enabled) {
            try {
                console.log("Publishing via Meta Business Suite...");
                const suite = new BusinessSuitePublisher();
                await suite.publish(videoPath, post.text);
            } catch (err) {
                console.error("Meta Business Suite publish error:", err.message);
                success = false;
            }
        } else {
            if (config.instagram.enabled) {
                try {
                    console.log("Publishing to Instagram...");
                    const ig = new InstagramPublisher();
                    await ig.publish(videoPath, post.text);
                } catch (err) {
                    console.error("Instagram publish error:", err.message);
                    success = false;
                }
            }
            if (config.facebook.enabled) {
                try {
                    console.log("Publishing to Facebook...");
                    const fb = new FacebookPublisher();
                    await fb.publish(videoPath, post.text);
                } catch (err) {
                    console.error("Facebook publish error:", err.message);
                    success = false;
                }
            }
        }
        
        if (config.tiktok.enabled) {
            try {
                console.log("Publishing to TikTok...");
                const tt = new TikTokPublisher();
                await tt.publish(videoPath, post.text);
            } catch (err) {
                console.error("TikTok publish error:", err.message);
                success = false;
            }
        }
        
        if (success) {
            console.log(`Successfully completed Meta post ${i+1}`);
            progress = i + 1;
            fs.writeFileSync(progressPath, JSON.stringify(progress));
        } else {
            console.error(`Post ${i+1} encountered errors. Stopping campaign execution.`);
            break;
        }
    }
}

if (require.main === module) {
    processCampaign();
}

module.exports = { processCampaign };
