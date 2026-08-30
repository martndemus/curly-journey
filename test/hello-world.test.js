const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

// Environments that pre-install a browser (rather than the one Playwright
// downloads on `playwright install`) expose it at this fixed path.
const preinstalledChromium = "/opt/pw-browsers/chromium";
const executablePath = fs.existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3131";

test("renders Hello, World!", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage();
    await page.goto(baseUrl);
    const heading = await page.textContent("h1");
    assert.equal(heading, "Hello, World!");
  } finally {
    await browser.close();
  }
});
