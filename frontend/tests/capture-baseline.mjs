const QA_PASSWORD = crypto.randomUUID();
import { chromium, request } from "@playwright/test";
import fs from "node:fs/promises";
const out = new URL("../../docs/redesign/", import.meta.url);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(20000);
const api = await request.newContext({ baseURL: "http://127.0.0.1:8080/api/" });
const results = [];
const check = (name, ok) => {
  if (!ok) throw new Error(name);
  results.push({ name, passed: true });
  console.log("PASS", name);
};
await page.goto("http://127.0.0.1:5173/");
await page.getByRole("heading", { level: 1 }).waitFor();
await page.screenshot({
  path: new URL("screenshots/before-home-desktop.png", out).pathname.replace(
    /^\//,
    "",
  ),
  fullPage: true,
});
await page.setViewportSize({ width: 375, height: 812 });
await page.screenshot({
  path: new URL("screenshots/before-home-mobile.png", out).pathname.replace(
    /^\//,
    "",
  ),
  fullPage: true,
});
await page.setViewportSize({ width: 1440, height: 1000 });
await page
  .getByRole("button", { name: /start your adventure/i })
  .first()
  .click();
await page.getByRole("button", { name: /new player/i }).click();
await page.getByPlaceholder("Enter your nickname").fill("Baseline Explorer");
await page.getByRole("button", { name: /next step/i }).click();
await page.getByRole("button", { name: /next step/i }).click();
await page.getByRole("button", { name: /next step/i }).click();
await page.locator(".pin-input").fill("2468");
await page.getByRole("button", { name: /start playing/i }).click();
await page.getByText("Your player profile was created successfully!").waitFor();
check("Child UI registration", true);
const child = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("user")),
);
await page.getByRole("button", { name: /start my adventure/i }).click();
await page.getByRole("heading", { name: /welcome back/i }).waitFor();
await page.screenshot({
  path: new URL("screenshots/before-child-desktop.png", out).pathname.replace(
    /^\//,
    "",
  ),
  fullPage: true,
});
await page
  .getByRole("button", { name: /continue adventure/i })
  .first()
  .click();
await page
  .locator("article")
  .filter({
    has: page.getByRole("heading", { name: "Dream Designer", exact: true }),
  })
  .getByRole("button")
  .click();
await page.getByRole("button", { name: /hard/i }).click();
for (const choice of ["Ocean blue", "Reading nook", "Stars", "Soft light"])
  await page.getByRole("button", { name: new RegExp(choice) }).click();
await page
  .getByRole("heading", { name: /adventure complete|exploration complete/i })
  .waitFor();
check("Hard-first game completion through UI", true);
const response = await api.get("child/timeline", {
  headers: { Authorization: `Bearer ${child.token}` },
});
check(
  "Game saved to real backend",
  response.ok() && (await response.json()).length === 1,
);
await page.reload();
await page.getByRole("button", { name: /logout/i }).click();
const parentData = {
  username: "baseline" + Date.now(),
  email: "baseline" + Date.now() + "@example.test",
  password: QA_PASSWORD,
  role: "PARENT",
};
check(
  "Parent fixture registration",
  (await api.post("auth/register", { data: parentData })).ok(),
);
await page.getByRole("button", { name: /parent login/i }).click();
await page.locator("[name=username]").fill(parentData.username);
await page.locator("[name=password]").fill(parentData.password);
await page.getByRole("button", { name: "Sign In", exact: true }).click();
await page
  .getByRole("heading", { name: /child exploration overview/i })
  .waitFor();
check("Parent UI login", true);
await page.getByPlaceholder(/Enter Player Code/).fill(child.playerCode);
await page.getByRole("button", { name: /link child/i }).click();
await page.getByText("Dream Designer", { exact: true }).waitFor();
check("Parent linking and saved activity through UI", true);
await page.screenshot({
  path: new URL("screenshots/before-parent-desktop.png", out).pathname.replace(
    /^\//,
    "",
  ),
  fullPage: true,
});
await fs.writeFile(
  new URL("baseline-browser.json", out),
  JSON.stringify({ executedAt: new Date().toISOString(), results }, null, 2),
);
await browser.close();
await api.dispose();
