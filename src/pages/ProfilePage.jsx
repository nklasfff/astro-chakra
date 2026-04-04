import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import BirthSignature from '../components/hero/BirthSignature';
import GlassCard from '../components/common/GlassCard';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { profile, getDerivedData, resetProfile, theme, toggleTheme } = useUser();
  const [confirmReset, setConfirmReset] = useState(false);

  const data = getDerivedData();
  const chart = useMemo(() => (profile ? computeNatalChart(profile) : null), [profile]);

  if (!profile || !data || !chart) return null;

  const { age, phase } = data;
  const { chakra, spiral, ageRange } = phase;

  const birthDateStr = new Date(
    profile.birthDate.year,
    profile.birthDate.month - 1,
    profile.birthDate.day
  ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const birthTimeStr = profile.birthTime
    ? `${String(profile.birthTime.hour).padStart(2, '0')}:${String(profile.birthTime.minute).padStart(2, '0')}`
    : null;

  const birthPlace = profile.birthLocation?.city
    ? `${profile.birthLocation.city}${profile.birthLocation.country ? ', ' + profile.birthLocation.country : ''}`
    : null;

  const handleReset = () => {
    if (confirmReset) {
      resetProfile();
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Profile</p>
        <h1 className={styles.title}>Your signature</h1>
      </header>

      <BirthSignature sun={chart.sun} moon={chart.moon} chakra={chakra} size={280} />

      <p className={styles.poeticLine}>
        {chart.sun.sign.name} sun, {chart.moon.sign.name} moon, {chakra.name.toLowerCase()} chakra.
      </p>

      <GlassCard className={styles.card} glowColor={`${chakra.hex}30`}>
        <span className={styles.cardLabel}>Current chakra phase</span>
        <h2 className={styles.cardTitle} style={{ color: chakra.hex }}>
          {chakra.devanagari} {chakra.name}
        </h2>
        <p className={styles.cardBody}>
          Age {age}, spiral {spiral}. You are in year {age - ageRange.start + 1} of 7 in this chakra.
        </p>
        <p className={styles.cardMeta}>{chakra.sanskrit} · {chakra.theme}</p>
      </GlassCard>

      <GlassCard className={styles.card}>
        <span className={styles.cardLabel}>Born</span>
        <p className={styles.birthDate}>{birthDateStr}</p>
        {birthTimeStr && <p className={styles.birthDetail}>at {birthTimeStr}</p>}
        {birthPlace && <p className={styles.birthDetail}>in {birthPlace}</p>}
      </GlassCard>

      <Link to="/explore/natal" className={styles.chartLink}>
        <GlassCard className={styles.linkCard}>
          <span className={styles.cardLabel}>Your natal chart</span>
          <h3 className={styles.linkTitle}>The sky you were born under →</h3>
        </GlassCard>
      </Link>

      <GlassCard className={styles.card}>
        <span className={styles.cardLabel}>Settings</span>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Theme</span>
          <button className={styles.settingBtn} onClick={toggleTheme}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Birth details</span>
          <button
            className={`${styles.settingBtn} ${confirmReset ? styles.settingBtnDanger : ''}`}
            onClick={handleReset}
          >
            {confirmReset ? 'Confirm reset' : 'Reset'}
          </button>
        </div>
        {confirmReset && (
          <p className={styles.settingHint}>
            Resetting clears your birth details and returns you to onboarding.
            Tap once more to confirm, or tap anywhere else to cancel.
          </p>
        )}
      </GlassCard>
    </div>
  );
}
