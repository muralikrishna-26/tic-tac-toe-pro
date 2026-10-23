// Pure game rules. No React in this file, so it is easy to test.
// The board is an array of 9 cells: null, 'X' or 'O'. Index layout:
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export const createEmptyBoard = () => Array(9).fill(null);

// X always starts, so an even number of moves means it is X's turn.
export const getPlayerForTurn = (moveCount) => (moveCount % 2 === 0 ? 'X' : 'O');

export function getAvailableMoves(board) {
  const moves = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}

// Returns { winner, line } when three in a row exist, otherwise null.
export function findWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

// Returns a win, a draw, or null while the game is still going.
export function getResult(board) {
  const win = findWinner(board);
  if (win) return { type: 'win', winner: win.winner, line: win.line };
  if (getAvailableMoves(board).length === 0) return { type: 'draw', winner: null, line: [] };
  return null;
}

// Returns a NEW board. If the move is not legal it returns the same board untouched.
export function applyMove(board, index, player) {
  if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] !== null) return board;
  const next = [...board];
  next[index] = player;
  return next;
}
