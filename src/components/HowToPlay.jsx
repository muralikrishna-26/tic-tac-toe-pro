const EXAMPLES = [
  { title: 'Three in a row', note: 'Any of the 3 rows', cells: [3, 4, 5] },
  { title: 'Three in a column', note: 'Any of the 3 columns', cells: [1, 4, 7] },
  { title: 'Three on a diagonal', note: 'Either of the 2 diagonals', cells: [0, 4, 8] },
];

function MiniBoard({ cells }) {
  return (
    <div className="mini-board" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={cells.includes(i) ? 'is-lit' : ''} />
      ))}
    </div>
  );
}

export default function HowToPlay() {
  return (
    <section className="section" id="how-to-play" aria-labelledby="how-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">How to Play</p>
          <h2 id="how-title" className="section-title">Simple rules, deep thinking</h2>
        </header>

        <div className="howto-grid">
          <div className="card howto-card reveal-scroll">
            <h3 className="howto-heading">The rules</h3>
            <ol className="rules">
              <li>The board has 9 squares. Player X always goes first.</li>
              <li>Players take turns placing their mark in an empty square.</li>
              <li>The first player to get three marks in a line wins.</li>
              <li>If all 9 squares fill up and nobody has a line, it is a draw.</li>
              <li>Against the computer, you are X and the computer is O.</li>
            </ol>
          </div>

          <div className="card howto-card reveal-scroll">
            <h3 className="howto-heading">Winning combinations</h3>
            <ul className="examples">
              {EXAMPLES.map((example) => (
                <li className="example" key={example.title}>
                  <MiniBoard cells={example.cells} />
                  <div>
                    <p className="example-title">{example.title}</p>
                    <p className="example-note">{example.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
