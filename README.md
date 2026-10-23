# Tic-Tac-Toe Pro

A polished, animated Tic-Tac-Toe game built with **React**, **JavaScript (ES6+)** and **CSS3**.
Play with a friend on the same device, or challenge a computer opponent that can play a perfect game using the minimax algorithm.
Everything runs in the browser. There is no backend, no API and no database.

> GitHub repository: `https://github.com/YOUR-USERNAME/tic-tac-toe-pro` (replace with your real URL)

## Features

- Two game modes: **Two Players** (same device) and **Play Against Computer** (you are X, the computer is O)
- Three difficulty levels: **Easy** (random legal moves), **Medium** (wins, blocks, then sensible positions), **Hard** (full minimax, never loses)
- Computer replies after a short delay with a thinking indicator; pending computer moves are cancelled on reset, undo, or mode change
- Undo last move, New Game, Reset Score (with confirmation dialog)
- Scoreboard, statistics (games, X wins, O wins, draws, win rate, current and best win streak) and recent match history (last 20 rounds)
- Winning-cell highlight, drawn X and O strokes, CSS-only confetti, toasts, animated modals, animated theme switch
- Dark and light themes, sound toggle, settings dialog; theme and sound are remembered
- Keyboard accessible: arrow keys move around the board, Enter or Space plays a square
- Responsive layout designed for 320px phones up to 1920px desktops
- Respects `prefers-reduced-motion`
- Graceful fallback when localStorage is blocked or contains invalid data

## Technology stack

React 18, JavaScript (ES6+), JSX, CSS3 (custom properties, keyframes), browser localStorage, Vite.
No TypeScript, Tailwind, Bootstrap, UI component library or animation library. Google Fonts (Inter and Fraunces) are optional; system fonts are used as fallbacks.

## Screenshots

> Replace these placeholders with real screenshots (save them in a `screenshots/` folder).

| Dark theme | Light theme |
| --- | --- |
| `screenshots/dark.png` (placeholder) | `screenshots/light.png` (placeholder) |

| Mobile | Statistics |
| --- | --- |
| `screenshots/mobile.png` (placeholder) | `screenshots/stats.png` (placeholder) |

## Installation

Requires Node.js 18 or newer.

```bash
npm install
```

## Development commands

```bash
npm run dev       # start the development server (http://localhost:5173)
npm test          # run the game-logic tests (Node's built-in test runner)
npm run build     # create the production build in dist/
npm run preview   # preview the production build locally
```

## Production build

```bash
npm run build
```

The `dist/` folder is static and can be uploaded to Netlify, GitHub Pages, Vercel or any static host. The Vite `base` is set to `./`, so it works from a sub-folder too.

## Folder structure

```
tic-tac-toe-pro/
├── public/favicon.svg
├── src/
│   ├── components/   Navbar, Hero, GameBoard, GameCell, ScoreBoard, GameControls,
│   │                 Statistics, MatchHistory, HowToPlay, SettingsModal, ConfirmDialog,
│   │                 Modal, Toast, Confetti, Marks, Icons, AnimatedNumber, Footer
│   ├── hooks/        useGame.js, useLocalStorage.js, useSound.js
│   ├── utils/        gameLogic.js, computerAI.js, statistics.js, players.js
│   ├── styles/       variables.css, animations.css, components.css, responsive.css
│   ├── App.jsx, App.css, index.css, main.jsx
├── test/gameLogic.test.js
├── index.html, package.json, vite.config.js, README.md, .gitignore
```

Game rules live in `src/utils` as pure functions. `useGame` holds the state and side effects. Components only display state and call actions.

## How the minimax AI works

On Hard difficulty the computer imagines every possible continuation of the game. Each finished game gets a score: a computer win is positive, a human win is negative, a draw is 0. Faster wins score higher and slower losses score better than quick losses. On its own turn the computer picks the highest score; on the human's turn it assumes the lowest. Scores travel back up the game tree, so the computer chooses as if both sides play perfectly. Tic-Tac-Toe is tiny, so the full search is instant. When several moves are equally good, one is chosen at random for variety. See `src/utils/computerAI.js`.

## LocalStorage

Only these keys are saved, and no personal information is stored:

| Key | Content |
| --- | --- |
| `ttt:prefs` | theme (`dark` or `light`) and sound on/off |
| `ttt:settings` | game mode and difficulty |
| `ttt:stats` | game counts, win streak and best streak |
| `ttt:history` | the last 20 finished rounds |

Saved data is validated on load. If it is missing, broken or edited into an impossible shape, the app falls back to defaults. If storage is blocked, the game still works and the Settings dialog explains that saving is unavailable.

Streaks and win rate follow Player X (you, in computer mode). A draw or an O win ends the streak.

## Accessibility and responsive design

- Semantic landmarks, headings, and a skip link
- Every board square has a label such as "Row 1, column 2, empty"; the game status is announced with a live region
- Visible, animated focus indicators; disabled states on unavailable buttons
- Modals trap focus, close with Escape, and return focus when closed
- Animations use transform and opacity and are reduced to near-instant when the user prefers reduced motion
- The board stays square at every width; layouts adapt at 900px, 640px and 480px

## Known limitations

- Undo is unavailable after a round ends, because the result has already been recorded.
- In computer mode, Undo takes back both your move and the computer's reply.
- Changing mode or difficulty starts a new round (an unfinished round is not recorded).
- Statistics are stored per browser and cannot sync between devices.
- The automated tests cover game logic, the AI and statistics only. There are no automated UI tests.
- Scroll-triggered entrance animations use CSS `animation-timeline`; browsers without support show the content without that animation.

## Future improvement ideas

- Larger board sizes (4x4, 5x5)
- Optional player names
- Export or import of statistics
- UI tests with React Testing Library

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Tic-Tac-Toe Pro"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tic-tac-toe-pro.git
git push -u origin main
```

Create the empty repository on GitHub first, then replace `YOUR-USERNAME` with your GitHub username. Also update `REPO_URL` in `src/components/Footer.jsx`.

## License

MIT License. Add a `LICENSE` file with your name and the year if you want to publish this under the MIT terms.
