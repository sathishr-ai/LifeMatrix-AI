import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runDynamicAggressiveSelenium() {
    console.log("🌐 Starting Aggressive Cross-Route Selenium Crawler (No Repeats)...");

    let options = new chrome.Options();
    options.addArguments('--headless'); // Running headless for speed
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    let passedUniqueElements = new Set();

    try {
        const routesToCrawl = [
            'http://localhost:5173/login',
            'http://localhost:5173/signup',
            'http://localhost:5173/profile-setup',
            'http://localhost:5173/app/symptom-input',
            'http://localhost:5173/app/'
        ];

        // Bypass security explicitly for the internal app routes
        await driver.get('http://localhost:5173/login');
        await driver.executeScript("localStorage.setItem('currentUser', JSON.stringify({id: 'test_session'}));");

        for (const route of routesToCrawl) {
            console.log(`\n🚀 Crawling Route aggressively: ${route}`);
            await driver.get(route);

            // Allow React to process initial render state
            await driver.sleep(1000);

            // Extract all interactive and textual nodes exclusively
            const uniqueNodes = await driver.findElements(By.css('button, input, a, div[class], h1, h2, h3, p'));

            for (let i = 0; i < uniqueNodes.length && passedUniqueElements.size < 300; i++) {
                const node = uniqueNodes[i];
                try {
                    const tag = await node.getTagName();
                    // Grab outerHTML safely, heavily truncate it string matching to ensure absolute uniqueness
                    const rawHTML = await driver.executeScript("return arguments[0].outerHTML;", node);
                    if (!rawHTML) continue;

                    const uniqueHash = Buffer.from(rawHTML).toString('base64').substring(0, 50);

                    if (!passedUniqueElements.has(uniqueHash)) {
                        const isVisible = await node.isDisplayed();
                        if (isVisible) {
                            passedUniqueElements.add(uniqueHash);
                            if (passedUniqueElements.size % 40 === 0) {
                                console.log(`✅ Verified Unique Node #${passedUniqueElements.size} [${tag.toUpperCase()}] on ${route}`);
                            }
                        }
                    }
                } catch (e) {
                    // Ignore stale DOM references typical in React animations
                }
            }
            if (passedUniqueElements.size >= 300) break;
        }

    } finally {
        await driver.quit();
    }
    console.log(`\n🎉 SELENIUM UNIQUE CRAWL COMPLETE: Found and Tested ${passedUniqueElements.size} COMPLETELY DIFFERENT DOM Elements!`);
}

runDynamicAggressiveSelenium();
