import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://www.misthustlers.in/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(4000);
const labelHrefs = [
  ['Home','/'],['Services','/services'],['Projects','/projects'],['Career','/career'],['About','/about'],['FAQ','/faq'],['Contact','/contact'],
];
const out = [];
for (const [label, href] of labelHrefs) {
  const before = page.url();
  const link = page.locator('nav').first().locator('a[href="' + href + '"]').first();
  const exists = await link.count();
  if (!exists) { out.push('MISSING\t' + label + ' (' + href + ')'); continue; }
  const clicked = await link.click({ timeout: 5000 }).then(() => true).catch((e) => { out.push('CLICKERR\t' + label + ': ' + e.message.split('\n')[0].slice(0,80)); return false; });
  if (!clicked) continue;
  await page.waitForTimeout(3500);
  const url = page.url();
  const len = (await page.locator('body').innerText()).length;
  const navStuck = (await page.locator('#root').innerText()).includes('Loading MistHustlers');
  out.push((len < 50 || navStuck ? 'FAIL   ' : 'OK     ') + label + ' -> ' + url + ' (' + len + 'b' + (navStuck ? ' STUCK-ON-LOADING' : '') + ')');
}
console.log(out.join('\n'));
await browser.close();
