import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { getJourneyPosition, getSpiralLabel, getSpiralMeaning } from '../engine/chakraJourney';
import { getChakraStates, hasChakraStates } from '../engine/chakraStates';
import JourneyTimeline from '../components/hero/JourneyTimeline';
import SpiralSwitcher from '../components/hero/SpiralSwitcher';
import GlassCard from '../components/common/GlassCard';
import ExpandableCard from '../components/common/ExpandableCard';
import styles from './JourneyPage.module.css';

const MAX_AGE = 146; // 3 spirals × 49 years - 1
const spiralForAge = (age) => Math.min(3, Math.max(1, Math.floor(age / 49) + 1));

export default function JourneyPage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const currentAge = data?.age ?? null;
  const [selectedAge, setSelectedAge] = useState(currentAge);
  // Which spiral the figure is showing. Follows selectedAge by default,
  // but can be overridden by tapping the SpiralSwitcher.
  const [viewSpiralOverride, setViewSpiralOverride] = useState(null);

  const position = useMemo(
    () => (selectedAge != null ? getJourneyPosition(selectedAge) : null),
    [selectedAge]
  );

  if (!data || !position) return null;

  const { primary, sub, spiral, yearInDecade, ageRange, isSamePrimaryAndSub } = position;
  const primaryStates = hasChakraStates(primary.id) ? getChakraStates(primary.id) : null;
  const subStates = hasChakraStates(sub.id) ? getChakraStates(sub.id) : null;

  // The spiral actually rendered in the figure.
  // If the user has tapped a spiral dot AND the selected age is already in
  // that spiral, respect it; otherwise follow the selected age.
  const selectedSpiral = spiralForAge(selectedAge);
  const activeSpiral =
    viewSpiralOverride && viewSpiralOverride === selectedSpiral
      ? viewSpiralOverride
      : selectedSpiral;
  const isViewingCurrent = selectedAge === currentAge;

  const handleSelectSpiral = (s) => {
    setViewSpiralOverride(s);
    // Jump selectedAge to the user's own age if it falls in this spiral,
    // otherwise to the first year of the spiral.
    if (currentAge != null && spiralForAge(currentAge) === s) {
      setSelectedAge(currentAge);
    } else {
      setSelectedAge((s - 1) * 49);
    }
  };

  const handleSetSelectedAge = (next) => {
    setViewSpiralOverride(null);
    setSelectedAge(next);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Journey</p>
        <h1 className={styles.title}>Seven centres, moving</h1>
        <p className={styles.subtitle}>
          The chakras are not static. Each one forms, modulates, and returns.
        </p>
      </header>

      <SpiralSwitcher activeSpiral={activeSpiral} onSelect={handleSelectSpiral} />

      <JourneyTimeline
        spiral={activeSpiral}
        currentAge={currentAge}
        selectedAge={selectedAge}
        onSelectAge={handleSetSelectedAge}
        size={340}
      />

      {/* Age scrubber with quick jump buttons */}
      <div className={styles.scrubber}>
        <button
          className={styles.scrubBtn}
          onClick={() => handleSetSelectedAge(Math.max(0, selectedAge - 1))}
          aria-label="Previous year"
        >
          ‹
        </button>
        <div className={styles.scrubCenter}>
          <span className={styles.scrubAge}>age {selectedAge}</span>
          {!isViewingCurrent && (
            <button className={styles.scrubReset} onClick={() => handleSetSelectedAge(currentAge)}>
              back to now
            </button>
          )}
        </div>
        <button
          className={styles.scrubBtn}
          onClick={() => handleSetSelectedAge(Math.min(MAX_AGE, selectedAge + 1))}
          aria-label="Next year"
        >
          ›
        </button>
      </div>

      {/* Primary chakra — the decade */}
      <GlassCard className={styles.positionCard} glowColor={`${primary.hex}40`}>
        <span className={styles.cardLabel}>The decade you are in</span>
        <div className={styles.positionRow}>
          <span className={styles.posDevanagari} style={{ color: primary.hex }}>
            {primary.devanagari}
          </span>
          <div>
            <h2 className={styles.posName} style={{ color: primary.hex }}>
              {primary.name}
            </h2>
            <p className={styles.posMeta}>
              Ages {ageRange.start}–{ageRange.end} · {primary.theme}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Sub-chakra — the year */}
      <GlassCard className={styles.positionCard} glowColor={`${sub.hex}30`}>
        <span className={styles.cardLabel}>
          Year {yearInDecade + 1} — the chakra within the chakra
        </span>
        <div className={styles.positionRow}>
          <span className={styles.posDevanagari} style={{ color: sub.hex }}>
            {sub.devanagari}
          </span>
          <div>
            <h2 className={styles.posName} style={{ color: sub.hex }}>
              {isSamePrimaryAndSub
                ? `${sub.name} pure`
                : `${sub.name} within ${primary.name}`}
            </h2>
            {subStates?.subChakra?.bodyTemplate && (
              <p className={styles.posBody}>{subStates.subChakra.bodyTemplate}</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Spiral context */}
      <GlassCard className={styles.spiralCard}>
        <span className={styles.cardLabel}>
          Spiral {spiral} · {getSpiralLabel(spiral)}
        </span>
        <p className={styles.spiralBody}>{getSpiralMeaning(spiral)}</p>
      </GlassCard>

      {/* Deep content — tap to reveal */}
      {primaryStates && (
        <>
          <h3 className={styles.sectionTitle}>{primary.name} in depth</h3>

          <ExpandableCard
            label="Formation"
            title={primaryStates.formation.title}
          >
            <p className={styles.bodyText}>{primaryStates.formation.body}</p>
          </ExpandableCard>

          <ExpandableCard
            label="How it returns"
            title={primaryStates.revisit.title}
          >
            <p className={styles.bodyText}>
              <strong className={styles.stateLabel}>Spiral 2.</strong>{' '}
              {primaryStates.revisit.spiral2}
            </p>
            <p className={styles.bodyText}>
              <strong className={styles.stateLabel}>Any age.</strong>{' '}
              {primaryStates.revisit.anytime}
            </p>
          </ExpandableCard>

          <ExpandableCard
            label="When deficient"
            title={primaryStates.states.deficient.title}
          >
            <p className={styles.bodyText}>{primaryStates.states.deficient.body}</p>
            <ul className={styles.signList}>
              {primaryStates.states.deficient.signs.map((s, i) => (
                <li key={i} className={styles.signItem}>· {s}</li>
              ))}
            </ul>
          </ExpandableCard>

          <ExpandableCard
            label="When balanced"
            title={primaryStates.states.balanced.title}
            glowColor={`${primary.hex}20`}
          >
            <p className={styles.bodyText}>{primaryStates.states.balanced.body}</p>
            <ul className={styles.signList}>
              {primaryStates.states.balanced.signs.map((s, i) => (
                <li key={i} className={styles.signItem}>· {s}</li>
              ))}
            </ul>
          </ExpandableCard>

          <ExpandableCard
            label="When excessive"
            title={primaryStates.states.excessive.title}
          >
            <p className={styles.bodyText}>{primaryStates.states.excessive.body}</p>
            <ul className={styles.signList}>
              {primaryStates.states.excessive.signs.map((s, i) => (
                <li key={i} className={styles.signItem}>· {s}</li>
              ))}
            </ul>
          </ExpandableCard>

          <ExpandableCard
            label="To sit with"
            title="Reflection"
          >
            <div className={styles.prompts}>
              {primaryStates.reflectionPrompts.map((p, i) => (
                <p key={i} className={styles.prompt}>{p}</p>
              ))}
            </div>
          </ExpandableCard>
        </>
      )}

      {!primaryStates && (
        <p className={styles.comingSoon}>
          Deep content for {primary.name.toLowerCase()} is being written.
        </p>
      )}
    </div>
  );
}
