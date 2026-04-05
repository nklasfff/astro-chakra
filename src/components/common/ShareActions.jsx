import { useState } from 'react';
import styles from './ShareActions.module.css';

/**
 * Tiny pair of icon buttons — save and share.
 * `onSave` persists a snapshot (callback decides what to save).
 * `onShare` provides text that will be shared via the Web Share API,
 * with a clipboard fallback.
 */
export default function ShareActions({ onSave, shareText, saveLabel = 'Keep', shareLabel = 'Share' }) {
  const [savedFlash, setSavedFlash] = useState(false);
  const [copiedFlash, setCopiedFlash] = useState(false);

  const handleSave = () => {
    if (!onSave) return;
    onSave();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const handleShare = async () => {
    if (!shareText) return;
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled — fall through to clipboard
        return;
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 1800);
    } catch {
      // no-op
    }
  };

  return (
    <div className={styles.wrap}>
      {onSave && (
        <button
          className={styles.btn}
          onClick={handleSave}
          title={saveLabel}
          aria-label={saveLabel}
        >
          <BookmarkIcon />
          <span className={styles.label}>
            {savedFlash ? 'kept' : saveLabel.toLowerCase()}
          </span>
        </button>
      )}
      {shareText && (
        <button
          className={styles.btn}
          onClick={handleShare}
          title={shareLabel}
          aria-label={shareLabel}
        >
          <ShareIcon />
          <span className={styles.label}>
            {copiedFlash ? 'copied' : shareLabel.toLowerCase()}
          </span>
        </button>
      )}
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
