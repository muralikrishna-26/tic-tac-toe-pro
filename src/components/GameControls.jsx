const MODE_OPTIONS = [
  { value: 'two', label: 'Two Players' },
  { value: 'computer', label: 'vs Computer' },
];
const LEVEL_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function Segmented({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented-btn ${value === option.value ? 'is-selected' : ''}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function GameControls({
  mode, difficulty, onModeChange, onDifficultyChange,
  onNewGame, onUndo, onResetScore, canRestart, canUndo, hasStats,
}) {
  return (
    <div className="controls">
      <div className="control-group">
        <span className="control-label">Game mode</span>
        <Segmented label="Game mode" options={MODE_OPTIONS} value={mode} onChange={onModeChange} />
      </div>

      {mode === 'computer' && (
        <div className="control-group reveal-now">
          <span className="control-label">Difficulty</span>
          <Segmented label="Computer difficulty" options={LEVEL_OPTIONS} value={difficulty} onChange={onDifficultyChange} />
        </div>
      )}

      <div className="control-actions">
        <button type="button" className="btn btn-primary" onClick={onNewGame} disabled={!canRestart}>
          New Game
        </button>
        <button type="button" className="btn btn-secondary" onClick={onUndo} disabled={!canUndo}>
          Undo Move
        </button>
        <button type="button" className="btn btn-ghost" onClick={onResetScore} disabled={!hasStats}>
          Reset Score
        </button>
      </div>
    </div>
  );
}
