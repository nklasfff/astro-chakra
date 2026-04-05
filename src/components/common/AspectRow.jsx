import { useState } from 'react';
import { getAspectMeaning, ASPECT_MEANINGS } from '../../engine/aspectMeanings';
import styles from './AspectRow.module.css';

/**
 * A tap-to-reveal aspect row. Shows two planets connected by an aspect,
 * with orb. Tapping reveals a short poetic meaning (transit or synastry).
 */
export default function AspectRow({
  leftPlanet,
  rightPlanet,
  leftLabel,
  rightLabel,
  aspect,
  orb,
  exact,
  context = 'transit', // 'transit' or 'synastry'
}) {
  const [open, setOpen] = useState(false);
  const meaning = getAspectMeaning(aspect.id, context);
  const glyph = ASPECT_MEANINGS[aspect.id]?.glyph || '';

  const aspectMood = {
    conjunction: 'fusing',
    sextile: 'supporting',
    square: 'activating',
    trine: 'flowing',
    opposition: 'balancing',
  }[aspect.id];

  return (
    <div
      className={`${styles.row} ${open ? styles.rowOpen : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.head}>
        <div className={styles.side}>
          <span
            className={styles.planetGlyph}
            style={{ color: `var(--chakra-${leftPlanet.chakra})` }}
          >
            {leftPlanet.glyph}
          </span>
          <div className={styles.sideText}>
            {leftLabel && <span className={styles.sideLabel}>{leftLabel}</span>}
            <span className={styles.planetName}>{leftPlanet.name}</span>
          </div>
        </div>

        <div className={styles.core}>
          <span className={styles.aspectGlyph}>{glyph}</span>
          <span className={styles.aspectName}>{aspect.name}</span>
          <span className={styles.aspectMood}>{aspectMood}</span>
        </div>

        <div className={styles.side}>
          <span
            className={styles.planetGlyph}
            style={{ color: `var(--chakra-${rightPlanet.chakra})` }}
          >
            {rightPlanet.glyph}
          </span>
          <div className={styles.sideText}>
            {rightLabel && <span className={styles.sideLabel}>{rightLabel}</span>}
            <span className={styles.planetName}>{rightPlanet.name}</span>
          </div>
        </div>

        <div className={styles.orbBox}>
          <span className={styles.orbValue}>{orb.toFixed(1)}°</span>
          {exact && <span className={styles.exact}>exact</span>}
        </div>
      </div>

      {open && meaning && (
        <div className={styles.body}>
          <p className={styles.meaning}>{meaning}</p>
        </div>
      )}
    </div>
  );
}
