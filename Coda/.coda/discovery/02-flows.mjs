import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'https://minha-vida-financeira-a16d2.web.app/';
const OUT = 'C:/QAx/minhasFinancas/Coda/.coda/discovery';
fs.mkdirSync(`${OUT}/screenshots`, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: 'pt-BR' });
const page = await context.newPage();
const log = [];
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message.slice(0, 200)}`));

async function capture(name) {
  await page.waitForTimeout(800);
  const aria = await page.locator('body').ariaSnapshot().catch(() => '(snapshot failed)');
  const interactive = await page.evaluate(() => {
    const els = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="tab"], [role="dialog"], [role="alertdialog"], [role="switch"], [role="checkbox"], [role="radio"], [role="option"]');
    const out = [];
    els.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      const text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 150);
      out.push({
        idx: i, tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || null,
        id: el.id || null, testid: el.getAttribute('data-testid') || null,
        name: el.getAttribute('name') || null, ariaLabel: el.getAttribute('aria-label') || null,
        type: el.getAttribute('type') || null, href: el.getAttribute('href') || null,
        placeholder: el.getAttribute('placeholder') || null,
        required: el.hasAttribute('required') || null,
        text, visible,
      });
    });
    return out;
  });
  fs.writeFileSync(`${OUT}/${name}-aria.txt`, aria);
  fs.writeFileSync(`${OUT}/${name}-interactive.json`, JSON.stringify(interactive, null, 2));
  await page.screenshot({ path: `${OUT}/screenshots/${name}.png`, fullPage: false });
  log.push(`=== ${name} ===`);
  log.push(`URL: ${page.url()}`);
  log.push(`Visible interactive: ${interactive.filter(e => e.visible).length}`);
  interactive.filter(e => e.visible).forEach(e => {
    log.push(`  [${e.idx}] <${e.tag}${e.role ? ` role=${e.role}` : ''}${e.id ? ` id=${e.id}` : ''}${e.testid ? ` testid=${e.testid}` : ''}${e.type ? ` type=${e.type}` : ''}${e.href ? ` href=${e.href}` : ''}${e.placeholder ? ` ph="${e.placeholder}"` : ''}${e.required ? ' required' : ''}> "${e.text}"`);
  });
  return interactive;
}

const step = (label) => log.push(`\n--- STEP: ${label} ---`);

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });
await page.waitForTimeout(2500);

// ── FLOW 1: Banner beta ─────────────────────────────────────────────
step('BANNER: click "Teste agora"');
try {
  await page.getByRole('button', { name: 'Teste agora' }).click({ timeout: 5000 });
  await capture('02-banner-teste-agora');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

step('BANNER: click "Fechar banner"');
try {
  await page.getByRole('button', { name: 'Fechar banner' }).click({ timeout: 5000 });
  await page.waitForTimeout(600);
  const bannerGone = await page.getByRole('button', { name: 'Fechar banner' }).count();
  log.push(`  Banner still present after close: ${bannerGone > 0}`);
  await capture('03-banner-closed');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// ── FLOW 2: Nav anchors ─────────────────────────────────────────────
for (const [anchor, label] of [['#features', 'RECURSOS'], ['#family', 'FAMÍLIA'], ['#plans', 'PLANOS']]) {
  step(`NAV: click ${label} (${anchor})`);
  try {
    await page.getByRole('link', { name: label === 'RECURSOS' ? 'Recursos' : label === 'FAMÍLIA' ? 'Família' : 'Planos' }).click({ timeout: 5000 });
    await page.waitForTimeout(1200); // smooth scroll
    const scrollY = await page.evaluate(() => window.scrollY);
    log.push(`  scrollY after click: ${scrollY}`);
  } catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// ── FLOW 3: Login (ENTRAR) ──────────────────────────────────────────
step('LOGIN: click "Entrar" (nav)');
try {
  await page.getByRole('button', { name: 'Entrar', exact: true }).first().click({ timeout: 5000 });
  await capture('04-login-modal');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Login form validation tests
step('LOGIN: submit empty form');
try {
  const submitBtn = page.getByRole('button', { name: /entrar|acessar|login/i }).last();
  await submitBtn.click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const bodyText = await page.locator('body').innerText();
  const errors = bodyText.match(/(e-mail|email|senha|inválido|obrigat|informe|preencha)[^\n]{0,80}/gi) || [];
  log.push('  Validation messages found: ' + JSON.stringify(errors.slice(0, 8)));
  await capture('05-login-empty-submit');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

step('LOGIN: invalid email + short password');
try {
  const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="mail" i]').first();
  const passInput = page.locator('input[type="password"]').first();
  if (await emailInput.count()) { await emailInput.fill('email-invalido'); }
  if (await passInput.count()) { await passInput.fill('123'); }
  const submitBtn = page.getByRole('button', { name: /entrar|acessar|login/i }).last();
  await submitBtn.click({ timeout: 5000 });
  await page.waitForTimeout(1500);
  const bodyText = await page.locator('body').innerText();
  const errors = bodyText.match(/(e-mail|email|senha|inválido|obrigat|informe|preencha|incorreto|não)[^\n]{0,80}/gi) || [];
  log.push('  Validation messages found: ' + JSON.stringify(errors.slice(0, 8)));
  await capture('06-login-invalid');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Check for "esqueci minha senha" / forgot password link
step('LOGIN: look for forgot-password link');
try {
  const forgot = page.getByText(/esquec/i).first();
  if (await forgot.count()) {
    log.push('  Found forgot-password element: "' + (await forgot.innerText()).trim().slice(0, 80) + '"');
    await forgot.click({ timeout: 5000 });
    await page.waitForTimeout(1200);
    await capture('07-login-forgot');
  } else {
    log.push('  No forgot-password element found');
  }
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Close login modal
step('LOGIN: close modal (Esc / X)');
try {
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(800);
  const modalGone = await page.locator('[role="dialog"], [role="alertdialog"]').count();
  log.push(`  Dialogs remaining: ${modalGone}`);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// ── FLOW 4: Cadastro (Criar Conta Grátis) ───────────────────────────
step('SIGNUP: click "Criar Conta Grátis" (hero)');
try {
  await page.getByRole('button', { name: 'Criar Conta Grátis' }).first().click({ timeout: 5000 });
  await capture('08-signup-modal');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

step('SIGNUP: submit empty form');
try {
  const submitBtn = page.getByRole('button', { name: /criar|cadast|começar|assinar/i }).last();
  await submitBtn.click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const bodyText = await page.locator('body').innerText();
  const errors = bodyText.match(/(nome|e-mail|email|senha|inválido|obrigat|informe|preencha|mínimo|pelo menos)[^\n]{0,80}/gi) || [];
  log.push('  Validation messages found: ' + JSON.stringify(errors.slice(0, 10)));
  await capture('09-signup-empty-submit');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

step('SIGNUP: fill invalid data (short password, bad email)');
try {
  const inputs = page.locator('[role="dialog"] input, [role="alertdialog"] input, .modal input');
  const n = await inputs.count();
  log.push(`  Inputs in modal: ${n}`);
  for (let i = 0; i < n; i++) {
    const inp = inputs.nth(i);
    const type = await inp.getAttribute('type');
    const ph = (await inp.getAttribute('placeholder')) || '';
    if (type === 'email' || /mail/i.test(ph)) await inp.fill('x');
    else if (type === 'password') await inp.fill('123');
    else await inp.fill('A');
  }
  const submitBtn = page.getByRole('button', { name: /criar|cadast|começar|assinar/i }).last();
  await submitBtn.click({ timeout: 5000 });
  await page.waitForTimeout(1500);
  const bodyText = await page.locator('body').innerText();
  const errors = bodyText.match(/(nome|e-mail|email|senha|inválido|obrigat|informe|preencha|mínimo|pelo menos|caracteres)[^\n]{0,80}/gi) || [];
  log.push('  Validation messages found: ' + JSON.stringify(errors.slice(0, 10)));
  await capture('10-signup-invalid');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Check for terms checkbox / plan selection in signup
step('SIGNUP: check for terms checkbox / plan options');
try {
  const checkboxes = await page.locator('input[type="checkbox"], [role="checkbox"], [role="switch"]').count();
  log.push(`  Checkboxes/switches in modal: ${checkboxes}`);
  const planText = await page.locator('body').innerText();
  const planMentions = planText.match(/(lite|premium|grátis|plano)[^\n]{0,60}/gi) || [];
  log.push('  Plan mentions: ' + JSON.stringify([...new Set(planMentions)].slice(0, 8)));
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Close signup modal
step('SIGNUP: close modal');
try {
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(800);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// ── FLOW 5: Assinar Premium ─────────────────────────────────────────
step('PREMIUM: click "Assinar Premium" (plans section)');
try {
  await page.getByRole('button', { name: 'Assinar Premium' }).click({ timeout: 5000 });
  await capture('11-premium-modal');
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// Close
step('PREMIUM: close modal');
try {
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(800);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// ── FLOW 6: Footer Login/Cadastro ───────────────────────────────────
step('FOOTER: click "Cadastro" (footer)');
try {
  await page.getByRole('button', { name: 'Cadastro' }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const dialogCount = await page.locator('[role="dialog"], [role="alertdialog"]').count();
  log.push(`  Dialogs open: ${dialogCount}`);
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(600);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

step('FOOTER: click "Login" (footer)');
try {
  await page.getByRole('button', { name: 'Login', exact: true }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const dialogCount = await page.locator('[role="dialog"], [role="alertdialog"]').count();
  log.push(`  Dialogs open: ${dialogCount}`);
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(600);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

// ── FLOW 7: "Já tenho conta" in hero ────────────────────────────────
step('HERO: click "Já tenho conta"');
try {
  await page.getByRole('button', { name: 'Já tenho conta' }).first().click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const dialogCount = await page.locator('[role="dialog"], [role="alertdialog"]').count();
  log.push(`  Dialogs open: ${dialogCount}`);
  const closeBtn = page.getByRole('button', { name: /fechar|close|×/i }).first();
  if (await closeBtn.count()) { await closeBtn.click({ timeout: 3000 }); }
  else { await page.keyboard.press('Escape'); }
  await page.waitForTimeout(600);
} catch (e) { log.push('  ERROR: ' + e.message.slice(0, 150)); }

fs.writeFileSync(`${OUT}/flows-log.txt`, log.join('\n') + `\n\nCONSOLE ERRORS: ${JSON.stringify(consoleErrors, null, 2)}\n`);
console.log(log.join('\n'));
console.log('\nCONSOLE ERRORS:', consoleErrors.length);
await browser.close();
