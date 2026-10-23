import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyMove, createEmptyBoard, getPlayerForTurn, getResult } from '../utils/gameLogic.js';
import { getComputerMove } from '../utils/computerAI.js';
import { HUMAN_PLAYER, COMPUTER_PLAYER } from '../utils/players.js';
import { addMatch, defaultStats, isValidHistory, isValidStats, recordResult } from '../utils/statistics.js';
import { useLocalStorage } from './useLocalStorage.js';

export const COMPUTER_DELAY_MS = 650;

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DEFAULT_SETTINGS = { mode: 'two', difficulty: 'medium' };
const DEFAULT_STATS = defaultStats();
const EMPTY_HISTORY = [];

const isValidSettings = (v) =>
  !!v && typeof v === 'object' && ['two', 'computer'].includes(v.mode) && DIFFICULTIES.includes(v.difficulty);

// A round is { id, moves }. The board is always rebuilt from the list of moves,
// so undo is simply "remove the last move(s)".
const newRound = (id) => ({ id, moves: [] });

function boardFromMoves(moves) {
  return moves.reduce((board, m) => applyMove(board, m.index, m.player), createEmptyBoard());
}

// Pure helper: returns the next round, or the SAME round if the move is not allowed.
// This is the single place that protects against duplicate or late moves.
function addMove(round, index, expectedPlayer) {
  const board = boardFromMoves(round.moves);
  if (getResult(board) || board[index] !== null) return round;
  const player = getPlayerForTurn(round.moves.length);
  if (expectedPlayer && player !== expectedPlayer) return round;
  return { ...round, moves: [...round.moves, { index, player }] };
}

function buildStatus({ mode, result, thinking, current }) {
  const vsComputer = mode === 'computer';
  if (result?.type === 'draw') return "It's a draw. Evenly matched.";
  if (result?.type === 'win') {
    if (!vsComputer) return `Player ${result.winner} wins!`;
    return result.winner === HUMAN_PLAYER ? 'You win. Well played!' : 'The computer wins this round.';
  }
  if (thinking) return 'Computer is thinking';
  return vsComputer ? 'Your turn. You are X.' : `Player ${current} to move`;
}

export function useGame({ notify, playSound }) {
  const [settings, setSettings] = useLocalStorage('ttt:settings', DEFAULT_SETTINGS, isValidSettings);
  const [stats, setStats] = useLocalStorage('ttt:stats', DEFAULT_STATS, isValidStats);
  const [history, setHistory] = useLocalStorage('ttt:history', EMPTY_HISTORY, isValidHistory);
  const [round, setRound] = useState(() => newRound(1));

  const { mode, difficulty } = settings;
  const vsComputer = mode === 'computer';

  const board = useMemo(() => boardFromMoves(round.moves), [round.moves]);
  const result = useMemo(() => getResult(board), [board]);
  const current = getPlayerForTurn(round.moves.length);
  const thinking = vsComputer && !result && current === COMPUTER_PLAYER;
  const canUndo = !result && !thinking && round.moves.length > 0;
  const status = buildStatus({ mode, result, thinking, current });

  // ---- Computer move. The cleanup cancels the timer whenever anything changes
  // (new round, mode change, undo, unmount), so stale moves can never happen.
  useEffect(() => {
    if (!thinking) return undefined;
    const roundId = round.id;
    const timer = window.setTimeout(() => {
      const move = getComputerMove(board, difficulty);
      if (move === null) return;
      setRound((prev) => (prev.id === roundId ? addMove(prev, move, COMPUTER_PLAYER) : prev));
    }, COMPUTER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [thinking, board, round.id, difficulty]);

  // ---- Move sound: plays only when a move was added (not on undo or reset).
  const previousLength = useRef(0);
  useEffect(() => {
    const length = round.moves.length;
    if (length > previousLength.current) {
      playSound(round.moves[length - 1].player === 'X' ? 'x' : 'o');
    }
    previousLength.current = length;
  }, [round.moves, playSound]);

  // ---- Record the result exactly once per round.
  const recordedRound = useRef(0);
  useEffect(() => {
    if (!result || recordedRound.current === round.id) return;
    recordedRound.current = round.id;

    const winner = result.type === 'win' ? result.winner : null;
    const match = {
      id: `${Date.now().toString(36)}-${round.id}`,
      result: winner ?? 'draw',
      mode,
      difficulty: vsComputer ? difficulty : null,
      at: new Date().toISOString(),
      moves: round.moves.length,
    };
    setStats((s) => recordResult(s, winner));
    setHistory((h) => addMatch(h, match));
    playSound(winner ? 'win' : 'draw');
  }, [result, round.id, round.moves.length, mode, difficulty, vsComputer, setStats, setHistory, playSound]);

  // ---- Actions
  const play = useCallback(
    (index) => {
      if (result) {
        notify('This round is over. Press New Game to play again.');
        playSound('error');
        return;
      }
      if (thinking) {
        notify("Hold on, it's the computer's turn.");
        playSound('error');
        return;
      }
      if (board[index] !== null) {
        notify('That square is already taken.');
        playSound('error');
        return;
      }
      setRound((prev) => addMove(prev, index, vsComputer ? HUMAN_PLAYER : null));
    },
    [result, thinking, board, vsComputer, notify, playSound]
  );

  const undo = useCallback(() => {
    if (!canUndo) {
      notify(result ? 'Undo is not available after a round ends.' : 'Nothing to undo yet.');
      return;
    }
    // Against the computer, undo takes back the computer's reply AND your move.
    const count = vsComputer ? 2 : 1;
    setRound((prev) => ({ ...prev, moves: prev.moves.slice(0, Math.max(0, prev.moves.length - count)) }));
    playSound('undo');
    notify('Move undone.');
  }, [canUndo, result, vsComputer, notify, playSound]);

  const newGame = useCallback(() => setRound((prev) => newRound(prev.id + 1)), []);

  const setMode = useCallback(
    (nextMode) => {
      if (nextMode === mode) return;
      setSettings((s) => ({ ...s, mode: nextMode }));
      setRound((prev) => newRound(prev.id + 1));
      notify(nextMode === 'computer' ? 'Playing against the computer.' : 'Two players on one device.');
    },
    [mode, setSettings, notify]
  );

  const setDifficulty = useCallback(
    (nextDifficulty) => {
      if (nextDifficulty === difficulty) return;
      setSettings((s) => ({ ...s, difficulty: nextDifficulty }));
      setRound((prev) => newRound(prev.id + 1));
      notify(`Difficulty set to ${nextDifficulty}. New round started.`);
    },
    [difficulty, setSettings, notify]
  );

  const resetStats = useCallback(() => {
    setStats(defaultStats());
    setHistory([]);
    notify('Score and match history reset.');
  }, [setStats, setHistory, notify]);

  return {
    round, board, result, current, thinking, status,
    mode, difficulty, stats, history,
    canUndo, canRestart: round.moves.length > 0,
    play, undo, newGame, setMode, setDifficulty, resetStats,
  };
}
