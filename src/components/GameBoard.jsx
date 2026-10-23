import { useRef, useState } from 'react';
import GameCell from './GameCell.jsx';
import Confetti from './Confetti.jsx';

export default function GameBoard({ board, roundId, result, locked, onPlay }) {
  const cellRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [rejected, setRejected] = useState(null);

  const winLine = result?.type === 'win' ? result.line : [];
  const stateClass = result ? (result.type === 'win' ? 'is-won' : 'is-draw') : '';

  function handleClick(index) {
    if (board[index] !== null) setRejected(index); // plays the "shake" animation
    onPlay(index);
  }

  // Arrow keys move between squares. Enter or Space plays (native button behaviour).
  function handleKeyDown(event, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    let next = null;
    switch (event.key) {
      case 'ArrowRight': next = row * 3 + ((col + 1) % 3); break;
      case 'ArrowLeft': next = row * 3 + ((col + 2) % 3); break;
      case 'ArrowDown': next = ((row + 1) % 3) * 3 + col; break;
      case 'ArrowUp': next = ((row + 2) % 3) * 3 + col; break;
      case 'Home': next = row * 3; break;
      case 'End': next = row * 3 + 2; break;
      default: return;
    }
    event.preventDefault();
    setFocusIndex(next);
    cellRefs.current[next]?.focus();
  }

  return (
    <div className={`board-wrap ${stateClass}`}>
      {/* The key restarts the entrance animation for every new round. */}
      <div className="board" role="group" aria-label="Tic-Tac-Toe board" key={`board-${roundId}`}>
        {board.map((value, index) => (
          <GameCell
            key={index}
            index={index}
            value={value}
            isWinning={winLine.includes(index)}
            winOrder={winLine.indexOf(index)}
            isRejected={rejected === index}
            isLocked={locked}
            tabIndex={focusIndex === index ? 0 : -1}
            buttonRef={(el) => { cellRefs.current[index] = el; }}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusIndex(index)}
            onAnimationEnd={() => setRejected(null)}
          />
        ))}
      </div>
      {result?.type === 'win' && <Confetti key={`confetti-${roundId}`} />}
    </div>
  );
}
