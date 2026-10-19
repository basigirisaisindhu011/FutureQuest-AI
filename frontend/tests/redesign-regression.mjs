const QA_PASSWORD = crypto.randomUUID();
import { chromium, request, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_CATALOG } from "../src/data/catalog.js";
const output = process.env.QA_OUTPUT || fileURLToPath(new URL("../../docs/redesign/", import.meta.url));
await fs.mkdir(path.join(output, "screenshots"), { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const api = await request.newContext({ baseURL: "http://127.0.0.1:8080/api/" });
const results = [];
const accessibility = [];
const runtimeErrors = [];
let page;
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.message.slice(0, 1800) });
    console.log("FAIL", name, error.message.slice(0, 400));
    if (page && !page.isClosed())
      await page
        .screenshot({
          path: path.join(
            output,
            "screenshots/failure-" + results.length + ".png",
          ),
        })
        .catch(() => {});
  }
}
async function screenshot(name, fullPage = true) {
  await page.screenshot({
    path: path.join(output, "screenshots/" + name + ".png"),
    fullPage,
  });
}
async function noOverflow() {
  // Viewport resize resolves before the browser necessarily paints its new layout.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    content: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 2 || r.left < -2);
      })
      .slice(0, 8)
      .map((el) => el.className?.baseVal || el.className || el.tagName),
  }));
  expect(dimensions.content, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.width + 1,
  );
}
async function a11y(label) {
  const data = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  accessibility.push({ label, violations: data.violations });
  await fs.writeFile(
    path.join(output, "accessibility-results.json"),
    JSON.stringify(accessibility, null, 2),
  );
  expect(
    data.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}
async function newPage(width = 1440, height = 1000) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("http://127.0.0.1:5173/");
  return context;
}
async function fixture(nickname) {
  const response = await api.post("auth/child/register", {
    data: { nickname, avatar: "rocket", ageGroup: "11-13", pin: "2468" },
  });
  expect(response.status()).toBe(201);
  return response.json();
}
async function authenticate(user) {
  await page.evaluate((user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
  }, user);
  await page.reload();
  await page
    .getByRole("heading", { name: /Welcome back, Explorer/i })
    .waitFor();
}
async function openCatalog() {
  if (
    await page
      .getByRole("button", { name: "Explore games", exact: true })
      .count()
  )
    await page
      .getByRole("button", { name: "Explore games", exact: true })
      .click();
  else {
    await page.reload();
    await page
      .getByRole("button", { name: "Explore games", exact: true })
      .click();
  }
  await page.locator(".catalog-game-card").first().waitFor();
}
async function chooseGame(name, difficulty = "Hard") {
  await page
    .locator(".catalog-game-card")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .getByRole("button")
    .click();
  await page
    .locator(".difficulty-card")
    .filter({ has: page.getByText(difficulty, { exact: true }) })
    .click();
}
let context = await newPage();
await test("Public site sections, world filtering, all 24 previews and keyboard dialog", async () => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "universe",
  );
  for (const id of [
    "about",
    "how-it-works",
    "worlds",
    "games",
    "for-parents",
    "how-ai-works",
    "faq",
  ])
    await expect(page.locator("#" + id)).toBeAttached();
  await page.locator("#worlds .world-card").first().getByRole("button").click();
  await expect(page.locator(".game-preview")).toHaveCount(4);
  await page.getByRole("button", { name: /See all games/i }).click();
  await expect(page.locator(".game-preview")).toHaveCount(24);
  await page.locator(".game-preview").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator("#faq summary").first().click();
  await expect(page.locator("#faq details").first()).toHaveAttribute(
    "open",
    "",
  );
  await screenshot("after-home-desktop");
  await page.evaluate(() => scrollTo(0, 0));
  await screenshot("after-hero-desktop", false);
});
await test("Public desktop accessibility", () => a11y("home-desktop"));
for (const width of [320, 375, 430, 768, 1024, 1440])
  await test(`Public responsive ${width}px and mobile navigation`, async () => {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow();
    if (width <= 900) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "For parents" })
        .click();
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    if (width === 375) {
      await page.evaluate(() => scrollTo(0, 0));
      await screenshot("after-home-mobile");
    }
  });
await context.close();
context = await newPage();
let uiChild;
await test("Child four-step UI registration and real player code", async () => {
  await page
    .getByRole("button", { name: /Start your adventure/i })
    .first()
    .click();
  await page.getByRole("button", { name: /New Player/i }).click();
  await page.getByPlaceholder("Enter your nickname").fill("Redesign Explorer");
  await page.getByRole("button", { name: /Next Step/i }).click();
  await page.getByRole("button", { name: /Palette/ }).click();
  await page.getByRole("button", { name: /Next Step/i }).click();
  await page.getByRole("button", { name: "11-13", exact: true }).click();
  await page.getByRole("button", { name: /Next Step/i }).click();
  await page.locator(".pin-input").fill("2468");
  await screenshot("after-onboarding-desktop");
  await a11y("onboarding-pin");
  await page.getByRole("button", { name: /Start Playing/i }).click();
  await page
    .getByText("Your player profile was created successfully!")
    .waitFor();
  uiChild = await page.evaluate(() => JSON.parse(localStorage.getItem("user")));
  expect(uiChild.playerCode).toMatch(/^CQ/);
  await page.getByRole("button", { name: /Start My Adventure/i }).click();
  await page
    .getByRole("heading", { name: /Welcome back, Explorer/i })
    .waitFor();
  await expect(
    page
      .locator(".summary-stat")
      .filter({ hasText: "badges earned" })
      .locator("strong"),
  ).toHaveText("0");
  await screenshot("after-child-desktop");
});
if (!uiChild) {
  uiChild = await fixture("Recovery fixture");
  await authenticate(uiChild);
}
await test("Child dashboard tabs, map navigation and empty states", async () => {
  for (const label of [
    "My Discovery Map",
    "My Rewards",
    "My Interests",
    "My Journey",
    "My adventure",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await noOverflow();
  }
  await page
    .getByRole("button", { name: "My Discovery Map", exact: true })
    .click();
  await page.locator(".map-world").first().getByRole("button").click();
  await expect(page.locator(".catalog-game-card")).toHaveCount(4);
  await page.getByRole("button", { name: /My adventure/i }).click();
});
await test("Child dashboard accessibility", () => a11y("child-dashboard"));
await test("Hard-first core game playthrough, confirmed rewards, timeline and analysis", async () => {
  await openCatalog();
  await chooseGame("Dream Designer");
  for (const choice of ["LED desk lamp", "Reused desk", "Reused shelf", "Repair cushions"])
    await page.getByRole("button", { name: new RegExp(choice) }).click();
  await page
    .getByRole("heading", { name: "Adventure complete", exact: true })
    .waitFor();
  await expect(page.locator(".xp-reward")).toContainText("40");
  await screenshot("after-completion-desktop");
  await a11y("game-completion");
  const response = await api.get("child/timeline", {
    headers: { Authorization: `Bearer ${uiChild.token}` },
  });
  expect((await response.json()).length).toBe(1);
  await page.reload();
  await page.getByRole("button", { name: "My Journey", exact: true }).click();
  await expect(page.locator(".timeline")).toContainText("Dream Designer");
});
await test("Child logout and PIN login through UI", async () => {
  await authenticate(uiChild);
  await page.getByRole("button", { name: /Logout/ }).click();
  await page
    .getByRole("button", { name: /Start your adventure/i })
    .first()
    .click();
  await page.getByRole("button", { name: /Continue My Adventure/ }).click();
  await page.getByRole("button", { name: /Redesign Explorer/ }).click();
  await page.getByLabel("Enter your 4-digit PIN").fill("2468");
  await page.getByRole("button", { name: /Continue Adventure/ }).click();
  await page
    .getByRole("heading", { name: /Welcome back, Explorer/i })
    .waitFor();
});
await test("Career library navigation, detail and return", async () => {
  await authenticate(uiChild);
  await page
    .getByRole("button", { name: "Career library", exact: true })
    .click();
  await page.locator(".career-card").first().waitFor();
  await a11y("career-library");
  await page.locator(".career-card").first().click();
  await page.getByRole("button", { name: /Back to Library/ }).click();
  await page.getByRole("button", { name: /Back to My Adventure/ }).click();
});
await test("Questy actual API response and honest network failure", async () => {
  await authenticate(uiChild);
  await page.getByRole("button", { name: "Ask Questy" }).click();
  await page.getByLabel("Message to Questy").fill("coding");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".chat-message").last()).toContainText("Software");
  await page.route("**/api/ai/chat", (route) => route.abort());
  await page.getByLabel("Message to Questy").fill("nature");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".chat-message").last()).toContainText(
    "couldn’t reach",
  );
  await page.unroute("**/api/ai/chat");
  await page.getByRole("button", { name: "Close Questy chat" }).click();
});
await test("Career discovery engine full Science Lab playthrough", async () => {
  await openCatalog();
  await chooseGame("Science Lab", "Moderate");
  for (const choice of [
    "Compost soil",
    "The last condition will have the largest result",
    "Run again to compare",
    "I need more evidence",
  ])
    await page.getByRole("button", { name: choice, exact: true }).click();
  await page
    .getByRole("heading", { name: "Adventure complete", exact: true })
    .waitFor();
});
await test("Creative engine save, feedback and no duplicate completion", async () => {
  await openCatalog();
  await chooseGame("Photo Mission", "Medium");
  for (const choice of [
    "Wide view",
    "Subject centered",
    "Eye-level",
    "Soft morning light",
  ])
    await page.getByRole("button", { name: choice, exact: true }).click();
  await page
    .getByRole("heading", { name: "Adventure complete", exact: true })
    .waitFor();
  const headers = { Authorization: `Bearer ${uiChild.token}` };
  const before = (await (await api.get("child/timeline", { headers })).json())
    .length;
  await page.getByRole("button", { name: "Loved it", exact: true }).click();
  await page.getByText("Thanks. Your preference was saved.").waitFor();
  expect(
    (await (await api.get("child/timeline", { headers })).json()).length,
  ).toBe(before);
});
await test("Interest engine full Curiosity Trail playthrough", async () => {
  await openCatalog();
  await chooseGame("Curiosity Trail", "Easy");
  await page.getByRole("button", { name: /Build Something/ }).click();
  await page
    .getByRole("button", { name: "I explored it", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Adventure complete", exact: true })
    .waitFor();
});
for (const game of [
  "Dream Designer",
  "Science Lab",
  "Photo Mission",
  "Curiosity Trail",
])
  await test(`Failed save stays honest: ${game}`, async () => {
    await openCatalog();
    await chooseGame(game, "Easy");
    await page.route("**/api/child/games/level-complete", (route) =>
      route.abort(),
    );
    const choices =
      game === "Dream Designer"
        ? ["Ocean blue", "Reading nook", "Stars", "Soft light"]
        : game === "Science Lab"
          ? [
              "Wood",
              "I predict the conditions differ",
              "Run once",
              "I need more evidence",
            ]
          : game === "Photo Mission"
            ? [
                "Wide view",
                "Subject centered",
                "Eye-level",
                "Soft morning light",
              ]
            : ["Build Something", "I explored it"];
    for (const choice of choices)
      await page
        .getByRole("button", { name: new RegExp(choice) })
        .first()
        .click();
    await page
      .getByRole("heading", { name: "Progress not saved", exact: true })
      .waitFor();
    await expect(page.locator(".xp-reward")).toHaveCount(0);
    await page.unroute("**/api/child/games/level-complete");
  });
await context.close();
context = await newPage(375, 812);
await authenticate(uiChild);
for (const width of [320, 375, 430, 768, 1024, 1440])
  await test(`Child dashboard responsive ${width}px`, async () => {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow();
    if (width === 375) await screenshot("after-child-mobile");
  });
await page.setViewportSize({ width: 375, height: 812 });
await openCatalog();
await test("Game collection mobile accessibility and 24 actual engines", async () => {
  await expect(page.locator(".catalog-game-card")).toHaveCount(24);
  await noOverflow();
  await screenshot("after-games-mobile");
  await a11y("game-catalog-mobile");
});
// Every engine is opened at every difficulty; this is entry/render coverage, not full completion coverage.
for (const game of GAME_CATALOG) {
  for (const level of ["Easy", "Moderate", "Medium", "Hard"])
    await test(`Game entry mobile: ${game.id}/${level}`, async () => {
      if (!(await page.locator(".catalog-game-card").count()))
        await openCatalog();
      const before = runtimeErrors.length;
      await chooseGame(game.name, level);
      await page.locator(".game-shell").waitFor();
      await noOverflow();
      expect(runtimeErrors.slice(before)).toEqual([]);
      if (game.id === "code_robot" && level === "Hard") {
        await screenshot("after-robot-mobile");
        await a11y("robot-hard-mobile");
      }
      await page.getByRole("button", { name: "Exit", exact: true }).click();
      await page
        .getByRole("button", { name: "Back to games", exact: true })
        .click();
    });
}
await context.close();
context = await newPage();
let parent;
await test("Parent UI registration, empty state and real child linking", async () => {
  await page.getByRole("button", { name: "Parent login", exact: true }).click();
  await page
    .getByRole("button", { name: "Create a parent account", exact: true })
    .click();
  const suffix = Date.now();
  await page.getByLabel("Username", { exact: true }).fill("design" + suffix);
  await page
    .getByLabel("Email address")
    .fill("design" + suffix + "@example.test");
  await page.getByLabel("Password", { exact: true }).fill(QA_PASSWORD);
  await screenshot("after-parent-signup-desktop");
  await a11y("parent-signup");
  await page
    .getByRole("button", { name: "Create parent account", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Child exploration overview", exact: true })
    .waitFor();
  await page
    .getByRole("heading", { name: "A window into their world" })
    .waitFor();
  expect(await page.locator(".activity-chart").count()).toBe(0);
  parent = await page.evaluate(() => JSON.parse(localStorage.getItem("user")));
  await page
    .getByLabel("Player Code", { exact: true })
    .fill(uiChild.playerCode);
  await page.getByLabel("Child PIN", { exact: true }).fill("2468");
  await page.getByRole("button", { name: "Link Child", exact: true }).click();
  await page
    .getByRole("heading", { name: /What has Redesign Explorer explored/ })
    .waitFor();
  await page.getByText("Dream Designer", { exact: true }).waitFor();
  await screenshot("after-parent-desktop");
});
await test("Parent evidence, real chart and desktop accessibility", async () => {
  const response = await api.get(
    `parent/children/${uiChild.childId}/activity`,
    { headers: { Authorization: `Bearer ${parent.token}` } },
  );
  const saved = await response.json();
  expect(
    saved.games.find((game) => game.gameType === "curiosity_trail").score,
  ).toBeNull();
  await expect(page.locator(".activity-chart")).toBeVisible();
  await page.locator(".domain-evidence summary").first().click();
  await expect(page.locator(".domain-evidence__body").first()).toBeVisible();
  await a11y("parent-with-activity");
});
for (const width of [320, 375, 430, 768, 1024, 1440])
  await test(`Parent responsive ${width}px`, async () => {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow();
    if (width === 375) await screenshot("after-parent-mobile");
  });
await test("Parent forbidden-child API remains denied", async () => {
  const other = await fixture("Unlinked explorer");
  const response = await api.get(`parent/children/${other.childId}/insights`, {
    headers: { Authorization: `Bearer ${parent.token}` },
  });
  expect(response.status()).toBe(403);
});
await test("Parent dashboard API failure shows recoverable error", async () => {
  await page.route("**/api/parent/children/*/activity", (route) =>
    route.abort(),
  );
  await page.reload();
  await page
    .getByText("The activity record couldn’t load.", { exact: false })
    .waitFor();
  await expect(page.locator(".activity-chart")).toHaveCount(0);
  await page.unroute("**/api/parent/children/*/activity");
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page
    .getByRole("heading", { name: /What has Redesign Explorer explored/ })
    .waitFor();
});
await context.close();
context = await newPage(375, 812);
await test("Mobile preview intent survives four-step registration", async () => {
  await page
    .locator(".game-preview")
    .filter({
      has: page.getByRole("heading", { name: "Photo Mission", exact: true }),
    })
    .click();
  await page
    .getByRole("button", { name: /Create an explorer to play/ })
    .click();
  await page.getByRole("button", { name: /New Player/ }).click();
  await page.getByPlaceholder("Enter your nickname").fill("Mobile Explorer");
  await page.getByRole("button", { name: /Next Step/ }).click();
  await page.getByRole("button", { name: /Next Step/ }).click();
  await page.getByRole("button", { name: /Next Step/ }).click();
  await page.getByLabel(/Step 4: Create a 4-digit PIN/).fill("1357");
  await noOverflow();
  await screenshot("after-onboarding-mobile");
  await a11y("onboarding-mobile");
  await page.getByRole("button", { name: /Start Playing/ }).click();
  await page.getByRole("button", { name: /Start My Adventure/ }).click();
  await page
    .getByRole("heading", { name: "Photo Mission", exact: true })
    .waitFor();
  await expect(page.locator(".difficulty-card")).toHaveCount(4);
  await noOverflow();
  await screenshot("after-difficulty-mobile");
});
await test("Reduced-motion preference disables mascot animation", async () => {
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  const duration = await page
    .locator(".game-questy__mascot")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(["0s", "1e-05s", "0.00001s"]).toContain(duration);
});
await test("No uncaught browser exceptions in executed paths", async () =>
  expect(runtimeErrors).toEqual([]));
await context.close();
await browser.close();
await api.dispose();
await fs.writeFile(
  path.join(output, "browser-results.json"),
  JSON.stringify(
    {
      executedAt: new Date().toISOString(),
      browser: "Microsoft Edge / Playwright",
      results,
      runtimeErrors,
      summary: {
        passed: results.filter((r) => r.status === "PASS").length,
        failed: results.filter((r) => r.status === "FAIL").length,
      },
    },
    null,
    2,
  ),
);
await fs.writeFile(
  path.join(output, "accessibility-results.json"),
  JSON.stringify(accessibility, null, 2),
);
console.log(
  "RESULT",
  results.filter((r) => r.status === "PASS").length,
  "passed,",
  results.filter((r) => r.status === "FAIL").length,
  "failed",
);
process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
