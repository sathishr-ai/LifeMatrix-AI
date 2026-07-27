import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runSignupTest() {
    console.log("🚀 Starting Genuine E2E Selenium Test for Signup Flow...");

    // Configure Chrome Options
    let options = new chrome.Options();
    options.addArguments('--window-size=1280,800');
    // options.addArguments('--headless'); // you can turn this on for hidden speed

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        const appUrl = 'http://localhost:5173/signup';
        console.log(`🌐 Navigating directly to ${appUrl}...`);
        await driver.get(appUrl);

        console.log("🔍 Locating the secure Signup screen inputs...");

        // Wait for Name field
        const nameInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='John Doe']")),
            10000
        );
        const emailInput = await driver.findElement(By.xpath("//input[@placeholder='you@example.com']"));
        const mobileInput = await driver.findElement(By.xpath("//input[@placeholder='e.g. 1234567890']"));
        const passInput = await driver.findElement(By.xpath("//input[@placeholder='Create a strong password']"));
        const termsCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox']"));

        // Generate a random user to prevent "Account already exists" error
        const randomNum = Math.floor(Math.random() * 10000);
        const testEmail = `newuser${randomNum}@example.com`;
        const testMobile = `55500${randomNum.toString().padStart(4, '0')}`;

        console.log(`✍️ Entering test credentials for [${testEmail}]...`);
        await nameInput.sendKeys('Jane Doe');
        await emailInput.sendKeys(testEmail);
        await mobileInput.sendKeys(testMobile);
        await passInput.sendKeys('StrongPass123!');

        console.log("☑️ Clicking Terms of Service Checkbox...");
        // Selenium click needs to happen on the checkbox itself or label wrapper
        await driver.executeScript("arguments[0].click();", termsCheckbox);

        console.log("🖱️ Clicking 'Create Account' button...");
        const submitBtn = await driver.findElement(By.xpath("//button[contains(., 'Create Account')]"));
        await submitBtn.click();

        console.log("⏳ Waiting for backend validation and routing...");

        // On success, app navigates to "/profile-setup"
        await driver.wait(until.urlContains('/profile-setup'), 8000);

        const finalUrl = await driver.getCurrentUrl();
        console.log(`✅ Success! Safely routed inside application to: ${finalUrl}`);
        console.log("🎉 TRUE SELENIUM E2E SIGNUP TEST COMPLETED AND PASSED!");

    } catch (err) {
        console.error("❌ Test Failed:", err);
    } finally {
        setTimeout(async () => {
            console.log("🛑 Terminating and cleaning up Webdriver...");
            await driver.quit();
        }, 3000);
    }
}

runSignupTest();
