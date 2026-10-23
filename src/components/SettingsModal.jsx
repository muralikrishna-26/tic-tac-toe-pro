import Modal from './Modal.jsx';
import { CloseIcon } from './Icons.jsx';

export default function SettingsModal({ open, onClose, theme, onThemeChange, soundOn, onSoundChange, onRequestReset, storageOk }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="settings-title">
      <div className="modal-head">
        <h2 id="settings-title" className="modal-title">Settings</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close settings" data-autofocus>
          <CloseIcon />
        </button>
      </div>

      <div className="setting-row">
        <div>
          <p className="setting-name">Theme</p>
          <p className="setting-hint">Dark charcoal or warm light.</p>
        </div>
        <div className="segmented" role="group" aria-label="Theme">
          {['dark', 'light'].map((t) => (
            <button
              key={t}
              type="button"
              className={`segmented-btn ${theme === t ? 'is-selected' : ''}`}
              aria-pressed={theme === t}
              onClick={() => onThemeChange(t)}
            >
              {t === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <div>
          <p className="setting-name" id="sound-label">Sound effects</p>
          <p className="setting-hint">Short tones for moves and results.</p>
        </div>
        <button
          type="button"
          role="switch"
          className="switch"
          aria-checked={soundOn}
          aria-labelledby="sound-label"
          onClick={() => onSoundChange(!soundOn)}
        >
          <span className="switch-thumb" />
        </button>
      </div>

      <div className="setting-row">
        <div>
          <p className="setting-name">Score and history</p>
          <p className="setting-hint">Clear the scoreboard, statistics and match history.</p>
        </div>
        <button type="button" className="btn btn-danger-outline" onClick={onRequestReset}>Reset</button>
      </div>

      {!storageOk && (
        <p className="setting-warning">
          Saving is unavailable in this browser, so your score will be lost when you close the page.
        </p>
      )}
    </Modal>
  );
}
