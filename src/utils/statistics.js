// Pure helpers for statistics and match history.

export const MAX_HISTORY = 20;

export const defaultStats = () => ({
  games: 0,
  xWins: 0,
  oWins: 0,
  draws: 0,
  streak: 0,      // current run of consecutive X wins
  bestStreak: 0,  // longest run of consecutive X wins
});

const isCount = (v) => Number.isInteger(v) && v >= 0;
const MODES = ['two', 'computer'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

// Used when reading localStorage: rejects anything that looks edited or broken.
export function isValidStats(v) {
  if (!v || typeof v !== 'object') return false;
  const keys = ['games', 'xWins', 'oWins', 'draws', 'streak', 'bestStreak'];
  if (!keys.every((k) => isCount(v[k]))) return false;
  return v.games === v.xWins + v.oWins + v.draws && v.bestStreak >= v.streak;
}

// winner: 'X', 'O', or null for a draw. Returns a NEW stats object.
export function recordResult(stats, winner) {
  const next = { ...stats, games: stats.games + 1 };
  if (winner === 'X') {
    next.xWins += 1;
    next.streak = stats.streak + 1;
    next.bestStreak = Math.max(stats.bestStreak, next.streak);
  } else {
    if (winner === 'O') next.oWins += 1;
    else next.draws += 1;
    next.streak = 0;
  }
  return next;
}

export function winPercentage(stats) {
  return stats.games === 0 ? 0 : Math.round((stats.xWins / stats.games) * 100);
}

export function isValidMatch(m) {
  return (
    !!m &&
    typeof m === 'object' &&
    typeof m.id === 'string' &&
    ['X', 'O', 'draw'].includes(m.result) &&
    MODES.includes(m.mode) &&
    (m.difficulty === null || DIFFICULTIES.includes(m.difficulty)) &&
    typeof m.at === 'string' &&
    !Number.isNaN(Date.parse(m.at)) &&
    isCount(m.moves)
  );
}

export const isValidHistory = (v) =>
  Array.isArray(v) && v.length <= MAX_HISTORY && v.every(isValidMatch);

// Newest first, capped at MAX_HISTORY.
export const addMatch = (history, match) => [match, ...history].slice(0, MAX_HISTORY);

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function describeMatch(match) {
  if (match.result === 'draw') return 'Draw';
  if (match.mode === 'computer') return match.result === 'X' ? 'You won' : 'Computer won';
  return `Player ${match.result} won`;
}

export function describeMode(match) {
  return match.mode === 'computer' ? `vs Computer \u00b7 ${capitalize(match.difficulty ?? 'medium')}` : 'Two Players';
}
