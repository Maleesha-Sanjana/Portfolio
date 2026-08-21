const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Mobile resolution
  await page.setViewport({ width: 320, height: 650 });
  
  console.log("Navigating to Flutter app...");
  await page.goto('http://localhost:5173/apps/sales-utility/index.html', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for Flutter to boot up (10s)...");
  await new Promise(r => setTimeout(r, 10000));
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'public/sales_preview.png' });
  
  console.log("Done!");
  await browser.close();
})();
