import { useState } from 'react';
import TimePage from './TimePage';
import RelationsPage from './RelationsPage';
import styles from './MovementPage.module.css';

/**
 * Unified "Movement" page — everything about the sky moving: today's sky
 * (transits), time-travel to any date, and synastry between charts.
 * Sub-navigation via tabs.
 */
export default function MovementPage() {
  const [view, setView] = useState('today');

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${view === 'today' ? styles.tabActive : ''}`}
          onClick={() => setView('today')}
        >
          Today
        </button>
        <button
          className={`${styles.tab} ${view === 'dates' ? styles.tabActive : ''}`}
          onClick={() => setView('dates')}
        >
          Any date
        </button>
        <button
          className={`${styles.tab} ${view === 'relations' ? styles.tabActive : ''}`}
          onClick={() => setView('relations')}
        >
          Relations
        </button>
      </div>

      {view === 'today' && <TodaySkyView />}
      {view === 'dates' && <TimePage />}
      {view === 'relations' && <RelationsPage />}
    </div>
  );
}

// Minimal Today view — avoids duplicating the full TimePage layout when
// we just want "today" at a glance. For now defers to TimePage.
function TodaySkyView() {
  return <TimePage />;
}
