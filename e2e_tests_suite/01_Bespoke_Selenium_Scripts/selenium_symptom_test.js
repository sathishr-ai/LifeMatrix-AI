import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runSymptomInputTest() {
    console.log("🚀 Starting Genuine E2E Selenium Test for Symptom AI Input...");

    let options = new chrome.Options();
    options.addArguments('--window-size=1280,800');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // --- BYPASS AUTH ---
        console.log("🔓 Bypassing Route Auth...");
        await driver.get('http://localhost:5173/login');
        await driver.executeScript("localStorage.setItem('currentUser', JSON.stringify({id: 'test_session'}));");

        // --- GO TO SYMPTOM INPUT ---
        const appUrl = 'http://localhost:5173/app/symptom-input';
        console.log(`🌐 Navigating directly to ${appUrl}...`);
        await driver.get(appUrl);

        console.log("🔍 Locating Search UI Tab...");
        // Wait for the "Search" tab button
        const searchTabBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Search')]")),
            10000
        );
        await searchTabBtn.click();

        console.log("✍️ Entering 'Fever' into Search...");
        const searchInput = await driver.wait(
            until.elementLocated(By.xpath("//input[@placeholder='Search symptoms...']")),
            5000
        );
        await searchInput.sendKeys('Fever');

        console.log("☑️ Selecting 'Fever' from dynamic render list...");
        // Click the symptom button loaded dynamically
        const feverBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(), 'Fever')]")),
            5000
        );
        await feverBtn.click();

        console.log("🖱️ Confirming Selection & Injecting payload to Memory Storage...");
        // Button becomes "Confirm Selection (1)"
        const confirmBtn = await driver.findElement(By.xpath("//button[contains(., 'Confirm Selection')]"));
        await confirmBtn.click();

        console.log("⏳ Waiting for Diagnostic Severity Engine validation and routing...");

        // On success, app navigates to "/app/severity-selection"
        await driver.wait(until.urlContains('/app/severity-selection'), 8000);

        const finalUrl = await driver.getCurrentUrl();
        console.log(`✅ Success! Data payload routed successfully to: ${finalUrl}`);
        console.log("🎉 TRUE SELENIUM E2E SYMPTOM ANALYZER TEST COMPLETED AND PASSED!");

    } catch (err) {
        console.error("❌ Test Failed:", err);
    } finally {
        setTimeout(async () => {
            console.log("🛑 Terminating and cleaning up Webdriver...");
            await driver.quit();
        }, 3000);
    }
}

runSymptomInputTest();
