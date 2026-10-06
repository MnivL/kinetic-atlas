import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const appUrl = process.env.KINETIC_ATLAS_URL ?? "http://127.0.0.1:3000/";
const edgePath =
  process.env.EDGE_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputDirectory = resolve("docs/images");

async function getAvailablePort() {
  const server = createServer();
  await new Promise((resolvePromise, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolvePromise);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Unable to reserve a debugging port");
  await new Promise((resolvePromise) => server.close(resolvePromise));
  return address.port;
}

async function waitForJson(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolvePromise, reject) => {
    socket.addEventListener("open", resolvePromise, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let sequence = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve: resolvePromise, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolvePromise(message.result);
  });

  return {
    close: () => socket.close(),
    send(method, params = {}) {
      const id = ++sequence;
      return new Promise((resolvePromise, reject) => {
        pending.set(id, { resolve: resolvePromise, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function waitForPage(send, expression, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
    });
    if (result.result.value) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 300));
  }
  throw new Error(`Page condition timed out: ${expression}`);
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  const profileDirectory = await mkdtemp(join(tmpdir(), "kinetic-atlas-readme-"));
  const port = await getAvailablePort();
  const browser = spawn(
    edgePath,
    [
      "--headless=new",
      "--edge-skip-compat-layer-relaunch",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDirectory}`,
      "--window-size=1600,1000",
      appUrl,
    ],
    { stdio: "ignore" },
  );
  const browserExit = new Promise((resolvePromise) => browser.once("exit", resolvePromise));

  let cdp;
  try {
    const targetsUrl = `http://127.0.0.1:${port}/json/list`;
    let targets = await waitForJson(targetsUrl);
    const deadline = Date.now() + 20_000;
    while (!targets.some((target) => target.type === "page" && target.url.startsWith(appUrl))) {
      if (Date.now() >= deadline) throw new Error("Kinetic Atlas tab did not open");
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
      targets = await waitForJson(targetsUrl);
    }

    const page = targets.find((target) => target.type === "page" && target.url.startsWith(appUrl));
    cdp = await connectCdp(page.webSocketDebuggerUrl);
    const { send } = cdp;
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await waitForPage(
      send,
      "document.readyState === 'complete' && document.querySelector('canvas') && document.body.innerText.includes('1334')",
    );
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 8_000));

    async function capture(filename) {
      const { data } = await send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 88,
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(join(outputDirectory, filename), Buffer.from(data, "base64"));
    }

    async function selectTab(label) {
      const expression = `(() => {
        const button = [...document.querySelectorAll('button')]
          .find((element) => element.textContent.trim() === ${JSON.stringify(label)});
        if (!button) return false;
        button.click();
        return true;
      })()`;
      await waitForPage(send, expression);
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 1_200));
    }

    await capture("overview.jpg");
    await selectTab("动作");
    await waitForPage(send, "document.querySelector('img[alt$=\"动作演示\"]')?.complete === true");
    await capture("action-demo.jpg");
    await selectTab("体态");
    await capture("posture-check.jpg");
  } finally {
    cdp?.close();
    if (process.platform === "win32" && browser.pid) {
      await new Promise((resolvePromise) => {
        const killer = spawn("taskkill", ["/PID", String(browser.pid), "/T", "/F"], {
          stdio: "ignore",
        });
        killer.once("error", () => {
          browser.kill();
          resolvePromise();
        });
        killer.once("exit", resolvePromise);
      });
    } else {
      browser.kill();
    }
    await browserExit;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        await rm(profileDirectory, { recursive: true, force: true });
        break;
      } catch (error) {
        if (error.code !== "EBUSY" || attempt === 9) throw error;
        await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
      }
    }
  }
}

await main();
