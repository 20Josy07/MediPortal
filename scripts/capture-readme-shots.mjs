import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

/** ============ CONFIG ============ **/
const BASE = process.env.BASE_URL || "https://zendapsi.com"; // o http://localhost:3000

// ⚠️ Usa credenciales de DEMO, no reales
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "josyacosta07@gmail.com";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "1130294530";

const LOGIN_PATH = "/login";
const LOGIN_SELECTORS = {
  email: 'input[name="email"]',
  password: 'input[name="password"]',
  submit: 'form button[type="submit"]',
  // algo que exista al entrar al dashboard (ajusta si hace falta)
  loggedInGuard: '[data-testid="dashboard"], main:has([data-testid="dashboard"])',
};

const PAGES_PUBLIC = [
  { slug: "", name: "home", waitFor: "main" },
  { slug: "login", name: "login", waitFor: "form" },
];

const PAGES_PRIVATE = [
  { slug: "dashboard", name: "dashboard", waitFor: '[data-testid="dashboard"]' },
  { slug: "dashboard/calendar", name: "calendar", waitFor: '[data-testid="calendar"], .fc' },
  { slug: "dashboard/patients", name: "patients", waitFor: '[data-testid="patients-list"]' },
  { slug: "dashboard/notes", name: "notes", waitFor: '[data-testid="notes-page"]' },
];

const HIDE_SELECTORS = [
  "#cookie-banner,.cookie-banner,[aria-label='cookie']",
  "[aria-label='chat widget'],#hubspot-messages-iframe-container,.intercom-lightweight-app",
  "#facebook-jssdk, #fb-root",
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile:  { width: 390,  height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const THEMES = ["light", "dark"]; // deja solo "light" si no quieres modo oscuro
const OUT_DIR = path.resolve("docs/screenshots");
const COOKIES_FILE = path.resolve(".shots-cookies.json");
const FULL_PAGE = true;
const TIMEOUT = 45_000;

/** ============ UTILS ============ **/
async function ensureDir(dir) { await fs.promises.mkdir(dir, { recursive: true }); }
async function hideAnnoyances(page) {
  for (const sel of HIDE_SELECTORS) {
    try { await page.$$eval(sel, els => els.forEach(el => (el.style.display = "none"))); } catch {}
  }
}
async function waitForReady(page, selector) {
  if (!selector) return;
  try { await page.waitForSelector(selector, { timeout: 15_000, visible: true }); } catch {}
}
function outName(name, kind, theme) { return `${name}-${kind}-${theme}.png`; }
async function loadCookies(page) {
  if (!fs.existsSync(COOKIES_FILE)) return false;
  const cookies = JSON.parse(await fs.promises.readFile(COOKIES_FILE, "utf8"));
  if (!Array.isArray(cookies) || cookies.length === 0) return false;
  await page.setCookie(...cookies);
  return true;
}
async function saveCookies(page) {
  const cookies = await page.cookies();
  await fs.promises.writeFile(COOKIES_FILE, JSON.stringify(cookies, null, 2));
}

/** ============ LOGIN ============ **/
async function loginIfNeeded(page) {
  const hadCookies = await loadCookies(page);

  // prueba acceso directo
  await page.goto(`${BASE}/dashboard`, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });
  if (await page.$(LOGIN_SELECTORS.loggedInGuard)) {
    if (!hadCookies) await saveCookies(page);
    return true;
  }

  // ir a login y enviar el formulario
  await page.goto(`${BASE}${LOGIN_PATH}`, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });

  await page.waitForSelector(LOGIN_SELECTORS.email, { timeout: 15_000 });
  await page.click(LOGIN_SELECTORS.email);
  await page.keyboard.type(LOGIN_EMAIL, { delay: 15 });

  await page.waitForSelector(LOGIN_SELECTORS.password, { timeout: 15_000 });
  await page.click(LOGIN_SELECTORS.password);
  await page.keyboard.type(LOGIN_PASSWORD, { delay: 15 });

  await Promise.all([
    page.click(LOGIN_SELECTORS.submit),
    page.waitForNavigation({ waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT }),
  ]);

  await waitForReady(page, LOGIN_SELECTORS.loggedInGuard);
  const ok = !!(await page.$(LOGIN_SELECTORS.loggedInGuard));
  if (ok) await saveCookies(page);
  return ok;
}

/** ============ MAIN ============ **/
(async () => {
  await ensureDir(OUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  // ---------- Públicas ----------
  for (const theme of THEMES) {
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);

    for (const { slug, name, waitFor } of PAGES_PUBLIC) {
      const url = `${BASE}/${slug}`.replace(/\/+$/, "/");
      for (const [kind, vp] of Object.entries(VIEWPORTS)) {
        await page.setViewport(vp);
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });
        await waitForReady(page, waitFor);
        await hideAnnoyances(page);
        await page.waitForTimeout(250);
        await page.screenshot({
          path: path.join(OUT_DIR, outName(name, kind, theme)),
          fullPage: FULL_PAGE,
          type: "png",
        });
        console.log(`✓ ${name}-${kind}-${theme}`);
      }
    }
  }

  // ---------- Privadas (requiere login) ----------
  const okLogin = await loginIfNeeded(page);
  if (!okLogin) {
    console.error("⚠️  No se pudo iniciar sesión. Revisa credenciales o selectores.");
    await browser.close();
    process.exit(1);
  }

  for (const theme of THEMES) {
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);

    for (const { slug, name, waitFor } of PAGES_PRIVATE) {
      const url = `${BASE}/${slug}`.replace(/\/+$/, "/");
      for (const [kind, vp] of Object.entries(VIEWPORTS)) {
        await page.setViewport(vp);
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });
        await waitForReady(page, waitFor);
        await hideAnnoyances(page);
        await page.waitForTimeout(250);
        await page.screenshot({
          path: path.join(OUT_DIR, outName(name, kind, theme)),
          fullPage: FULL_PAGE,
          type: "png",
        });
        console.log(`✓ ${name}-${kind}-${theme}`);
      }
    }
  }

  await browser.close();
  console.log(`\nListo. Revisa: ${OUT_DIR}`);
})().catch(err => {
  console.error("Error en capturas:", err);
  process.exit(1);
});
