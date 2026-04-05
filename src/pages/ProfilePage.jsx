import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { computeNatalChart } from '../engine/natal';
import { loadReflections, deleteReflection, getChakraCounts, getThemeCounts } from '../utils/reflectionStore';
import { THEMES } from '../engine/themes';
import { CHAKRAS } from '../engine/chakras';
import CosmicDNA from '../components/hero/CosmicDNA';
import Constellation from '../components/hero/Constellation';
import GlassCard from '../components/common/GlassCard';
import styles from './ProfilePage.module.css';

const SOURCE_LABEL = {
  journal: 'Journal',
  practice: 'Practice',
  relations: 'Relations',
};

export default function ProfilePage() {
  const { profile, getDerivedData, resetProfile, theme, toggleTheme } = useUser();
  const [confirmReset, setConfirmReset] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    setEntries(loadReflections());
  }, []);

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

  const handleSelectStar = (entry) => setSelectedEntry(entry);
  const handleDeleteSelected = () => {
    if (!selectedEntry) return;
    const next = deleteReflection(selectedEntry.id);
    setEntries(next);
    setSelectedEntry(null);
  };

  const chakraCounts = useMemo(() => getChakraCounts(), [entries]);
  const themeCounts = useMemo(() => getThemeCounts(), [entries]);
  const topChakra = useMemo(() => {
    const sorted = Object.entries(chakraCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? CHAKRAS.find((c) => c.id === sorted[0][0]) : null;
  }, [chakraCounts]);
  const topTheme = themeCounts[0] ? THEMES.find((t) => t.id === themeCounts[0].id) : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Profile</p>
        <h1 className={styles.title}>Your signature</h1>
      </header>

      <CosmicDNA chart={chart} chakra={chakra} size={340} />

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

      {/* Your trace — constellation of reflections */}
      <GlassCard className={styles.traceCard}>
        <div className={styles.traceHeader}>
          <span className={styles.cardLabel}>Your trace</span>
          <span className={styles.traceCount}>
            {entries.length} {entries.length === 1 ? 'reflection' : 'reflections'}
          </span>
        </div>

        <Constellation entries={entries} onSelect={handleSelectStar} />

        {entries.length > 0 && (
          <div className={styles.traceSummary}>
            {topChakra && (
              <p className={styles.traceLine}>
                Most written from{' '}
                <span style={{ color: topChakra.hex }}>{topChakra.name.toLowerCase()}</span>
                {' · '}
                {chakraCounts[topChakra.id]} {chakraCounts[topChakra.id] === 1 ? 'entry' : 'entries'}
              </p>
            )}
            {topTheme && (
              <p className={styles.traceLine}>
                Recurring theme:{' '}
                <span style={{ color: `var(--chakra-${topTheme.chakraId})` }}>{topTheme.label}</span>
                {' · '}
                {themeCounts[0].count} {themeCounts[0].count === 1 ? 'time' : 'times'}
              </p>
            )}
          </div>
        )}

        {selectedEntry && (
          <div className={styles.starDetail}>
            <div className={styles.starDetailHeader}>
              <span className={styles.starDate}>
                {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <button
                className={styles.starClose}
                onClick={() => setSelectedEntry(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.starMeta}>
              <span style={{ color: `var(--chakra-${selectedEntry.chakraId})` }}>
                {selectedEntry.chakraName}
              </span>
              {selectedEntry.age != null && <span> · age {selectedEntry.age}</span>}
              {selectedEntry.source && <span> · {SOURCE_LABEL[selectedEntry.source] || selectedEntry.source}</span>}
              {selectedEntry.sourceMeta?.friendName && <span> · {selectedEntry.sourceMeta.friendName}</span>}
              {selectedEntry.sourceMeta?.chakraReadingName && (
                <span> · reading {selectedEntry.sourceMeta.chakraReadingName}</span>
              )}
            </div>
            <p className={styles.starText}>{selectedEntry.text}</p>
            {selectedEntry.themes && selectedEntry.themes.length > 0 && (
              <div className={styles.starThemes}>
                {selectedEntry.themes.map((t) => {
                  const theme = THEMES.find((x) => x.id === t);
                  if (!theme) return null;
                  return (
                    <span
                      key={t}
                      className={styles.starTheme}
                      style={{ color: `var(--chakra-${theme.chakraId})` }}
                    >
                      {theme.label}
                    </span>
                  );
                })}
              </div>
            )}
            <button className={styles.starDeleteBtn} onClick={handleDeleteSelected}>
              remove
            </button>
          </div>
        )}

        {entries.length === 0 && (
          <p className={styles.traceHint}>
            Write in Journal, Relations, or after reading a chakra — your stars
            will appear here over time.
          </p>
        )}
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
