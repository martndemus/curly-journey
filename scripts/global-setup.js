// Global setup/teardown for `node --test --test-global-setup=./scripts/global-setup.js`.
// Starts `serve` on the project root before the suite runs, and stops it
// afterwards, so tests hit the site over http:// instead of file://.

const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const root = path.join(__dirname, "..");
const port = Number(process.env.PORT) || 3131;

let server;

function waitForServer(timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() > deadline) {
          reject(new Error(`Timed out waiting for serve on port ${port}`));
        } else {
          setTimeout(tryConnect, 100);
        }
      });
    };
    tryConnect();
  });
}

async function globalSetup() {
  const serveBin = require.resolve("serve/build/main.js");
  server = spawn(process.execPath, [serveBin, "-l", String(port), "-L", root], {
    stdio: "inherit",
  });

  await waitForServer();

  process.env.TEST_BASE_URL = `http://127.0.0.1:${port}`;
}

async function globalTeardown() {
  if (server && server.exitCode === null) {
    server.kill();
  }
}

module.exports = { globalSetup, globalTeardown };
