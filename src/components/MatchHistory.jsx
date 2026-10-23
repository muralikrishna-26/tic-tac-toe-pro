import { MarkX } from './Marks.jsx';
import { MAX_HISTORY, describeMatch, describeMode } from '../utils/statistics.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

export default function MatchHistory({ history }) {
  return (
    <section className="section" id="history" aria-labelledby="history-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">History</p>
          <h2 id="history-title" className="section-title">Recent matches</h2>
          <p className="section-sub">The last {MAX_HISTORY} finished rounds, newest first.</p>
        </header>

        <div className="card history-card reveal-scroll">
          {history.length === 0 ? (
            <div className="empty-state">
              <span className="empty-mark"><MarkX /></span>
              <p className="empty-title">No matches yet</p>
              <p className="empty-text">Finish a round and it will appear here.</p>
            </div>
          ) : (
            <ol className="history-list">
              {history.map((match) => (
                <li className="history-item" key={match.id}>
                  <span className={`badge badge-${match.result === 'draw' ? 'draw' : match.result.toLowerCase()}`}>
                    {match.result === 'draw' ? 'Draw' : match.result}
                  </span>
                  <div className="history-main">
                    <p className="history-title">{describeMatch(match)}</p>
                    <p className="history-meta">{describeMode(match)} &middot; {match.moves} moves</p>
                  </div>
                  <time className="history-time" dateTime={match.at}>{formatDate(match.at)}</time>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
