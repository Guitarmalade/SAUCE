import { chromium, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Load schedule from JSON
const schedulePath = path.join(__dirname, 'schedule.json');

interface Post {
    id: string;
    imageFile: string;
    copy: string;
    platforms: string[]; // 'meta', 'x'
    scheduledTime: string; // ISO string
}

async function run() {
    if (!fs.existsSync(schedulePath)) {
        console.error('schedule.json not found! Please generate it first.');
        process.exit(1);
    }

    const schedule: Post[] = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
    
    console.log(`Loaded ${schedule.length} posts to schedule.`);

    // Setup persistent context so you don't have to login every time
    const userDataDir = path.join(__dirname, '.browser-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Keep it visible so you can watch it work
        channel: "chrome",
        viewport: { width: 1280, height: 720 },
    });

    try {
        for (const post of schedule) {
            console.log(`\nProcessing post: ${post.id}`);
            
            if (post.platforms.includes('meta')) {
                await scheduleOnMetaBusinessSuite(context, post);
            }
            
            console.log(`✅ Finished scheduling post: ${post.id}`);
        }
    } catch (e) {
        console.error('Error during scheduling:', e);
    } finally {
        console.log('Closing browser...');
        await context.close();
    }
}

async function scheduleOnMetaBusinessSuite(context: BrowserContext, post: Post) {
    console.log(`[Meta] Preparing to schedule for ${post.scheduledTime}...`);
    const page = await context.newPage();
    
    // Go directly to the composer to save clicks
    await page.goto('https://business.facebook.com/latest/composer');
    
    console.log("[Meta] Waiting for the composer to load...");
    // The textbox usually loads pretty quickly
    const textBox = page.getByRole('textbox').first();
    await textBox.waitFor({ state: 'visible', timeout: 30000 }).catch(() => console.log("Textbox taking a while..."));
    
    // Upload image
    console.log("[Meta] Uploading image...");
    const imagePath = path.join(__dirname, 'content', post.imageFile);
    // FB usually uses a hidden input[type="file"]
    const fileInput = page.locator('input[type="file"][accept*="image"]');
    if (await fileInput.count() > 0) {
        await fileInput.first().setInputFiles(imagePath).catch(() => console.log("Failed to inject image into input."));
    } else {
        console.log("Could not find file input. You might need to manually click 'Add Photo'.");
    }

    // Fill copy
    console.log("[Meta] Typing copy...");
    await textBox.fill(post.copy.meta).catch(() => console.log("Failed to fill copy."));

    console.log(`WAITING: Please confirm the image/text, manually select May 14th and the correct time, and click 'Schedule'.`);
    console.log("I will pause here for 2 minutes so you can finish this post before I open the next one...");
    await page.waitForTimeout(120000); // 2 minutes to click schedule
    
    await page.close();
}



run();
