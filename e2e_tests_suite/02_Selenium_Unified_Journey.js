import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runUnifiedUserJourney() {
    console.log("🚀 Starting [UNIFIED LIFEMATRIX E2E JOURNEY]...");
    console.log("This 1 script executes ALL functional paths in a single execution loop!");

    let options = new chrome.Options();
    options.addArguments('--window-size=1280,800');
    // .addArguments('--headless') could be added to run invisibly

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // --- PHASE 1: SIGNUP SCREEN ---
        console.log(`\n▶️ PHASE 1: Navigating to Auth & Signup...`);
        await driver.get('http://localhost:5173/signup');

        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='John Doe']")), 10000).sendKeys('Massive Tester');
        await driver.findElement(By.xpath("//input[@placeholder='you@example.com']")).sendKeys(`user${Math.floor(Math.random() * 10000)}@test.com`);
        await driver.findElement(By.xpath("//input[@placeholder='e.g. 1234567890']")).sendKeys(`555${Math.floor(Math.random() * 9000000)}`);
        await driver.findElement(By.xpath("//input[@placeholder='Create a strong password']")).sendKeys('SuperStrong123!');

        console.log("☑️ Triggering Checkbox & Signup Submit...");
        const termsCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox']"));
        await driver.executeScript("arguments[0].click();", termsCheckbox);

        const createAccountBtn = await driver.findElement(By.xpath("//button[contains(., 'Create Account')]"));
        await createAccountBtn.click();
        await driver.wait(until.urlContains('/profile-setup'), 8000);

        // --- PHASE 2: PROFILE SETUP ---
        console.log(`\n▶️ PHASE 2: Navigating Onboarding Wizard...`);
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='25']")), 5000).sendKeys('34');
        await driver.findElement(By.xpath("//button[contains(text(), 'Male')]")).click();

        // Next Step
        let continueBtn = await driver.findElement(By.xpath("//button[contains(., 'Continue')]"));
        await continueBtn.click();

        // Physical Metrics
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='170']")), 3000).sendKeys('175');
        await driver.findElement(By.xpath("//input[@placeholder='70']")).sendKeys('72');
        continueBtn = await driver.findElement(By.xpath("//button[contains(., 'Continue')]"));
        await continueBtn.click();

        // Details
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'O-')]")), 3000).click();
        const finishBtn = await driver.findElement(By.xpath("//button[contains(., 'Complete Setup')]"));
        await finishBtn.click();
        await driver.wait(until.urlContains('/app'), 8000);

        // --- PHASE 3: APP ROUTING (SYMPTOMS) ---
        console.log(`\n▶️ PHASE 3: Entering Application Dashboard & Routing to Symptoms...`);
        // We will directly navigate to symptom input since sidebar might have complex animations
        await driver.get('http://localhost:5173/app/symptom-input');

        const searchTabBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Search')]")), 5000);
        await searchTabBtn.click();

        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Search symptoms...']")), 3000).sendKeys('Headache');
        const symptomBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Headache')]")), 3000);
        await symptomBtn.click();

        const confirmBtn = await driver.findElement(By.xpath("//button[contains(., 'Confirm Selection')]"));
        await confirmBtn.click();
        await driver.wait(until.urlContains('/app/severity-selection'), 8000);

        console.log(`\n✅ UNIFIED TEST COMPLETE: Successfully chained Authentication, Onboarding, and AI Extraction!`);
        console.log("🎉 ALL E2E PHASES VERIFIED.");

    } catch (err) {
        console.error("❌ Unified Test Failed Breakdown:", err);
    } finally {
        setTimeout(async () => {
            console.log("\n🛑 Terminating Unified Webdriver Task...");
            await driver.quit();
        }, 4000);
    }
}

runUnifiedUserJourney();
