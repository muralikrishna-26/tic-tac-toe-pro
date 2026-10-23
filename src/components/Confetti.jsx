// A small, CSS-only confetti burst. The pieces use fixed numbers (no randomness),
// so the component is pure and looks the same on every render.
const PIECES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47) % 100,
  delay: (i % 7) * 60,
  drift: ((i * 29) % 70) - 35,
  rotate: (i * 67) % 360,
  size: 6 + (i % 3) * 2,
  tone: i % 3,
}));

export default function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`confetti-piece tone-${p.tone}`}
          style={{
            '--x': `${p.left}%`,
            '--d': `${p.delay}ms`,
            '--drift': `${p.drift}px`,
            '--r': `${p.rotate}deg`,
            '--s': `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}
