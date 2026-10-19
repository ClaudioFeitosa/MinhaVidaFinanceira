import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'https://minha-vida-financeira-a16d2.web.app/';
const OUT = 'C:/QAx/minhasFinancas/Coda/.coda/discovery';

fs.mkdirSync(`${OUT}/screenshots`, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  locale: 'pt-BR',
});
const page = await context.newPage();

// Capture console errors and network failures
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
});
page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message.slice(0, 300)}`));

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
// SPA: wait for app to render (root has children)
await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });
await page.waitForTimeout(3000); // let ads/animations settle

const title = await page.title();
const finalUrl = page.url();

// Accessibility tree
const aria = await page.locator('body').ariaSnapshot();

// Collect all interactive elements with stable selectors
const interactive = await page.evaluate(() => {
  const els = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="tab"], [role="link"], [role="menuitem"], [role="dialog"], [role="switch"], [role="checkbox"], [role="radio"]');
  const out = [];
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    const text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 120);
    out.push({
      idx: i,
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') || null,
      id: el.id || null,
      testid: el.getAttribute('data-testid') || null,
      name: el.getAttribute('name') || null,
      ariaLabel: el.getAttribute('aria-label') || null,
      type: el.getAttribute('type') || null,
      href: el.getAttribute('href') || null,
      text,
      visible,
      inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= innerHeight + 5 && rect.right <= innerWidth + 5,
    });
  });
  return out;
});

// Page structure: headings + main sections
const structure = await page.evaluate(() => {
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => `${h.tagName}: ${h.innerText.trim().slice(0,100)}`);
  const navs = [...document.querySelectorAll('nav, header, footer')].map(n => `${n.tagName.toLowerCase()}: ${n.innerText.trim().replace(/\s+/g,' ').slice(0,200)}`);
  const dialogs = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, [class*="modal"]')].map(d => d.innerText.trim().replace(/\s+/g,' ').slice(0,200));
  return { heads, navs, dialogs };
});

fs.writeFileSync(`${OUT}/01-initial-aria.txt`, aria);
fs.writeFileSync(`${OUT}/01-initial-interactive.json`, JSON.stringify(interactive, null, 2));
fs.writeFileSync(`${OUT}/01-initial-structure.json`, JSON.stringify({ title, finalUrl, structure, consoleErrors }, null, 2));
await page.screenshot({ path: `${OUT}/screenshots/01-initial.png`, fullPage: true });

console.log('TITLE:', title);
console.log('URL:', finalUrl);
console.log('INTERACTIVE COUNT:', interactive.length);
console.log('CONSOLE ERRORS:', consoleErrors.length);
console.log('--- HEADINGS ---');
structure.heads.forEach(h => console.log(' ', h));
console.log('--- NAVS ---');
structure.navs.forEach(n => console.log(' ', n));
console.log('--- DIALOGS ---');
structure.dialogs.forEach(d => console.log(' ', d));
console.log('--- INTERACTIVE (visible) ---');
interactive.filter(e => e.visible).forEach(e => {
  console.log(` [${e.idx}] <${e.tag}${e.role?` role=${e.role}`:''}${e.id?` id=${e.id}`:''}${e.testid?` testid=${e.testid}`:''}${e.href?` href=${e.href}`:''}> "${e.text}"`);
});

await browser.close();
