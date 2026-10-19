import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'https://minha-vida-financeira-a16d2.web.app/';
const OUT = 'C:/QAx/minhasFinancas/Coda/.coda/discovery';
fs.mkdirSync(`${OUT}/screenshots`, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: 'pt-BR' });
const page = await context.newPage();
const log = [];
const step = (l) => log.push(`\n--- ${l} ---`);

async function grab(name) {
  await page.waitForTimeout(700);
  const aria = await page.locator('body').ariaSnapshot().catch(() => '(fail)');
  fs.writeFileSync(`${OUT}/${name}-aria.txt`, aria);
  await page.screenshot({ path: `${OUT}/screenshots/${name}.png` });
  // capture any error/success paragraphs
  const msgs = await page.evaluate(() => {
    return [...document.querySelectorAll('p, [role="alert"], [class*="error"], [class*="alert"]')]
      .map(e => (e.textContent || '').trim())
      .filter(t => t && t.length < 160 && /erro|inválido|obrigat|informe|preencha|mínimo|pelo menos|caracter|não|já existe|sucesso|enviado|recupera/i.test(t));
  });
  log.push(`  MSGS: ${JSON.stringify([...new Set(msgs)].slice(0, 10))}`);
  return aria;
}

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });
await page.waitForTimeout(2500);

// Open signup via banner "Teste agora"
step('OPEN SIGNUP via banner "Teste agora"');
await page.getByRole('button', { name: 'Teste agora' }).click({ timeout: 5000 });
await page.waitForTimeout(1000);

// 1) Empty submit
step('SIGNUP empty submit');
try {
  await page.getByRole('button', { name: 'Criar minha conta' }).click({ timeout: 5000 });
  await grab('12-signup-empty');
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// 2) Invalid: bad email, short password, mismatched confirm
step('SIGNUP invalid (bad email, short pw, mismatch)');
try {
  const inputs = page.locator('input');
  const n = await inputs.count();
  for (let i = 0; i < n; i++) {
    const inp = inputs.nth(i);
    const type = await inp.getAttribute('type');
    const ph = (await inp.getAttribute('placeholder')) || '';
    if (type === 'email' || /exemplo/i.test(ph)) await inp.fill('x');
    else if (type === 'password' && /repita/i.test(ph)) await inp.fill('456');
    else if (type === 'password') await inp.fill('123');
    else if (/joao.silva/i.test(ph)) await inp.fill('a');
    else if (/000.000/i.test(ph)) await inp.fill('123');
    else if (/João/i.test(ph)) await inp.fill('A');
  }
  await page.getByRole('button', { name: 'Criar minha conta' }).click({ timeout: 5000 });
  await page.waitForTimeout(1200);
  await grab('13-signup-invalid');
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// 3) CPF validation: invalid cpf
step('SIGNUP invalid CPF (123)');
try {
  const cpf = page.locator('input[placeholder*="000.000"]').first();
  if (await cpf.count()) { await cpf.fill('123'); await page.waitForTimeout(400); }
  const cpfMsg = await page.evaluate(() => {
    const t = document.body.innerText;
    const m = t.match(/CPF[^\n]{0,60}/i);
    return m ? m[0] : null;
  });
  log.push(`  CPF field state: ${JSON.stringify(cpfMsg)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// 4) Password strength indicator?
step('SIGNUP password strength check');
try {
  const pw = page.locator('input[type="password"]').first();
  await pw.fill('a');
  await page.waitForTimeout(400);
  const s1 = await page.evaluate(() => document.body.innerText.match(/(fraca|fraco|frágil|média|forte|forte|senha)[^\n]{0,40}/i)?.[0] || null);
  await pw.fill('SenhaForte123!');
  await page.waitForTimeout(400);
  const s2 = await page.evaluate(() => document.body.innerText.match(/(fraca|fraco|frágil|média|forte|senha)[^\n]{0,40}/i)?.[0] || null);
  log.push(`  strength short: ${JSON.stringify(s1)} | strong: ${JSON.stringify(s2)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// 5) Toggle password visibility
step('SIGNUP password visibility toggle');
try {
  const pw = page.locator('input[type="password"]').first();
  const before = await pw.getAttribute('type');
  const toggle = page.locator('button:has(img)').filter({ has: page.locator('img') });
  // find the eye button near password: click the button that is sibling
  const eyeBtn = page.locator('input[type="password"]').first().locator('xpath=following-sibling::button[1] | ../button[1]');
  if (await eyeBtn.count()) {
    await eyeBtn.first().click({ timeout: 3000 });
    await page.waitForTimeout(300);
    const after = await page.locator('input').nth(4).getAttribute('type').catch(() => null);
    log.push(`  pw type before=${before} after=${after}`);
  } else {
    log.push('  eye toggle not found via sibling; trying aria-label');
    const eye = page.getByRole('button', { name: /mostrar|ocultar|senha|show|hide/i }).first();
    if (await eye.count()) { await eye.click({ timeout: 3000 }); log.push('  clicked eye by aria'); }
    else log.push('  no eye toggle found');
  }
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

fs.writeFileSync(`${OUT}/signup-log.txt`, log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
