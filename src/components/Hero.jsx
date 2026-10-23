import { MarkO, MarkX } from './Marks.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow reveal" style={{ '--i': 0 }}>A classic, refined</p>
          <h1 id="hero-title" className="hero-title reveal" style={{ '--i': 1 }}>
            Think Ahead. <em>Play Smart.</em>
          </h1>
          <p className="hero-text reveal" style={{ '--i': 2 }}>
            Tic-Tac-Toe Pro turns a familiar game into a calm, focused experience. Challenge a friend on
            the same screen, or test yourself against a computer that can play a perfect game.
          </p>
          <div className="hero-actions reveal" style={{ '--i': 3 }}>
            <a className="btn btn-primary" href="#play">Start Playing</a>
            <a className="btn btn-secondary" href="#how-to-play">How to Play</a>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-tile"><MarkX /></div>
          <div className="art-tile"><MarkO /></div>
          <div className="art-tile"><MarkO /></div>
          <div className="art-tile"><MarkX /></div>
        </div>
      </div>
    </section>
  );
}
