const fs = require('fs');
const path = require('path');
const { InstagramPublisher } = require('./instagram');
const { TikTokPublisher } = require('./tiktok');
const { FacebookPublisher } = require('./facebook');
const { BusinessSuitePublisher } = require('./business_suite');
const { renderCardImage, compileVideoDynamic } = require('../video/generator');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta_config.json'), 'utf8'));

async function processCampaign() {
    console.log("Starting Varego Meta Scheduling Campaign with Retry & Error Capture...");
    
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
    }
    
    for (let i = progress; i < posts.length; i++) {
        const post = posts[i];
        console.log(`Processing Meta post ${i+1}/${posts.length}: Topic: ${post.topic}`);
        
        let videoPath = post.video_path;
        let generatedOnTheFly = false;
        if (!videoPath || !fs.existsSync(videoPath)) {
            console.log("Generating video asset...");
            const tempImg = path.join(__dirname, `temp_card_${i}.png`);
            videoPath = path.join(__dirname, `temp_video_${i}.mp4`);
            
            await renderCardImage(post.text, post.topic, tempImg, { theme: post.theme || 'warm' });
            await compileVideoDynamic(tempImg, videoPath, config.videoSettings.duration, config.videoSettings.fps);
            
            if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
            post.video_path = videoPath;
            generatedOnTheFly = true;
        }
        
        let success = true;
        
        if (config.businessSuite.enabled) {
            let retries = 0;
            let suiteSuccess = false;
            while (retries < 3 && !suiteSuccess) {
                try {
                    console.log(`Publishing via Meta Business Suite (Attempt ${retries+1})...`);
                    const suite = new BusinessSuitePublisher();
                    await suite.publish(videoPath, post.text);
                    suiteSuccess = true;
                } catch (err) {
                    retries++;
                    console.error(`Meta Business Suite attempt ${retries} failed:`, err.message);
                    if (retries === 3) success = false;
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        } else {
            if (config.instagram.enabled) {
                let retries = 0;
                let igSuccess = false;
                while (retries < 3 && !igSuccess) {
                    try {
                        console.log(`Publishing to Instagram (Attempt ${retries+1})...`);
                        const ig = new InstagramPublisher();
                        await ig.publish(videoPath, post.text);
                        igSuccess = true;
                    } catch (err) {
                        retries++;
                        console.error(`Instagram attempt ${retries} failed:`, err.message);
                        if (retries === 3) success = false;
                        await new Promise(r => setTimeout(r, 5000));
                    }
                }
            }
            if (config.facebook.enabled) {
                let retries = 0;
                let fbSuccess = false;
                while (retries < 3 && !fbSuccess) {
                    try {
                        console.log(`Publishing to Facebook (Attempt ${retries+1})...`);
                        const fb = new FacebookPublisher();
                        await fb.publish(videoPath, post.text);
                        fbSuccess = true;
                    } catch (err) {
                        retries++;
                        console.error(`Facebook attempt ${retries} failed:`, err.message);
                        if (retries === 3) success = false;
                        await new Promise(r => setTimeout(r, 5000));
                    }
                }
            }
        }
        
        if (config.tiktok.enabled) {
            let retries = 0;
            let ttSuccess = false;
            while (retries < 3 && !ttSuccess) {
                try {
                    console.log(`Publishing to TikTok (Attempt ${retries+1})...`);
                    const tt = new TikTokPublisher();
                    await tt.publish(videoPath, post.text);
                    ttSuccess = true;
                } catch (err) {
                    retries++;
                    console.error(`TikTok attempt ${retries} failed:`, err.message);
                    if (retries === 3) success = false;
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        }
        
        // Clean up generated video if published successfully and generated on the fly
        if (success && generatedOnTheFly) {
            try {
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                    console.log(`Cleaned up temporary video file: ${videoPath}`);
                }
            } catch (cleanupErr) {
                console.error("Failed to clean up temporary video file:", cleanupErr.message);
            }
        }
        
        if (success) {
            console.log(`Successfully completed Meta post ${i+1}`);
            progress = i + 1;
            fs.writeFileSync(progressPath, JSON.stringify(progress));
        } else {
            console.error(`Post ${i+1} failed all retries. Pausing campaign.`);
            break;
        }
    }
}

if (require.main === module) {
    processCampaign();
}

module.exports = { processCampaign };
