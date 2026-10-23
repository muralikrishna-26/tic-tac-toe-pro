import { HUMAN_PLAYER, COMPUTER_PLAYER } from './players.js';
import { applyMove, findWinner, getAvailableMoves } from './gameLogic.js';

const pickRandom = (list, rng) => list[Math.floor(rng() * list.length)];

// Finds a move that makes `player` win right now (or null).
function findWinningMove(board, player) {
  for (const move of getAvailableMoves(board)) {
    const test = applyMove(board, move, player);
    if (findWinner(test)?.winner === player) return move;
  }
  return null;
}

// EASY: any empty cell, chosen at random.
function easyMove(board, rng) {
  return pickRandom(getAvailableMoves(board), rng);
}

// MEDIUM: win if possible, block if needed, otherwise centre, corner, then any cell.
function mediumMove(board, rng) {
  const win = findWinningMove(board, COMPUTER_PLAYER);
  if (win !== null) return win;

  const block = findWinningMove(board, HUMAN_PLAYER);
  if (block !== null) return block;

  const available = getAvailableMoves(board);
  if (available.includes(4)) return 4;

  const corners = available.filter((i) => [0, 2, 6, 8].includes(i));
  if (corners.length > 0) return pickRandom(corners, rng);

  return pickRandom(available, rng);
}

// HARD: minimax.
//
// How minimax works, in simple words:
// 1. The computer imagines every possible way the game could continue.
// 2. When a game ends, it gives that ending a score:
//      computer wins -> positive, human wins -> negative, draw -> 0.
// 3. Winning sooner scores higher (10 - depth) and losing later scores
//    better than losing sooner (depth - 10). "depth" = moves from now.
// 4. On the computer's turn it picks the move with the HIGHEST score (max).
//    On the human's turn it assumes the human picks the LOWEST score (min).
// 5. Scores travel back up the tree, so the first move is chosen as if both
//    sides play perfectly. Tic-Tac-Toe is small enough to search fully.
function minimax(board, player, depth) {
  const win = findWinner(board);
  if (win) return win.winner === COMPUTER_PLAYER ? 10 - depth : depth - 10;

  const moves = getAvailableMoves(board);
  if (moves.length === 0) return 0; // draw

  const nextPlayer = player === COMPUTER_PLAYER ? HUMAN_PLAYER : COMPUTER_PLAYER;
  const scores = moves.map((move) => minimax(applyMove(board, move, player), nextPlayer, depth + 1));
  return player === COMPUTER_PLAYER ? Math.max(...scores) : Math.min(...scores);
}

// All moves that share the best minimax score for the computer.
export function getBestMoves(board) {
  const moves = getAvailableMoves(board);
  const scored = moves.map((move) => ({
    move,
    score: minimax(applyMove(board, move, COMPUTER_PLAYER), HUMAN_PLAYER, 1),
  }));
  const best = Math.max(...scored.map((s) => s.score));
  return scored.filter((s) => s.score === best).map((s) => s.move);
}

function hardMove(board, rng) {
  // Every move in this list is equally perfect; picking randomly adds variety.
  return pickRandom(getBestMoves(board), rng);
}

// Returns the cell index the computer (O) should play, or null if the board is full.
export function getComputerMove(board, difficulty, rng = Math.random) {
  if (getAvailableMoves(board).length === 0) return null;
  if (difficulty === 'hard') return hardMove(board, rng);
  if (difficulty === 'medium') return mediumMove(board, rng);
  return easyMove(board, rng);
}
