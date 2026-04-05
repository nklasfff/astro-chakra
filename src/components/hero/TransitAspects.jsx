import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { computeNatalChart } from '../../engine/natal';
import { computeCurrentSky, computeTransits } from '../../engine/transits';
import GlassCard from '../common/GlassCard';
import AspectRow from '../common/AspectRow';
import styles from './TransitAspects.module.css';

/**
 * Show the tightest transit-to-natal aspects happening today.
 * Each row is tap-to-reveal with a short poetic meaning.
 */
export default function TransitAspects({ limit = 5 }) {
  const { profile } = useUser();
  const aspects = useMemo(() => {
    if (!profile) return [];
    const natal = computeNatalChart(profile);
    const sky = computeCurrentSky(new Date());
    const all = computeTransits(sky, natal);
    const personalIds = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);
    return all
      .filter((a) => personalIds.has(a.transit.id) || personalIds.has(a.natal.id))
      .slice(0, limit);
  }, [profile, limit]);

  if (!profile || aspects.length === 0) return null;

  return (
    <GlassCard className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Today moves your chart</span>
        <span className={styles.hint}>Tap to read</span>
      </div>

      <div className={styles.aspects}>
        {aspects.map((a, i) => (
          <AspectRow
            key={i}
            leftPlanet={a.transit}
            rightPlanet={a.natal}
            leftLabel="today"
            rightLabel="your"
            aspect={a.aspect}
            orb={a.orb}
            exact={a.exact}
            context="transit"
          />
        ))}
      </div>

      <Link to="/explore/natal" className={styles.seeAll}>
        See your full chart →
      </Link>
    </GlassCard>
  );
}
