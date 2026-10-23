import { useEffect, useState } from 'react';
import { CloseIcon, GearIcon, MenuIcon, MoonIcon, SunIcon, VolumeOffIcon, VolumeOnIcon } from './Icons.jsx';

const LINKS = [
  { href: '#play', label: 'Play' },
  { href: '#statistics', label: 'Statistics' },
  { href: '#history', label: 'History' },
  { href: '#how-to-play', label: 'How to Play' },
];

export default function Navbar({ theme, onToggleTheme, soundOn, onToggleSound, onOpenSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a className="brand" href="#top" aria-label="Tic-Tac-Toe Pro home">
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <rect width="32" height="32" rx="9" fill="var(--accent)" />
            <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="var(--accent-contrast)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="22" r="4.6" stroke="var(--accent-contrast)" strokeWidth="2.4" fill="none" />
          </svg>
          <span className="brand-name">Tic-Tac-Toe <span>Pro</span></span>
        </a>

        <nav aria-label="Main">
          <ul id="main-nav" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${nextTheme} theme`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Sound on. Press to mute' : 'Sound off. Press to unmute'}
          >
            {soundOn ? <VolumeOnIcon /> : <VolumeOffIcon />}
          </button>
          <button type="button" className="icon-btn" onClick={onOpenSettings} aria-label="Open settings">
            <GearIcon />
          </button>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
