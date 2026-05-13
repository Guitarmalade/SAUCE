import { chromium } from 'playwright';
import * as path from 'path';

async function run() {
    const userDataDir = path.join(__dirname, '.browser-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // run visibly to avoid macOS keychain errors
        channel: "chrome",
        viewport: { width: 1280, height: 720 },
    });

    console.log("Navigating to Meta Business Suite Composer...");
    const page = await context.newPage();
    await page.goto('https://business.facebook.com/latest/composer');
    
    console.log("Waiting for page to load...");
    await page.waitForTimeout(10000); // give it 10 seconds to fully load all the React components
    
    const screenshotPath = path.join(__dirname, 'meta_debug.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("Saved screenshot to", screenshotPath);
    
    await context.close();
}

run();
