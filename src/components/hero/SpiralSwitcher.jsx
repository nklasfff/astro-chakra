import styles from './SpiralSwitcher.module.css';

const SPIRALS = [
  { n: 1, label: 'Formation' },
  { n: 2, label: 'Integration' },
  { n: 3, label: 'Mastery' },
];

/**
 * Three quiet dots indicating which spiral is being viewed.
 * Tap a dot to jump to that spiral.
 */
export default function SpiralSwitcher({ viewSpiral = 1, onSelect }) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Spiral">
      {SPIRALS.map(({ n, label }) => {
        const active = n === viewSpiral;
        return (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.item} ${active ? styles.active : ''}`}
            onClick={() => onSelect && onSelect(n)}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
