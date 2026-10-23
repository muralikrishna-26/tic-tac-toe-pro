import { Mark } from './Marks.jsx';

export default function GameCell({
  index, value, isWinning, winOrder, isRejected, isLocked,
  tabIndex, buttonRef, onClick, onKeyDown, onFocus, onAnimationEnd,
}) {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  const label = `Row ${row}, column ${column}, ${value ?? 'empty'}${isWinning ? ', winning square' : ''}`;

  const classes = [
    'cell',
    value && 'is-filled',
    isWinning && 'is-win',
    isRejected && 'is-rejected',
    !value && !isLocked && 'is-playable',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      ref={buttonRef}
      className={classes}
      style={{ '--i': index, '--w': winOrder }}
      aria-label={label}
      aria-disabled={isLocked || value !== null}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onAnimationEnd={onAnimationEnd}
    >
      <span className="cell-face">{value && <Mark player={value} />}</span>
    </button>
  );
}
