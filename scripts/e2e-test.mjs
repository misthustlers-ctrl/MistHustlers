import { chromium } from 'playwright';
import http from 'http';

async function waitForUrl(url, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((res, rej) => {
        const req = http.request(url, { method: 'HEAD', timeout: 2000 }, (res2) => {
          res();
        });
        req.on('error', rej);
        req.end();
      });
      return;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

(async () => {
  const ports = [5173, 5174];
  let base = null;
  console.log('Waiting for dev server on ports', ports.join(', '));
  for (const p of ports) {
    try {
      await waitForUrl(`http://localhost:${p}`);
      base = `http://localhost:${p}`;
      break;
    } catch (e) {
      // try next
    }
  }
  if (!base) {
    console.error('Dev server not available on ports', ports.join(', '));
    process.exit(2);
  }
  console.log('Dev server ready. Launching browser...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Intercept API saves and return success
  await context.route('**/api/inquiry', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));

  const page = await context.newPage();

  // Test Services form
  console.log('Testing Services inquiry flow...');
  await page.goto(base + '/services');
  await page.waitForSelector('form');

  await page.fill('input[name="name"]', 'Test Service User');
  await page.fill('input[name="email"]', 'service@test.local');
  await page.fill('input[name="phone"]', '8889937648');
  await page.fill('input[name="organization"]', 'TestCo');
  // budget select
  await page.selectOption('select[name="budget"]', '5000-15000').catch(()=>{});
  await page.fill('input[name="website"]', 'https://example.com');
  await page.fill('input[name="timeline"]', '4 weeks');
  await page.fill('input[name="preferredContact"]', 'WhatsApp');
  await page.fill('textarea[name="project-details"]', 'This is a test project description.');

  // Wait for new page from window.open
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('button[type="submit"]'),
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  const waUrl = newPage.url();
  console.log('Captured WA URL (services):', waUrl);
  assert(waUrl.startsWith('https://wa.me/') || waUrl.startsWith('https://api.whatsapp.com/'), 'Expected wa.me or api.whatsapp.com URL for services');
  assert(waUrl.includes('NEW+SERVICE+INQUIRY') || waUrl.includes(encodeURIComponent('NEW SERVICE INQUIRY')) || decodeURIComponent(waUrl).includes('NEW SERVICE INQUIRY'), 'Message should contain service header');
  assert(waUrl.includes(encodeURIComponent('Test Service User')) || waUrl.includes('Test+Service+User') || decodeURIComponent(waUrl).includes('Test Service User'), 'Name should be in message');
  await newPage.close();

  await browser.close();
  console.log('E2E checks passed');
  process.exit(0);
})().catch((err) => {
  console.error('E2E failed:', err);
  process.exit(3);
});
