import { getSpiralLabel } from '../../engine/chakraJourney';
import styles from './SpiralSwitcher.module.css';

/**
 * Three dots (● ○ ○) to navigate between the three 49-year spirals.
 * Sits above the JourneyTimeline and mirrors the subdued watercolor palette.
 */
export default function SpiralSwitcher({ activeSpiral, onSelect }) {
  const spirals = [1, 2, 3];

  return (
    <div className={styles.wrap} role="tablist" aria-label="Life spirals">
      {spirals.map((s) => {
        const isActive = s === activeSpiral;
        const label = getSpiralLabel(s);
        const ageRange = `${(s - 1) * 49}–${s * 49 - 1}`;
        return (
          <button
            key={s}
            role="tab"
            aria-selected={isActive}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect && onSelect(s)}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
            <span className={styles.range}>{ageRange}</span>
          </button>
        );
      })}
    </div>
  );
}
