const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");

// Environments that pre-install a browser (rather than the one Playwright
// downloads on `playwright install`) expose it at this fixed path.
const preinstalledChromium = "/opt/pw-browsers/chromium";
const executablePath = fs.existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3131";

test("renders an Add task button", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage();
    await page.goto(baseUrl);
    const button = page.getByRole("button", { name: "Add task" });
    await assert.doesNotReject(button.waitFor({ state: "attached", timeout: 1000 }));

    await button.click();
    await page.waitForURL(`${baseUrl}/tasks/new/`);
    assert.equal(new URL(page.url()).pathname, "/tasks/new/");
  } finally {
    await browser.close();
  }
});
