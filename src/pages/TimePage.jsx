import { useState, useMemo } from 'react';
import { computeCurrentSky, getMoonPhase } from '../engine/transits';
import { formatDegree } from '../engine/zodiac';
import GlassCard from '../components/common/GlassCard';
import MoonPhase from '../components/hero/MoonPhase';
import NatalChart from '../components/hero/NatalChart';
import styles from './TimePage.module.css';

function localDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function TimePage() {
  const [date, setDate] = useState(() => localDateString());

  const dateObj = useMemo(() => {
    // Parse YYYY-MM-DD as noon UTC to avoid timezone edge cases
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12, 0));
  }, [date]);

  const sky = useMemo(() => computeCurrentSky(dateObj), [dateObj]);
  const moonPhase = useMemo(() => getMoonPhase(sky.julianDay), [sky.julianDay]);

  const dateLabel = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isToday = date === localDateString();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Time</p>
        <h1 className={styles.title}>The sky, any day</h1>
        <p className={styles.subtitle}>Travel to a date. See what the planets were doing.</p>
      </header>

      <div className={styles.controls}>
        <label className={styles.dateLabel}>
          <span className={styles.dateLabelText}>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
          />
        </label>
        {!isToday && (
          <button
            className={styles.todayBtn}
            onClick={() => setDate(localDateString())}
          >
            Today
          </button>
        )}
      </div>

      <p className={styles.dateDisplay}>{dateLabel}</p>

      <NatalChart chart={sky} size={360} />

      <GlassCard className={styles.moonCard}>
        <div className={styles.moonRow}>
          <MoonPhase phase={moonPhase.phase} size={72} />
          <div className={styles.moonText}>
            <span className={styles.moonLabel}>Moon</span>
            <h2 className={styles.moonTitle}>{moonPhase.name}</h2>
            <p className={styles.moonSub}>
              {sky.moon.sign.glyph} {sky.moon.sign.name} {formatDegree(sky.moon.degreeInSign)}
              {' · '}
              {Math.round(moonPhase.illumination * 100)}% illuminated
            </p>
          </div>
        </div>
      </GlassCard>

      <div className={styles.planets}>
        <h3 className={styles.sectionTitle}>Planets</h3>
        {sky.planets.map((p) => (
          <div key={p.id} className={styles.planetRow}>
            <span className={styles.planetGlyph} style={{ color: `var(--chakra-${p.chakra})` }}>
              {p.glyph}
            </span>
            <span className={styles.planetName}>{p.name}</span>
            <span className={styles.planetSign}>
              {p.sign.glyph} {p.sign.name} {formatDegree(p.degreeInSign)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
