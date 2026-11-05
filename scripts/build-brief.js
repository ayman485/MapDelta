// Render brief/MapDelta_Service_Brief.html to a one-page vector PDF.
// Usage: node scripts/build-brief.js   (needs the preinstalled Playwright Chromium)
const path = require('path');
const { chromium } = require('playwright');

const src = path.resolve(__dirname, '../brief/MapDelta_Service_Brief.html');
const out = path.resolve(__dirname, '../brief/MapDelta_Service_Brief.pdf');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  await page.goto('file://' + src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Fail loudly rather than ship a clipped or overflowing page.
  const report = await page.evaluate(() => {
    const pageEl = document.querySelector('.page');
    const body = document.querySelector('.body');
    const content = [...body.children].reduce((h, el) => Math.max(h, el.getBoundingClientRect().bottom), 0);
    const overflowX = [...document.querySelectorAll('.page *')].filter((el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'visible' && el.clientWidth > 0).map((el) => el.className || el.tagName).slice(0, 5);
    const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`);
    return {
      pageHeight: pageEl.getBoundingClientRect().height,
      docHeight: document.documentElement.scrollHeight,
      bodySpare: Math.round(body.getBoundingClientRect().bottom - content),
      overflowX, fonts,
    };
  });
  console.log(JSON.stringify(report));
  if (report.docHeight > 1056 || report.bodySpare < 0) throw new Error('Content does not fit on one page');

  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
  await browser.close();
  console.log('wrote', path.relative(process.cwd(), out));
})();
