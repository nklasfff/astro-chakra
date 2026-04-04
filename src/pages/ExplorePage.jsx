import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CHAKRAS } from '../engine/chakras';
import { hasChakraDeep, getChakraDeep } from '../engine/chakraDeep';
import GlassCard from '../components/common/GlassCard';
import ChakraColumn from '../components/hero/ChakraColumn';
import styles from './ExplorePage.module.css';

export default function ExplorePage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const currentId = data?.phase?.chakra?.id;

  // Display top-to-bottom: crown first, root last
  const ordered = [...CHAKRAS].reverse();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.greeting}>Explore</p>
        <h1 className={styles.title}>The seven</h1>
        <p className={styles.subtitle}>
          A vertical column of centres, from ground to sky.
        </p>
      </header>

      <ChakraColumn width={200} height={440} />

      <p className={styles.columnCaption}>
        The sushumna — the channel energy travels as it climbs and descends.
      </p>

      <div className={styles.list}>
        {ordered.map((chakra) => {
          const ready = hasChakraDeep(chakra.id);
          const deep = ready ? getChakraDeep(chakra.id) : null;
          const isCurrent = chakra.id === currentId;
          const card = (
            <GlassCard
              className={`${styles.card} ${!ready ? styles.cardDimmed : ''}`}
              glowColor={isCurrent ? `${chakra.hex}40` : 'transparent'}
            >
              <div className={styles.cardRow}>
                <span className={styles.devanagari} style={{ color: chakra.hex }}>
                  {chakra.devanagari}
                </span>
                <div className={styles.cardText}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardLabel}>
                      Chakra {chakra.number} · {chakra.ageRange.start}–{chakra.ageRange.end}
                    </span>
                    {isCurrent && (
                      <span className={styles.currentDot} style={{ background: chakra.hex }} />
                    )}
                  </div>
                  <h2 className={styles.cardName} style={{ color: chakra.hex }}>
                    {chakra.name}
                  </h2>
                  <p className={styles.cardSub}>
                    {chakra.sanskrit} —{' '}
                    {deep?.shortCard?.subtitle || chakra.theme}
                  </p>
                </div>
              </div>
            </GlassCard>
          );

          return ready ? (
            <Link key={chakra.id} to={`/explore/chakras/${chakra.id}`} className={styles.link}>
              {card}
            </Link>
          ) : (
            <div key={chakra.id} className={styles.link}>
              {card}
            </div>
          );
        })}
      </div>

      <Link to="/explore/natal" className={styles.natalLink}>
        <GlassCard className={styles.natalCard}>
          <span className={styles.natalLabel}>Astrology</span>
          <h2 className={styles.natalTitle}>Your natal chart</h2>
          <p className={styles.natalSub}>The sky you were born under — planets, signs, houses.</p>
        </GlassCard>
      </Link>
    </div>
  );
}
