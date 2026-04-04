import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import { formatDegree } from '../engine/zodiac';
import NatalChart from '../components/hero/NatalChart';
import GlassCard from '../components/common/GlassCard';
import styles from './NatalChartPage.module.css';

export default function NatalChartPage() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const chart = useMemo(() => (profile ? computeNatalChart(profile) : null), [profile]);

  if (!chart) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
        <p className={styles.comingSoon}>Enter your birth details to see your chart.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>

      <header className={styles.header}>
        <p className={styles.label}>Your natal chart</p>
        <h1 className={styles.title}>The sky you were born under</h1>
        <p className={styles.subtitle}>
          {chart.sun.sign.glyph} Sun in {chart.sun.sign.name} · {chart.moon.sign.glyph} Moon in {chart.moon.sign.name}
        </p>
      </header>

      <NatalChart chart={chart} size={360} />

      {!chart.hasTime && (
        <p className={styles.note}>
          Without a birth time, this is a solar chart — planetary positions are
          accurate, but houses and the ascendant need a time to be computed.
        </p>
      )}

      <div className={styles.planets}>
        {chart.planets.map((p) => (
          <GlassCard key={p.id} className={styles.planetCard}>
            <div className={styles.planetRow}>
              <span
                className={styles.planetGlyph}
                style={{ color: `var(--chakra-${p.chakra})` }}
              >
                {p.glyph}
              </span>
              <div className={styles.planetText}>
                <div className={styles.planetHeader}>
                  <span className={styles.planetName}>{p.name}</span>
                  <span className={styles.planetChakra}>·  {p.chakra}</span>
                </div>
                <div className={styles.planetSign}>
                  <span style={{ color: `var(--chakra-${p.chakra})` }}>{p.sign.glyph}</span>{' '}
                  {p.sign.name} {formatDegree(p.degreeInSign)}
                </div>
                <p className={styles.planetDomain}>{p.domain}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
