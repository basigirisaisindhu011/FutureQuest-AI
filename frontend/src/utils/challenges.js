export const LEVEL_ORDER = ["EASY", "MODERATE", "MEDIUM", "HARD"];
export function ageBand() {
  try { return Math.max(0, ["8-10", "11-13", "14-16", "17+"].indexOf(JSON.parse(localStorage.getItem("user") || "{}").ageGroup)); }
  catch { return 1; }
}
// Reserve a stable session deck, rather than moving both history and round index.
// A deck cycles only after the available challenges have been visited.
export function takeChallenges(gameId, level, bank, count) {
  let cursor = 0, key;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    key = `fq-deck-v3:${user.childId || "local"}:${user.ageGroup}:${gameId}:${level}`;
    cursor = Number(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, String(cursor + count));
  } catch { /* Play remains available when local storage is unavailable. */ }
  return Array.from({ length: count }, (_, i) => bank[(cursor + i) % bank.length]);
}
export function createPuzzleBank(level, age = 1) {
  const difficulty = LEVEL_ORDER.indexOf(level);
  return Array.from({ length: 48 }, (_, i) => {
    const start = 2 + age * 4 + i * 3;
    const step = 2 + difficulty + age + i % 5;
    let values, answer, prompt;
    if (difficulty < 2) {
      values = [start, start + step, start + 2 * step];
      answer = start + 3 * step;
      prompt = `What comes next? ${values.join(", ")}, ?`;
    } else if (difficulty === 2) {
      values = [start, start + step, start + 2 * step + 1, start + 3 * step + 3];
      answer = start + 4 * step + 6;
      prompt = `The gap grows by one. Find the next value: ${values.join(", ")}, ?`;
    } else {
      const factor = 2 + age % 2;
      values = [start, start * factor + step, (start * factor + step) * factor + step];
      answer = values[2] * factor + step;
      prompt = `Multiply by ${factor}, then add ${step} each time. ${values.join(", ")}, ?`;
    }
    const options = [String(answer), String(answer + step), String(answer - step)];
    for (let n = 0; n < i % 3; n++) options.push(options.shift());
    return { id: `${level}-${age}-${i}`, prompt, options, answer: String(answer) };
  });
}
