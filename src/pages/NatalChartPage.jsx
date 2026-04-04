import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import NatalChart from '../components/hero/NatalChart';
import GlassCard from '../components/common/GlassCard';
import PlanetRow from '../components/common/PlanetRow';
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

      <GlassCard className={styles.planetsCard}>
        <p className={styles.planetsHint}>Tap a planet to read more.</p>
        {chart.planets.map((p) => (
          <PlanetRow key={p.id} planet={p} />
        ))}
      </GlassCard>
    </div>
  );
}
