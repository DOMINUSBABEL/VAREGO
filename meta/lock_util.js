const fs = require('fs');
const path = require('path');

function acquireProfileLock(profileName) {
    const lockPath = path.join(__dirname, `lock_${profileName}.lock`);
    if (fs.existsSync(lockPath)) {
        throw new Error(`Browser profile ${profileName} is locked by another running process`);
    }
    fs.writeFileSync(lockPath, 'LOCKED');
    console.log(`Acquired lock for browser profile: ${profileName}`);
}

function releaseProfileLock(profileName) {
    const lockPath = path.join(__dirname, `lock_${profileName}.lock`);
    if (fs.existsSync(lockPath)) {
        fs.unlinkSync(lockPath);
        console.log(`Released lock for browser profile: ${profileName}`);
    }
}

module.exports = { acquireProfileLock, releaseProfileLock };
