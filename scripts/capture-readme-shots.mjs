import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

// ======== CONFIGURACIÓN ========
const BASE = process.env.BASE_URL || "https://zendapsi.com"; // o http://localhost:3000

// Credenciales demo (usa un usuario de pruebas; NO subas credenciales reales)
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "josyacosta07@gmail.com";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "1130294530";

// Ruta a la pantalla de login y selectores del formulario
const LOGIN_PATH = "/login";
const LOGIN_SELECTORS = {
  email: 'input[name="Correo Electrónico"]',
  password: 'input[name="Contraseña"]',
  submit: 'button[type="Iniciar Sesión"]',
  // selector que indica que ya estás logueado (redirección completa)
  loggedInGuard: '[data-testid="dashboard"], main:has([data-testid="dashboard"])'
};

// Rutas públicas y privadas que quieres capturar
const PAGES_PUBLIC = [
  { slug: "", name: "home", waitFor: "main" },
  { slug: "login", name: "login", waitFor: "form" },
];

const PAGES_PRIVATE = [
  { slug: "dashboard", name: "dashboard", waitFor: '[data-testid="dashboard"]' },
  { slug: "dashboard/calendar", name: "calendar", waitFor: '[data-testid="calendar"], .fc' },
  { slug: "dashboard/patients", name: "patients", waitFor: '[data-testid="patients-list"]' },
  { slug: "dashboard/notes", name: "notes", waitFor: '[data-testid="notes-page"]' },
  // agrega más si quieres…
];

// Selectores de banners/overlays para ocultar en las capturas
const HIDE_SELECTORS = [
  "#cookie-banner,.cookie-banner,[aria-label='cookie']",
  "[aria-label='chat widget'],#hubspot-messages-iframe-container",
  ".intercom-lightweight-app",
];

// Dispositivos
const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile:  { width: 390,  height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

// Temas a capturar
const THEMES = ["light", "dark"]; // quita "dark" si no lo necesitas

// Otras opciones
const OUT_DIR = path.resolve("docs/screenshots");
const COOKIES_FILE = path.resolve(".shots-cookies.json");
const FULL_PAGE = true;
const TIMEOUT = 45_000;

// ======== UTILS ========
async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function hideAnnoyances(page) {
  for (const sel of HIDE_SELECTORS) {
    try {
      await page.$$eval(sel, els => els.forEach(el => (el.style.display = "none")));
    } catch {/* ignore */}
  }
}

async function waitForReady(page, selector) {
  if (!selector) return;
  try {
    await page.waitForSelector(selector, { timeout: 15_000, visible: true });
  } catch {/* si no aparece, seguimos con network idle */}
}

function outName(name, kind, theme) {
  return `${name}-${kind}-${theme}.png`; // p.ej. dashboard-desktop-dark.png
}

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

// ======== LOGIN ========
async function loginIfNeeded(page) {
  // Intenta cargar cookies
  const hadCookies = await loadCookies(page);

  // Prueba acceso directo al dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });
  const logged = await page.$(LOGIN_SELECTORS.loggedInGuard);
  if (logged) {
    if (!hadCookies) await saveCookies(page);
    return true;
  }

  // Si no está logueado, ve a login y completa formulario
  await page.goto(`${BASE}${LOGIN_PATH}`, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });

  await page.waitForSelector(LOGIN_SELECTORS.email, { timeout: 15_000 });
  await page.click(LOGIN_SELECTORS.email);
  await page.keyboard.type(LOGIN_EMAIL, { delay: 20 });

  await page.waitForSelector(LOGIN_SELECTORS.password, { timeout: 15_000 });
  await page.click(LOGIN_SELECTORS.password);
  await page.keyboard.type(LOGIN_PASSWORD, { delay: 20 });

  await Promise.all([
    page.click(LOGIN_SELECTORS.submit),
    page.waitForNavigation({ waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT }),
  ]);

  // Verifica guard
  await waitForReady(page, LOGIN_SELECTORS.loggedInGuard);
  const ok = !!(await page.$(LOGIN_SELECTORS.loggedInGuard));
  if (ok) await saveCookies(page);
  return ok;
}

// ======== MAIN ========
(async () => {
  await ensureDir(OUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Public
  for (const theme of THEMES) {
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);

    for (const { slug, name, waitFor } of PAGES_PUBLIC) {
      const url = `${BASE}/${slug}`.replace(/\/+$/, "/");
      for (const [kind, vp] of Object.entries(VIEWPORTS)) {
        await page.setViewport(vp);
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: TIMEOUT });
        await waitForReady(page, waitFor);
        await hideAnnoyances(page);
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(OUT_DIR, outName(name, kind, theme)),
          fullPage: FULL_PAGE,
          type: "png",
        });
        console.log(`✓ ${name}-${kind}-${theme}`);
      }
    }
  }

  // Private (requiere login)
  const okLogin = await loginIfNeeded(page);
  if (!okLogin) {
    console.error("⚠️  No se pudo iniciar sesión. Revisa credenciales/selectores.");
    process.exitCode = 1;
    await browser.close();
    return;
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
        await page.waitForTimeout(300);
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
