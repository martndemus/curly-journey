const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

// Environments that pre-install a browser (rather than the one Playwright
// downloads on `playwright install`) expose it at this fixed path.
const preinstalledChromium = "/opt/pw-browsers/chromium";
const executablePath = fs.existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

test("renders an Add task button", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, "..", "index.html")}`);
    const button = page.getByRole("button", { name: "Add task" });
    await assert.doesNotReject(button.waitFor({ state: "attached", timeout: 1000 }));
  } finally {
    await browser.close();
  }
});
