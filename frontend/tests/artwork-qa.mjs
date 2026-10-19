import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const out = fileURLToPath(new URL("../../docs/redesign/", import.meta.url));
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
page.setDefaultTimeout(12000);
const checks = [];
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://127.0.0.1:5173/");
for (const width of [1440, 375]) {
  await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
  await page.getByRole("heading", { level: 1 }).waitFor();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({
    path: path.join(
      out,
      `screenshots/after-home-${width === 375 ? "mobile" : "desktop"}.png`,
    ),
    fullPage: true,
  });
  if (width === 1440)
    await page.screenshot({
      path: path.join(out, "screenshots/after-hero-desktop.png"),
    });
  checks.push({
    name: `Final artwork and public accessibility ${width}px`,
    status: "PASS",
  });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page
  .getByRole("button", { name: "See all 24 games", exact: true })
  .click();
for (const name of [
  "Fashion Studio",
  "Music Maker",
  "Junior Chef",
  "Interior Designer",
]) {
  await page
    .locator(".game-preview")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("img", { name: `${name} activity illustration` }),
  ).toHaveCount(1);
  if (name === "Fashion Studio")
    await page.screenshot({
      path: path.join(out, "screenshots/after-fashion-preview.png"),
    });
  await page.keyboard.press("Escape");
  checks.push({
    name: `Original ${name} illustration and preview`,
    status: "PASS",
  });
}
expect(errors).toEqual([]);
await fs.writeFile(
  path.join(out, "artwork-results.json"),
  JSON.stringify(
    { executedAt: new Date().toISOString(), checks, runtimeErrors: errors },
    null,
    2,
  ),
);
console.log("PASS", checks.length, "artwork checks, 0 runtime errors");
await browser.close();
