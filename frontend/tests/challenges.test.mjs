import test from 'node:test';
import assert from 'node:assert/strict';
import { createPuzzleBank, takeChallenges, LEVEL_ORDER } from '../src/utils/challenges.js';

test('all generated age/difficulty banks contain unique, unambiguous numeric challenges', () => {
  for (const level of LEVEL_ORDER) for (let age = 0; age < 4; age++) {
    const bank = createPuzzleBank(level, age);
    assert.equal(new Set(bank.map(item => item.prompt)).size, 48);
    for (const item of bank) {
      assert.equal(new Set(item.options).size, 3);
      assert.equal(item.options.filter(option => option === item.answer).length, 1);
      assert.ok(Number.isFinite(Number(item.answer)));
    }
  }
  assert.notEqual(createPuzzleBank('EASY', 0)[0].prompt, createPuzzleBank('HARD', 0)[0].prompt);
  assert.notEqual(createPuzzleBank('EASY', 0)[0].prompt, createPuzzleBank('EASY', 3)[0].prompt);
});
test('session decks visit every challenge before recycling and isolate child history', () => {
  const values = new Map([['user', JSON.stringify({ childId: 1, ageGroup: '11-13' })]]);
  globalThis.localStorage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const bank = createPuzzleBank('EASY');
  const first = takeChallenges('puzzle', 'EASY', bank, 5);
  const second = takeChallenges('puzzle', 'EASY', bank, 5);
  assert.equal(new Set([...first, ...second].map(item => item.id)).size, 10);
  values.set('user', JSON.stringify({ childId: 2, ageGroup: '11-13' }));
  assert.deepEqual(takeChallenges('puzzle', 'EASY', bank, 5), first);
  delete globalThis.localStorage;
});
