import AnimatedNumber from './AnimatedNumber.jsx';
import { MarkO, MarkX } from './Marks.jsx';

function PlayerCard({ symbol, name, wins, active, tag }) {
  return (
    <div
      className={`player-card player-${symbol.toLowerCase()} ${active ? 'is-active' : ''}`}
      aria-current={active ? 'true' : undefined}
    >
      <div className="player-head">
        <span className="player-mark">{symbol === 'X' ? <MarkX /> : <MarkO />}</span>
        <span className="player-name">{name}</span>
      </div>
      <AnimatedNumber value={wins} className="player-score" />
      <span className="player-tag">{tag}</span>
    </div>
  );
}

export default function ScoreBoard({ stats, current, over, mode }) {
  const vsComputer = mode === 'computer';
  const xActive = !over && current === 'X';
  const oActive = !over && current === 'O';

  const tagFor = (symbol, active) => {
    if (!active) return '';
    if (!vsComputer) return 'To move';
    return symbol === 'X' ? 'Your move' : 'Thinking';
  };

  return (
    <section className="scoreboard" aria-label="Scoreboard">
      <PlayerCard symbol="X" name={vsComputer ? 'You' : 'Player X'} wins={stats.xWins} active={xActive} tag={tagFor('X', xActive)} />
      <div className="player-card draws-card">
        <div className="player-head"><span className="player-name">Draws</span></div>
        <AnimatedNumber value={stats.draws} className="player-score" />
        <span className="player-tag" />
      </div>
      <PlayerCard symbol="O" name={vsComputer ? 'Computer' : 'Player O'} wins={stats.oWins} active={oActive} tag={tagFor('O', oActive)} />
    </section>
  );
}
