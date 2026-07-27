import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runProfileSetupTest() {
    console.log("🚀 Starting Genuine E2E Selenium Test for Profile Setup Wizard...");

    let options = new chrome.Options();
    options.addArguments('--window-size=1280,800');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        const appUrl = 'http://localhost:5173/profile-setup';

        // Boot into the site briefly to set local storage payload bypassing ProtectedRoute
        await driver.get('http://localhost:5173/login');
        await driver.executeScript("localStorage.setItem('currentUser', JSON.stringify({id: 'test_session'}));");

        console.log(`🌐 Navigating directly to ${appUrl}...`);
        await driver.get(appUrl);

        console.log("🔍 Locating Step 1 (Basic Information) inputs...");

        // --- STEP 1: Basic Information ---
        const ageInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='25']")),
            10000
        );
        const genderButton = await driver.findElement(By.xpath("//button[contains(text(), 'Male')]"));

        console.log("✍️ Entering Age and Gender...");
        await ageInput.sendKeys('29');
        await genderButton.click();

        console.log("🖱️ Clicking 'Continue' (Step 1 -> 2)...");
        let continueBtn = await driver.findElement(By.xpath("//button[contains(., 'Continue')]"));
        await continueBtn.click();

        // --- STEP 2: Physical Metrics ---
        console.log("🔍 Locating Step 2 (Physical Metrics) inputs...");
        const heightInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='170']")),
            5000
        );
        const weightInput = await driver.findElement(By.xpath("//input[@placeholder='70']"));

        console.log("✍️ Entering Height and Weight...");
        await heightInput.sendKeys('182');
        await weightInput.sendKeys('76');

        console.log("🖱️ Clicking 'Continue' (Step 2 -> 3)...");
        continueBtn = await driver.findElement(By.xpath("//button[contains(., 'Continue')]"));
        await continueBtn.click();

        // --- STEP 3: Medical Details ---
        console.log("🔍 Locating Step 3 (Medical Details) inputs...");
        const bloodTypeButton = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(), 'O+')]")),
            5000
        );

        console.log("✍️ Selecting Blood Type...");
        await bloodTypeButton.click();

        console.log("🖱️ Clicking 'Complete Setup'...");
        const completeBtn = await driver.findElement(By.xpath("//button[contains(., 'Complete Setup')]"));
        await completeBtn.click();

        console.log("⏳ Waiting for setup finalization and routing...");

        // On success, app navigates to "/app" dashboard
        await driver.wait(until.urlContains('/app'), 8000);

        const finalUrl = await driver.getCurrentUrl();
        console.log(`✅ Success! Safely routed inside application dashboard to: ${finalUrl}`);
        console.log("🎉 TRUE SELENIUM E2E PROFILE SETUP TEST COMPLETED AND PASSED!");

    } catch (err) {
        console.error("❌ Test Failed:", err);
    } finally {
        setTimeout(async () => {
            console.log("🛑 Terminating and cleaning up Webdriver...");
            await driver.quit();
        }, 3000);
    }
}

runProfileSetupTest();
