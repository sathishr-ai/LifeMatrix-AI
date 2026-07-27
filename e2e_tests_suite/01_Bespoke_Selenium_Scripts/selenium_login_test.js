import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runLoginTest() {
    console.log("🚀 Starting Genuine E2E Selenium Test for Login Flow...");

    // Configure Chrome Options
    let options = new chrome.Options();
    // Using standard window size, you can add .addArguments('--headless') if you want invisible background testing
    options.addArguments('--window-size=1280,800');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Navigate to the local development server (assuming default Vite UI port)
        const appUrl = 'http://localhost:5173/login';
        console.log(`🌐 Navigating to ${appUrl}...`);
        await driver.get(appUrl);

        console.log("🔍 Locating the secure Login screen inputs...");

        // Explicitly wait for the Email/Mobile Input field using its specific placeholder text
        const emailInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='test@example.com or 1234567890']")),
            10000
        );

        // Explicitly wait for the Password field
        const passInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='Enter your password']")),
            10000
        );

        console.log("✍️ Entering test credentials [test@example.com]...");
        await emailInput.sendKeys('test@example.com');
        await passInput.sendKeys('password123');

        console.log("🖱️ Clicking 'Sign In' button...");
        // Find the button that contains the "Sign In" text and click it
        const submitBtn = await driver.findElement(By.xpath("//button[contains(., 'Sign In')]"));
        await submitBtn.click();

        console.log("⏳ Waiting for backend authentication and routing...");

        // On success, your app navigates to the "/app" route
        await driver.wait(until.urlContains('/app'), 8000);

        const finalUrl = await driver.getCurrentUrl();
        console.log(`✅ Success! Safely routed inside application dashboard: ${finalUrl}`);
        console.log("🎉 TRUE SELENIUM E2E LOGIN TEST COMPLETED AND PASSED!");

    } catch (err) {
        console.error("❌ Test Failed:", err);
    } finally {
        // Keep the browser open for just a few seconds so you can see the result, then close it cleanly
        setTimeout(async () => {
            console.log("🛑 Terminating and cleaning up Webdriver...");
            await driver.quit();
        }, 3000);
    }
}

runLoginTest();
