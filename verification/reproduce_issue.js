const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  const filePath = 'file://' + path.join(process.cwd(), 'index.htm');
  await page.goto(filePath);

  // Clear existing data or just use the first tab
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();

  // Set text with multiple line breaks
  const text = "Here is the conjugation of the verb to be in the present tense:\n\nAffirmative\nI am\nYou are\nHe is\nShe is\nIt is\nWe are\nYou are\nThey are";

  await page.fill('#text-input', text);

  // Click "ESTUDAR"
  await page.click('#btn-edit-text');

  // Take a screenshot
  await page.screenshot({ path: 'screenshots/reproduction.png' });

  // Check if spans contain newlines
  const spansInfo = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('#text-display span'));
    return spans.map(s => ({
      text: s.textContent,
      display: window.getComputedStyle(s).display,
      width: s.getBoundingClientRect().width,
      height: s.getBoundingClientRect().height
    }));
  });
  console.log('Spans info:', JSON.stringify(spansInfo, null, 2));

  await browser.close();
})();
