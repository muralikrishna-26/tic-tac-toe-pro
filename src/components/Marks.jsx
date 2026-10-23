// X and O drawn as SVG strokes. CSS animates the stroke so it looks hand-drawn.
// pathLength="1" lets the CSS use simple dash values for any shape.
export function MarkX() {
  return (
    <svg className="mark mark-x" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M26 26 L74 74" pathLength="1" />
      <path d="M74 26 L26 74" pathLength="1" />
    </svg>
  );
}

export function MarkO() {
  return (
    <svg className="mark mark-o" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="27" pathLength="1" />
    </svg>
  );
}

export function Mark({ player }) {
  return player === 'X' ? <MarkX /> : <MarkO />;
}
