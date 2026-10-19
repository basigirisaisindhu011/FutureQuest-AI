const QA_PASSWORD = crypto.randomUUID();
import { chromium, request, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GAME_CATALOG } from '../src/data/catalog.js';

const out = path.resolve(process.env.QA_GAME_OUTPUT || 'qa-reports/artifacts/full-games');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const api = await request.newContext({ baseURL: 'http://127.0.0.1:8080/api/' });
const results = [], observations = [], errors = [], network = [];
const suffix = Date.now();
const child = await (await api.post('auth/child/register', { data: { nickname: `QA Games ${suffix}`, ageGroup: '11-13', avatar: 'robot', pin: '2468' } })).json();
const parent = await (await api.post('auth/register', { data: { username: `qag${suffix}`, email: `qag${suffix}@example.test`, password: QA_PASSWORD, role: 'PARENT' } })).json();
const headers = { Authorization: `Bearer ${parent.token}` };
expect((await api.post('parent/link-child', { headers, data: { playerCode: child.playerCode, pin: '2468' } })).ok()).toBeTruthy();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await context.addInitScript(() => {
  // Capture the actual word passed to TTS, rather than replacing spelling logic.
  window.__qaSpoken = '';
  if (window.speechSynthesis) window.speechSynthesis.speak = utterance => { window.__qaSpoken = utterance.text; };
});
const page = await context.newPage();
let finishing = false;
page.on('request', r => { if (r.url().endsWith('/child/games/level-complete') && r.method() === 'POST') finishing = true; });
page.setDefaultTimeout(12000);
page.on('pageerror', e => errors.push(e.message));
page.on('requestfailed', r => network.push({ url: r.url(), error: r.failure()?.errorText }));
await page.goto('http://127.0.0.1:5173');
await page.evaluate(user => { localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('token', user.token); }, child);
async function catalog() {
  await page.reload();
  await page.getByRole('button', { name: 'Explore games', exact: true }).click();
  await page.locator('.catalog-game-card').first().waitFor();
}
await catalog();
// Discovery starts with rendered child-visible cards, not a hardcoded test list.
const names = await page.locator('.catalog-game-card h2').allTextContents();
expect(new Set(names).size).toBe(names.length);
const discovered = names.map(name => {
  const item = GAME_CATALOG.find(game => game.name === name);
  if (!item) throw new Error(`Visible game has no metadata: ${name}`);
  return item;
});
await fs.writeFile(path.join(out, 'discovered.json'), JSON.stringify(discovered, null, 2));
async function robot() {
  const state = await page.locator('.robot-grid').evaluate(grid => {
    const cells = [...grid.children];
    return { size: Math.sqrt(cells.length), start: cells.findIndex(x => x.textContent.includes('🤖')), goal: cells.findIndex(x => x.textContent.includes('⭐')), blocks: cells.flatMap((x, i) => getComputedStyle(x).backgroundColor === 'rgb(24, 33, 47)' ? [i] : []) };
  });
  const queue = [[state.start, []]], seen = new Set([state.start]);
  let solution;
  while (queue.length) {
    const [cell, moves] = queue.shift();
    if (cell === state.goal) { solution = moves; break; }
    for (const [dr, dc, label] of [[-1,0,'⬆️'],[1,0,'⬇️'],[0,-1,'⬅️'],[0,1,'➡️']]) {
      const r = Math.floor(cell / state.size) + dr, c = cell % state.size + dc, next = r * state.size + c;
      if (r >= 0 && c >= 0 && r < state.size && c < state.size && !state.blocks.includes(next) && !seen.has(next)) { seen.add(next); queue.push([next, [...moves, label]]); }
    }
  }
  if (!solution?.length) throw new Error('Robot has no reachable target');
  for (const move of solution) await page.getByRole('button', { name: move, exact: true }).click();
  const old = await page.locator('.game-shell > div').first().innerText();
  await page.getByRole('button', { name: 'Run robot', exact: true }).click();
  await expect.poll(async () => await page.locator('.game-celebration').count() || await page.locator('.game-shell > div').first().innerText() !== old, { timeout: 12000 }).toBeTruthy();
  return state;
}
async function play(game) {
  const prompts = [];
  for (let round = 0; round < 18; round++) {
    if (finishing) await page.locator('.game-celebration').waitFor();
    if (await page.locator('.game-celebration').count()) return prompts;
    const shell = page.locator('.game-shell');
    await shell.waitFor();
    prompts.push((await shell.locator('h1,h2,h3').allTextContents()).join(' | '));
    if (game.id === 'code_robot') { prompts[prompts.length - 1] += JSON.stringify(await robot()); continue; }
    if (game.id === 'spell_quest') {
      await page.getByRole('button', { name: 'Hear word', exact: true }).click();
      const word = await page.evaluate(() => window.__qaSpoken);
      expect(word).not.toBe('');
      prompts[prompts.length - 1] += ` ${word}`;
      await page.getByLabel('Your spelling').fill(word);
      await page.getByRole('button', { name: 'Check spelling', exact: true }).click();
      continue;
    }
    if (game.id === 'speaking_games') {
      await page.getByLabel('Your words (you can also type)').fill('I enjoy exploring ideas with my friends. We plan, try an idea, and explain what we learned.');
      await page.getByRole('button', { name: 'Continue', exact: true }).click(); continue;
    }
    if (game.id === 'story_builder') {
      await page.getByLabel('Your story').fill('First a curious explorer found a map. Next they asked a friend for help. Together they tried a safe route and solved a surprising puzzle. Finally they returned home and shared their adventure with everyone in the village.');
      await page.getByRole('button', { name: 'Save this story', exact: true }).click(); continue;
    }
    if (game.id === 'invent_something' && await page.getByLabel('Your invention').count()) {
      await page.getByLabel('Your invention').fill('A reusable carrying cart with large wheels and a comfortable handle helps people carry their books.');
      await page.getByRole('button', { name: 'Develop the idea', exact: true }).click(); continue;
    }
    if (game.id === 'money_manager' && await page.getByRole('button', { name: 'Set the plan', exact: true }).count()) {
      const slider = shell.locator('input[type=range]').first();
      await slider.focus(); await slider.press('ArrowRight'); await slider.press('ArrowLeft');
      await page.getByRole('button', { name: 'Set the plan', exact: true }).click(); continue;
    }
    if (game.id === 'build_the_city') {
      const plan = ['House', 'School', 'Park'];
      const positions = [0, 1, 2];
      if (await shell.getByText(/Mission:.*Road/).count()) { plan.splice(1, 0, 'Road'); positions.splice(1, 0, 1); positions[2] = 2; positions[3] = 3; }
      if (await shell.getByText(/Mission:.*Hospital/).count()) { plan.push('Hospital'); positions.push(4); }
      for (let i = 0; i < plan.length; i++) { await shell.locator('button.btn').filter({ hasText: new RegExp('^' + plan[i] + '$') }).click(); await shell.locator('.city-grid button').nth(positions[i]).click(); }
      await shell.getByRole('button', { name: 'Finish neighborhood', exact: true }).click(); continue;
    }
    if (game.id === 'interior_designer') {
      await shell.locator('button.btn').filter({ hasText: game.id === 'build_the_city' ? /^House$/ : /^Desk$/ }).click();
      await shell.locator('.city-grid button').filter({ hasText: /^\+$/ }).first().click(); continue;
    }
    if (game.id === 'interest_battle') {
      const options = shell.locator('.battle-options button, .activity-options button'); await options.first().click(); continue;
    }
    if (game.id === 'curiosity_trail') {
      const choices = shell.locator('.trail-grid button');
      if (await choices.count()) await choices.first().click();
      else await shell.getByRole('button', { name: 'I explored it', exact: true }).click();
      continue;
    }
    // Deliberately choose one offered option, including wrong puzzle answers;
    // verify resulting score against the saved completion rather than assuming 100%.
    await shell.locator('button').filter({ hasNotText: /Exit|Reset|Back/ }).first().click();
  }
  throw new Error('Session did not complete within 18 interactions');
}
let savedCount = 0;
for (const game of discovered) {
  if (process.env.QA_GAME_FILTER && !process.env.QA_GAME_FILTER.split(',').includes(game.id)) continue;
  for (const [index, level] of ['Easy','Moderate','Medium','Hard','Easy','Easy'].entries()) {
    const name = `${game.id}/${level}${index > 3 ? `/replay-${index - 3}` : ''}`;
    try {
      await catalog();
      await page.locator('.catalog-game-card').filter({ has: page.getByRole('heading', { name: game.name, exact: true }) }).getByRole('button').click();
      expect(await page.locator('.difficulty-card').count()).toBe(4);
      await page.locator('.difficulty-card').filter({ has: page.getByText(level, { exact: true }) }).click();
      finishing = false;
      if (index === 0) await page.screenshot({ path: path.join(out, `${game.id}-easy.png`), fullPage: true });
      const completion = page.waitForResponse(r => r.url().endsWith('/child/games/level-complete') && r.request().method() === 'POST', { timeout: 180000 });
      completion.catch(() => {});
      const prompts = await play(game);
      const response = await completion;
      expect(response.status()).toBe(200);
      const reward = await response.json(), payload = response.request().postDataJSON();
      await expect(page.getByRole('heading', { name: 'Adventure complete', exact: true })).toBeVisible();
      await expect(page.locator('.xp-reward')).toContainText(String(reward.xpEarned));
      const activityResponse = await api.get(`parent/children/${child.childId}/activity`, { headers });
      expect(activityResponse.ok()).toBeTruthy();
      const activity = await activityResponse.json();
      const record = activity.games.find(record => record.id === reward.recordId);
      expect(record.gameType).toBe(game.id); expect(record.difficulty).toBe(level.toUpperCase());
      expect(record.score).toBe(payload.score ?? (payload.accuracy != null ? Math.round(payload.accuracy) : null));
      expect(record.pointsEarned).toBe(reward.xpEarned);
      expect(activity.games.length).toBe(++savedCount);
      observations.push({ name, gameId: game.id, level, prompts, payload, recordId: reward.recordId, score: record.score, xp: reward.xpEarned });
      // Test the actual replay control where the engine exposes one.
      if (index === 3 && await page.getByRole('button', { name: 'Play again', exact: true }).count()) {
        await page.getByRole('button', { name: 'Play again', exact: true }).click();
        await page.locator('.game-shell').waitFor();
        const resumes = await page.locator('.game-shell').count();
        observations.push({ name: `${game.id}/replay-control`, resumesGame: !!resumes, note: resumes ? 'Resumed game' : 'Reload returned to dashboard; game and difficulty lost' });
      }
      results.push({ name, status: 'PASS', expected: 'Complete by UI, confirmed saved record and matching reward/score, parent readback', actual: `record ${reward.recordId}, ${reward.xpEarned} XP, score ${record.score}` });
      console.log('PASS', name);
    } catch (error) {
      results.push({ name, status: 'FAIL', error: error.message });
      console.log('FAIL', name, error.message.slice(0, 350));
      await page.screenshot({ path: path.join(out, `failure-${game.id}-${index}.png`), fullPage: true }).catch(() => {});
    }
    await fs.writeFile(path.join(out, 'results.json'), JSON.stringify({ executedAt: new Date().toISOString(), discovered: names, results, observations, errors, network }, null, 2));
  }
}
// Parent dashboard must render actual accumulated records after the full journey.
await page.evaluate(user => { localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('token', user.token); }, parent);
await page.reload();
await page.getByRole('heading', { name: 'Child exploration overview', exact: true }).waitFor();
await expect(page.locator('.activity-chart')).toBeVisible();
await page.screenshot({ path: path.join(out, 'parent-after-all-games.png'), fullPage: true });
await fs.writeFile(path.join(out, 'parent-final.json'), JSON.stringify({ status: 'PASS', savedCount, insights: await (await api.get(`parent/children/${child.childId}/insights`, { headers })).json() }, null, 2));
console.log('RESULT', results.filter(x => x.status === 'PASS').length, 'passed,', results.filter(x => x.status === 'FAIL').length, 'failed');
await browser.close(); await api.dispose();
process.exitCode = results.some(x => x.status === 'FAIL') ? 1 : 0;
