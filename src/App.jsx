import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';
import GameBoard from './components/GameBoard.jsx';
import GameControls from './components/GameControls.jsx';
import Statistics from './components/Statistics.jsx';
import MatchHistory from './components/MatchHistory.jsx';
import HowToPlay from './components/HowToPlay.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import { isStorageAvailable, useLocalStorage } from './hooks/useLocalStorage.js';
import { useSound } from './hooks/useSound.js';
import { useGame } from './hooks/useGame.js';

const DEFAULT_PREFS = { theme: 'dark', sound: true };
const isValidPrefs = (v) =>
  !!v && typeof v === 'object' && (v.theme === 'dark' || v.theme === 'light') && typeof v.sound === 'boolean';

export default function App() {
  const [prefs, setPrefs] = useLocalStorage('ttt:prefs', DEFAULT_PREFS, isValidPrefs);
  const [storageOk] = useState(isStorageAvailable);
  const [toast, setToast] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toastCounter = useRef(0);
  const themeTimer = useRef(null);

  const notify = useCallback((message) => {
    toastCounter.current += 1;
    setToast({ id: toastCounter.current, message });
  }, []);
  const dismissToast = useCallback((id) => setToast((t) => (t && t.id === id ? null : t)), []);

  const playSound = useSound(prefs.sound);
  const game = useGame({ notify, playSound });

  // Apply the theme to the page.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.theme);
  }, [prefs.theme]);

  useEffect(() => () => window.clearTimeout(themeTimer.current), []);

  const setTheme = useCallback(
    (theme) => {
      // A short-lived class lets colours fade smoothly instead of flashing.
      const root = document.documentElement;
      root.classList.add('theme-transition');
      window.clearTimeout(themeTimer.current);
      themeTimer.current = window.setTimeout(() => root.classList.remove('theme-transition'), 350);
      setPrefs((p) => ({ ...p, theme }));
    },
    [setPrefs]
  );
  const setSound = useCallback((sound) => setPrefs((p) => ({ ...p, sound })), [setPrefs]);

  const requestReset = () => {
    setSettingsOpen(false);
    setConfirmOpen(true);
  };
  const confirmReset = () => {
    game.resetStats();
    setConfirmOpen(false);
  };

  const over = game.result !== null;
  const statusClass = over ? (game.result.type === 'win' ? 'is-win' : 'is-draw') : '';

  return (
    <>
      <a className="skip-link" href="#play">Skip to the game</a>
      <Navbar
        theme={prefs.theme}
        onToggleTheme={() => setTheme(prefs.theme === 'dark' ? 'light' : 'dark')}
        soundOn={prefs.sound}
        onToggleSound={() => setSound(!prefs.sound)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main>
        <Hero />

        <section className="section" id="play" aria-labelledby="play-title">
          <div className="container">
            <header className="section-head">
              <p className="eyebrow">Game</p>
              <h2 id="play-title" className="section-title">Play a round</h2>
            </header>

            <div className="game-card card">
              <ScoreBoard stats={game.stats} current={game.current} over={over} mode={game.mode} />

              <div className="game-body">
                <div className="board-panel">
                  <p className={`status ${statusClass}`} role="status" aria-live="polite">
                    <span key={`${game.round.id}-${game.status}`} className="status-text">{game.status}</span>
                    {game.thinking && (
                      <span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>
                    )}
                  </p>
                  <GameBoard
                    board={game.board}
                    roundId={game.round.id}
                    result={game.result}
                    locked={over || game.thinking}
                    onPlay={game.play}
                  />
                </div>

                <GameControls
                  mode={game.mode}
                  difficulty={game.difficulty}
                  onModeChange={game.setMode}
                  onDifficultyChange={game.setDifficulty}
                  onNewGame={game.newGame}
                  onUndo={game.undo}
                  onResetScore={() => setConfirmOpen(true)}
                  canRestart={game.canRestart}
                  canUndo={game.canUndo}
                  hasStats={game.stats.games > 0}
                />
              </div>
            </div>
          </div>
        </section>

        <Statistics stats={game.stats} />
        <MatchHistory history={game.history} />
        <HowToPlay />
      </main>

      <Footer />
      <Toast toast={toast} onDismiss={dismissToast} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={prefs.theme}
        onThemeChange={setTheme}
        soundOn={prefs.sound}
        onSoundChange={setSound}
        onRequestReset={requestReset}
        storageOk={storageOk}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Reset score and history?"
        message="This clears the scoreboard, all statistics and the match history. This cannot be undone."
        confirmLabel="Reset everything"
        onConfirm={confirmReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
