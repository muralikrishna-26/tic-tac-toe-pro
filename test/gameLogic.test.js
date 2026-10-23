import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WIN_LINES, applyMove, createEmptyBoard, findWinner, getAvailableMoves, getResult,
} from '../src/utils/gameLogic.js';
import { getBestMoves, getComputerMove } from '../src/utils/computerAI.js';
import {
  addMatch, defaultStats, isValidHistory, isValidStats, recordResult, winPercentage, MAX_HISTORY,
} from '../src/utils/statistics.js';

const boardFrom = (str) => [...str.replace(/\s/g, '')].map((c) => (c === '.' ? null : c));

test('detects all eight winning lines for both players', () => {
  assert.equal(WIN_LINES.length, 8);
  for (const player of ['X', 'O']) {
    for (const line of WIN_LINES) {
      const board = createEmptyBoard();
      line.forEach((i) => { board[i] = player; });
      const win = findWinner(board);
      assert.equal(win.winner, player);
      assert.deepEqual(win.line, line);
    }
  }
});

test('a partly filled board has no result', () => {
  assert.equal(getResult(boardFrom('XO. .X. ...')), null);
});

test('a full board with no line is a draw', () => {
  const result = getResult(boardFrom('XOX XOO OXX'));
  assert.equal(result.type, 'draw');
  assert.equal(getAvailableMoves(boardFrom('XOX XOO OXX')).length, 0);
});

test('a win on the last cell counts as a win, not a draw', () => {
  const result = getResult(boardFrom('XOX OXO OXX'));
  assert.equal(result.type, 'win');
  assert.equal(result.winner, 'X');
});

test('applyMove ignores occupied or invalid cells and never mutates', () => {
  const board = createEmptyBoard();
  const next = applyMove(board, 4, 'X');
  assert.equal(board[4], null);
  assert.equal(next[4], 'X');
  assert.equal(applyMove(next, 4, 'O'), next);
  assert.equal(applyMove(next, 9, 'O'), next);
  assert.equal(applyMove(next, -1, 'O'), next);
});

test('easy AI never picks an occupied cell', () => {
  const board = boardFrom('XO. .X. O..');
  const free = getAvailableMoves(board);
  for (let i = 0; i < 200; i += 1) {
    assert.ok(free.includes(getComputerMove(board, 'easy')));
  }
});

test('medium AI takes a winning move and blocks a losing one', () => {
  assert.equal(getComputerMove(boardFrom('XX. OO. ...'), 'medium'), 5); // win beats block
  assert.equal(getComputerMove(boardFrom('XX. .O. ...'), 'medium'), 2); // block
});

test('hard AI wins when it can and blocks when it must', () => {
  assert.deepEqual(getBestMoves(boardFrom('XX. OO. ...')), [5]);
  assert.deepEqual(getBestMoves(boardFrom('XX. .O. ...')), [2]);
});

test('hard AI prefers the faster win', () => {
  // O can win now at 2, or set up a win later. It must take the immediate win.
  assert.deepEqual(getBestMoves(boardFrom('XX. OO. X..')), [5]);
});

test('hard AI never loses to any sequence of human moves', () => {
  for (const rngValue of [0, 0.5, 0.99]) {
    const rng = () => rngValue;
    const explore = (board) => {
      for (const move of getAvailableMoves(board)) {
        const afterHuman = applyMove(board, move, 'X');
        const r1 = getResult(afterHuman);
        if (r1) {
          assert.notEqual(r1.winner, 'X', 'human must never win');
          continue;
        }
        const reply = getComputerMove(afterHuman, 'hard', rng);
        const afterComputer = applyMove(afterHuman, reply, 'O');
        assert.notEqual(afterComputer, afterHuman, 'computer must play a legal move');
        const r2 = getResult(afterComputer);
        if (r2) {
          assert.notEqual(r2.winner, 'X');
          continue;
        }
        explore(afterComputer);
      }
    };
    explore(createEmptyBoard());
  }
});

test('statistics: wins, draws, streaks and win percentage', () => {
  let stats = defaultStats();
  for (const winner of ['X', 'X', 'O', null, 'X']) stats = recordResult(stats, winner);
  assert.deepEqual(stats, { games: 5, xWins: 3, oWins: 1, draws: 1, streak: 1, bestStreak: 2 });
  assert.equal(winPercentage(stats), 60);
  assert.equal(winPercentage(defaultStats()), 0);
  assert.ok(isValidStats(stats));
});

test('statistics validation rejects tampered data', () => {
  assert.equal(isValidStats({ games: 3, xWins: 1, oWins: 1, draws: 0, streak: 0, bestStreak: 0 }), false);
  assert.equal(isValidStats({ games: -1 }), false);
  assert.equal(isValidStats(null), false);
  assert.equal(isValidStats('nope'), false);
});

test('history keeps the newest matches and respects the limit', () => {
  let history = [];
  for (let i = 0; i < MAX_HISTORY + 5; i += 1) {
    history = addMatch(history, {
      id: `m${i}`, result: 'draw', mode: 'two', difficulty: null, at: new Date().toISOString(), moves: 9,
    });
  }
  assert.equal(history.length, MAX_HISTORY);
  assert.equal(history[0].id, `m${MAX_HISTORY + 4}`);
  assert.ok(isValidHistory(history));
  assert.equal(isValidHistory([{ id: 1 }]), false);
});
