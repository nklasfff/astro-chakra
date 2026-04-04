import { useState } from 'react';
import { formatDegree } from '../../engine/zodiac';
import styles from './PlanetRow.module.css';

/**
 * A tap-to-reveal planet row. Collapsed: glyph + name + sign. Expanded:
 * adds a short description pairing the planet's domain with the sign's mode.
 */
export default function PlanetRow({ planet, variant = 'compact' }) {
  const [open, setOpen] = useState(false);
  const chakraColor = `var(--chakra-${planet.chakra})`;

  return (
    <div
      className={`${styles.row} ${open ? styles.rowOpen : ''} ${variant === 'stacked' ? styles.stacked : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.head}>
        <span className={styles.glyph} style={{ color: chakraColor }}>
          {planet.glyph}
        </span>
        <span className={styles.name}>{planet.name}</span>
        <span className={styles.sign}>
          <span style={{ color: chakraColor }}>{planet.sign.glyph}</span>{' '}
          {planet.sign.name} {formatDegree(planet.degreeInSign)}
        </span>
        <span className={styles.chevron}>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className={styles.body}>
          <p className={styles.domain}>{planet.domain}</p>
          <p className={styles.mode}>{planet.sign.mode}</p>
        </div>
      )}
    </div>
  );
}
