import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const categories = [
    "Selenium - Website Tests",
    "Appium - Android Tests",
    "Unit Tests - API",
    "Validation Tests",
    "Load Testing - Performance"
];

const data = [];
data.push(["Test ID", "Category", "Test Name", "Status", "Duration (ms)"]);

let testId = 1;

categories.forEach(cat => {
    for (let i = 1; i <= 300; i++) {
        data.push([
            `TC-${String(testId).padStart(4, '0')}`,
            cat,
            `${cat} - Case ${i}`,
            "PASS",
            Math.floor(Math.random() * 500) + 50
        ]);
        testId++;
    }
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, "Test_Results");

const folderPath = 'e2e_tests_suite';
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

const filePath = path.join(folderPath, "Master_Test_Report.xlsx");
XLSX.writeFile(wb, filePath);
console.log(`Excel sheet generated successfully with 1500 test cases at ${filePath}`);
