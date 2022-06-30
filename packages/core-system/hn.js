const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  })
  await page.goto('https://github.com/puppeteer/puppeteer', {
    waitUntil: 'networkidle2',
  });
  // await page.pdf({ path: 'hn.pdf', format: 'a4' });
  // await page.screenshot({ path: 'hn.jpeg', fullPage: true, typ: "jpeg", quality: 100 });

  // await browser.close();
})();