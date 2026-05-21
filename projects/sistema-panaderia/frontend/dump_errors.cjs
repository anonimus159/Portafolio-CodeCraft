const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));
    await page.type('input[type="email"]', 'admin@restaurante.com');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));
  } catch (e) {
    console.error(e);
  }
  await browser.close();
})();
