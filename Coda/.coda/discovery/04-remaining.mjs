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
  const msgs = await page.evaluate(() => {
    return [...document.querySelectorAll('p, [role="alert"]')]
      .map(e => (e.textContent || '').trim())
      .filter(t => t && t.length < 160 && /erro|inválido|obrigat|informe|preencha|mínimo|pelo menos|caracter|não|já existe|sucesso|enviado|recupera|digitos/i.test(t));
  });
  log.push(`  MSGS: ${JSON.stringify([...new Set(msgs)].slice(0, 10))}`);
  return aria;
}

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });
await page.waitForTimeout(2500);

// ── NAV anchors (scroll behavior) ───────────────────────────────────
step('NAV anchors scroll');
for (const [name, label] of [['Recursos', '#features'], ['Família', '#family'], ['Planos', '#plans']]) {
  try {
    await page.getByRole('link', { name }).click({ timeout: 5000 });
    await page.waitForTimeout(1500);
    const y = await page.evaluate(() => window.scrollY);
    log.push(`  ${name} -> scrollY=${y}`);
  } catch (e) { log.push(`  ${name} ERR ${e.message.slice(0, 100)}`); }
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);

// ── PREMIUM: Assinar Premium ────────────────────────────────────────
step('PREMIUM: click "Assinar Premium"');
try {
  await page.getByRole('button', { name: 'Assinar Premium' }).click({ timeout: 5000 });
  await grab('14-premium');
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── PREMIUM: Criar Conta Grátis in plans section ────────────────────
step('PLANS: click "Criar Conta Grátis" (plans section)');
try {
  const btns = page.getByRole('button', { name: 'Criar Conta Grátis' });
  const n = await btns.count();
  log.push(`  "Criar Conta Grátis" buttons on page: ${n}`);
  await btns.nth(n - 1).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after click: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── FOOTER: Cadastro ────────────────────────────────────────────────
step('FOOTER: click "Cadastro"');
try {
  await page.getByRole('button', { name: 'Cadastro' }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after click: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── FOOTER: Login ───────────────────────────────────────────────────
step('FOOTER: click "Login"');
try {
  await page.getByRole('button', { name: 'Login', exact: true }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after click: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── HERO: "Já tenho conta" ──────────────────────────────────────────
step('HERO: click "Já tenho conta"');
try {
  await page.getByRole('button', { name: 'Já tenho conta' }).first().click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after click: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── FORGOT PASSWORD flow ────────────────────────────────────────────
step('FORGOT: open login, click "Esqueceu?"');
try {
  await page.getByRole('button', { name: 'Entrar', exact: true }).first().click({ timeout: 5000 });
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Esqueceu?' }).click({ timeout: 5000 });
  await page.waitForTimeout(800);
  // empty submit
  await page.getByRole('button', { name: 'Enviar link de recuperação' }).click({ timeout: 5000 });
  await page.waitForTimeout(800);
  await grab('15-forgot-empty');
  // invalid email
  const email = page.locator('input[type="email"]').first();
  await email.fill('x');
  await page.getByRole('button', { name: 'Enviar link de recuperação' }).click({ timeout: 5000 });
  await page.waitForTimeout(1200);
  await grab('16-forgot-invalid');
  // valid email (do NOT actually send - but this is a real send; use a clearly test email)
  // Skip real send to avoid side effects; document the button only.
  log.push('  NOTE: valid-email send skipped to avoid side effects');
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── "Lembrei minha senha" back button ───────────────────────────────
step('FORGOT: click "Lembrei minha senha" (back)');
try {
  await page.getByRole('button', { name: 'Lembrei minha senha' }).click({ timeout: 5000 });
  await page.waitForTimeout(800);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after back: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── "Voltar" button on auth screens ─────────────────────────────────
step('AUTH: click "Voltar" (back to landing)');
try {
  await page.getByRole('button', { name: 'Voltar' }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').first().innerText().catch(() => null);
  log.push(`  H1 after Voltar: ${JSON.stringify(h1)}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── Banner close ────────────────────────────────────────────────────
step('BANNER: click "Fechar banner"');
try {
  await page.getByRole('button', { name: 'Fechar banner' }).click({ timeout: 5000 });
  await page.waitForTimeout(600);
  const still = await page.getByRole('button', { name: 'Fechar banner' }).count();
  log.push(`  Banner still present: ${still > 0}`);
  // reload to check persistence
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });
  await page.waitForTimeout(2500);
  const afterReload = await page.getByRole('button', { name: 'Fechar banner' }).count();
  log.push(`  Banner present after reload: ${afterReload > 0}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

// ── Mobile viewport check ───────────────────────────────────────────
step('MOBILE: 390x844 viewport');
try {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/screenshots/17-mobile-landing.png`, fullPage: false });
  const navVisible = await page.getByRole('link', { name: 'Recursos' }).isVisible().catch(() => false);
  const hamburger = await page.locator('button[aria-label*="menu" i], button[aria-label*="Menu"]').count();
  log.push(`  nav "Recursos" visible on mobile: ${navVisible}; hamburger buttons: ${hamburger}`);
  // check horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  log.push(`  horizontal overflow: ${overflow}`);
} catch (e) { log.push('  ERR ' + e.message.slice(0, 120)); }

fs.writeFileSync(`${OUT}/flows2-log.txt`, log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
