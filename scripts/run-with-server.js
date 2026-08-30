#!/usr/bin/env node

// Starts `serve` on the project root before running the test suite, and
// stops it afterwards, so tests hit the site over http:// instead of
// relying on the file:// protocol.

const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const root = path.join(__dirname, "..");
const port = Number(process.env.PORT) || 3131;
const baseUrl = `http://127.0.0.1:${port}`;

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

async function main() {
  const serveBin = require.resolve("serve/build/main.js");
  const server = spawn(process.execPath, [serveBin, "-l", String(port), "-L", root], {
    stdio: "inherit",
  });

  let serverExited = false;
  server.on("exit", () => {
    serverExited = true;
  });

  try {
    await waitForServer();
  } catch (err) {
    if (!serverExited) server.kill();
    console.error(err.message);
    process.exitCode = 1;
    return;
  }

  const testProcess = spawn(process.execPath, ["--test", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, TEST_BASE_URL: baseUrl },
  });

  const exitCode = await new Promise((resolve) => {
    testProcess.on("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });

  if (!serverExited) server.kill();

  process.exitCode = exitCode;
}

main();
