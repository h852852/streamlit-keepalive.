/**
 * wake_up.js
 * Visits the Streamlit app and clicks "Yes, get this app back up!"
 * if the app is sleeping. Retries up to MAX_RETRIES times.
 */

const { chromium } = require('playwright');

// ─── Config ────────────────────────────────────────────────────────────────
const APP_URL     = 'https://h852852.streamlit.app/';
const MAX_RETRIES = 10;
const BOOT_WAIT   = 40_000;   // ms to wait after clicking wake-up
const NAV_TIMEOUT = 60_000;   // ms for page.goto timeout
// ───────────────────────────────────────────────────────────────────────────

function log(msg)  { console.log(`[${new Date().toISOString()}] ℹ️  ${msg}`); }
function ok(msg)   { console.log(`[${new Date().toISOString()}] ✅ ${msg}`); }
function warn(msg) { console.log(`[${new Date().toISOString()}] ⚠️  ${msg}`); }
function err(msg)  { console.error(`[${new Date().toISOString()}] ❌ ${msg}`); }

async function checkAndWake(attempt) {
  log(`Attempt ${attempt} of ${MAX_RETRIES} — visiting ${APP_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

    // Short pause for JS to render the sleep screen (if present)
    await page.waitForTimeout(3000);

    // ── Check for the wake-up button ────────────────────────────────────
    const wakeBtn = page.getByRole('button', { name: /yes, get this app back up/i });
    const sleeping = await wakeBtn.isVisible().catch(() => false);

    if (sleeping) {
      log('App is sleeping 😴 — clicking wake-up button...');
      await wakeBtn.click();
      log(`Waiting ${BOOT_WAIT / 1000}s for the app to boot...`);
      await page.waitForTimeout(BOOT_WAIT);

      // ── Verify the app actually came up ───────────────────────────────
      const title = await page.title();
      if (title.toLowerCase().includes('streamlit') && !title.toLowerCase().includes('zzzz')) {
        ok(`App is back online! Page title: "${title}"`);
        return true;
      } else {
        warn(`App may still be booting. Page title: "${title}"`);
        return false;
      }
    } else {
      // ── App already running ───────────────────────────────────────────
      const title = await page.title();
      ok(`App is already running 🚀 — no action needed. Title: "${title}"`);
      return true;
    }
  } finally {
    await browser.close();
  }
}

// ── Main with retry logic ───────────────────────────────────────────────────
(async () => {
  log('=== Streamlit Keep-Alive Script Starting ===');
  log(`Target: ${APP_URL}`);

  let success = false;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      success = await checkAndWake(attempt);
      if (success) break;
    } catch (e) {
      err(`Attempt ${attempt} failed: ${e.message}`);
    }

    if (attempt < MAX_RETRIES) {
      warn(`Retrying in 15 seconds...`);
      await new Promise(r => setTimeout(r, 15_000));
    }
  }

  log('=== Script Finished ===');

  if (!success) {
    err('All attempts failed. The app may need manual attention.');
    process.exit(1);   // Non-zero exit → GitHub Actions marks the run as failed
  }
})();
