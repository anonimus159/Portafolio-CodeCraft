const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.type('input[type="email"]', 'admin@restaurante.com');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'debug_screenshot.png' });
  await browser.close();
})();
