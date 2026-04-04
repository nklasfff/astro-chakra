import { useMemo } from 'react';
import { computeCurrentSky, getMoonPhase } from '../../engine/transits';
import { formatDegree } from '../../engine/zodiac';
import MoonPhase from './MoonPhase';
import GlassCard from '../common/GlassCard';
import styles from './TodaysSky.module.css';

/**
 * A compact "today's sky" summary card — what the luminaries are doing now.
 * Sun sign, moon sign + phase, and a selection of highlighted planets.
 */
export default function TodaysSky({ date = new Date() }) {
  const sky = useMemo(() => computeCurrentSky(date), [date]);
  const moonPhase = useMemo(() => getMoonPhase(sky.julianDay), [sky.julianDay]);

  const sun = sky.sun;
  const moon = sky.moon;

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GlassCard className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Today's sky</span>
        <span className={styles.date}>{dateLabel}</span>
      </div>

      <div className={styles.luminaries}>
        {/* Sun */}
        <div className={styles.luminary}>
          <div className={styles.sunDisc}>
            <span className={styles.glyph} style={{ color: `var(--chakra-${sun.chakra})` }}>
              {sun.glyph}
            </span>
          </div>
          <div className={styles.luminaryText}>
            <span className={styles.luminaryLabel}>Sun</span>
            <span className={styles.luminaryValue}>
              {sun.sign.glyph} {sun.sign.name}
            </span>
            <span className={styles.luminaryDegree}>{formatDegree(sun.degreeInSign)}</span>
          </div>
        </div>

        {/* Moon */}
        <div className={styles.luminary}>
          <MoonPhase phase={moonPhase.phase} size={54} />
          <div className={styles.luminaryText}>
            <span className={styles.luminaryLabel}>{moonPhase.name}</span>
            <span className={styles.luminaryValue}>
              {moon.sign.glyph} {moon.sign.name}
            </span>
            <span className={styles.luminaryDegree}>
              {Math.round(moonPhase.illumination * 100)}% lit
            </span>
          </div>
        </div>
      </div>

      <div className={styles.personal}>
        {['mercury', 'venus', 'mars'].map((id) => {
          const p = sky.planets.find((x) => x.id === id);
          return (
            <div key={id} className={styles.personalRow}>
              <span className={styles.personalGlyph} style={{ color: `var(--chakra-${p.chakra})` }}>
                {p.glyph}
              </span>
              <span className={styles.personalName}>{p.name}</span>
              <span className={styles.personalSign}>
                {p.sign.glyph} {p.sign.name} {formatDegree(p.degreeInSign)}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
