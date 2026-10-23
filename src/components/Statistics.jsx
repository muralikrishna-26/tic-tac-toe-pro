import AnimatedNumber from './AnimatedNumber.jsx';
import { winPercentage } from '../utils/statistics.js';

export default function Statistics({ stats }) {
  const items = [
    ['Games played', stats.games],
    ['X wins', stats.xWins],
    ['O wins', stats.oWins],
    ['Draws', stats.draws],
    ['Win rate (X)', `${winPercentage(stats)}%`],
    ['Current win streak', stats.streak],
    ['Best win streak', stats.bestStreak],
  ];

  return (
    <section className="section" id="statistics" aria-labelledby="stats-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Statistics</p>
          <h2 id="stats-title" className="section-title">Your results, at a glance</h2>
          <p className="section-sub">
            Calculated from every finished round. Streaks and win rate follow Player X (you, in computer mode).
          </p>
        </header>
        <dl className="stats-grid">
          {items.map(([label, value]) => (
            <div className="stat-card card reveal-scroll" key={label}>
              <dt className="stat-label">{label}</dt>
              <dd className="stat-value"><AnimatedNumber value={value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
