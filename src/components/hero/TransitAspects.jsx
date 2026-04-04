import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { computeNatalChart } from '../../engine/natal';
import { computeCurrentSky, computeTransits } from '../../engine/transits';
import GlassCard from '../common/GlassCard';
import styles from './TransitAspects.module.css';

const ASPECT_GLYPHS = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

const ASPECT_MOOD = {
  conjunction: 'fusing',
  sextile: 'supporting',
  square: 'activating',
  trine: 'flowing',
  opposition: 'balancing',
};

/**
 * Show the tightest transit-to-natal aspects happening today.
 * Each row pairs a transiting planet with one of your natal planets.
 */
export default function TransitAspects({ limit = 5 }) {
  const { profile } = useUser();
  const { natal, sky, aspects } = useMemo(() => {
    if (!profile) return { natal: null, sky: null, aspects: [] };
    const natal = computeNatalChart(profile);
    const sky = computeCurrentSky(new Date());
    const allAspects = computeTransits(sky, natal);
    // Filter to luminaries + personal planets for clarity on home
    const personalIds = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);
    const filtered = allAspects.filter(
      (a) => personalIds.has(a.transit.id) || personalIds.has(a.natal.id)
    );
    return { natal, sky, aspects: filtered.slice(0, limit) };
  }, [profile, limit]);

  if (!profile || aspects.length === 0) return null;

  return (
    <GlassCard className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Today moves your chart</span>
      </div>

      <div className={styles.aspects}>
        {aspects.map((a, i) => (
          <div key={i} className={styles.aspect}>
            {/* Transit planet */}
            <div className={styles.body}>
              <span
                className={styles.planet}
                style={{ color: `var(--chakra-${a.transit.chakra})` }}
              >
                {a.transit.glyph}
              </span>
              <span className={styles.planetName}>{a.transit.name}</span>
            </div>

            {/* Aspect glyph + name */}
            <div className={styles.aspectCore}>
              <span className={styles.aspectGlyph}>{ASPECT_GLYPHS[a.aspect.id]}</span>
              <span className={styles.aspectName}>{a.aspect.name}</span>
              <span className={styles.aspectMood}>{ASPECT_MOOD[a.aspect.id]}</span>
            </div>

            {/* Natal planet */}
            <div className={styles.body}>
              <span className={styles.natalLabel}>your</span>
              <span
                className={styles.planet}
                style={{ color: `var(--chakra-${a.natal.chakra})` }}
              >
                {a.natal.glyph}
              </span>
              <span className={styles.planetName}>{a.natal.name}</span>
            </div>

            {/* Orb */}
            <div className={styles.orb}>
              <span className={styles.orbValue}>
                {a.orb.toFixed(1)}°
              </span>
              {a.exact && <span className={styles.exact}>exact</span>}
            </div>
          </div>
        ))}
      </div>

      <Link to="/explore/natal" className={styles.seeAll}>
        See your full chart →
      </Link>
    </GlassCard>
  );
}
