// Changing the key makes React replace the element, which replays the CSS "pop" animation.
export default function AnimatedNumber({ value, className = '' }) {
  return (
    <span key={String(value)} className={`num ${className}`.trim()}>
      {value}
    </span>
  );
}
