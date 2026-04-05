import { useState, useMemo } from 'react';
import { computeCurrentSky, getMoonPhase } from '../engine/transits';
import { formatDegree } from '../engine/zodiac';
import { useUser } from '../context/UserContext';
import { calculateAge } from '../utils/dateUtils';
import { getJourneyPosition } from '../engine/chakraJourney';
import { addReflection } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import PlanetRow from '../components/common/PlanetRow';
import ShareActions from '../components/common/ShareActions';
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
  const { profile } = useUser();

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

  // Short share summary + save snapshot
  const shareText = `The sky on ${dateLabel}: ${sky.sun.sign.glyph} Sun in ${sky.sun.sign.name}, ${sky.moon.sign.glyph} Moon in ${sky.moon.sign.name} (${moonPhase.name}).`;

  const handleSaveSnapshot = () => {
    const text = shareText;
    let chakraId = null, chakraName = null, age = null, spiral = null;
    if (profile?.birthDate) {
      age = calculateAge(profile.birthDate.year, profile.birthDate.month, profile.birthDate.day);
      const pos = getJourneyPosition(age);
      chakraId = pos.primary.id;
      chakraName = pos.primary.name;
      spiral = pos.spiral;
    }
    addReflection({
      text,
      themes: [],
      source: 'time',
      chakraId,
      chakraName,
      age,
      spiral,
      sourceMeta: { date, dateLabel, sunSign: sky.sun.sign.name, moonSign: sky.moon.sign.name, moonPhase: moonPhase.name },
    });
  };

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

      <div className={styles.actions}>
        <ShareActions
          onSave={handleSaveSnapshot}
          shareText={shareText}
        />
      </div>

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
        <p className={styles.sectionHint}>Tap a planet to read more.</p>
        {sky.planets.map((p) => (
          <PlanetRow key={p.id} planet={p} />
        ))}
      </div>
    </div>
  );
}
