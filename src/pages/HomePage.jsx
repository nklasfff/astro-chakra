import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getGreeting } from '../utils/dateUtils';
import { CHAKRAS } from '../engine/chakras';
import { getChakraDeep, hasChakraDeep } from '../engine/chakraDeep';
import GlassCard from '../components/common/GlassCard';
import ChakraLadder from '../components/hero/ChakraLadder';
import WatercolorBloom from '../components/hero/WatercolorBloom';
import SpiralIllustration from '../components/hero/SpiralIllustration';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  const { age, phase } = data;
  const { chakra, phaseIndex, spiral, ageRange } = phase;
  const deep = hasChakraDeep(chakra.id) ? getChakraDeep(chakra.id) : null;

  const previousChakra = phaseIndex > 0 ? CHAKRAS[phaseIndex - 1] : null;
  const nextChakra = phaseIndex < 6 ? CHAKRAS[phaseIndex + 1] : null;
  const ageIntoPhase = age - ageRange.start;
  const yearsToNext = ageRange.end - age + 1;

  const chakraColors = CHAKRAS.map((c) => c.hex);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.greeting}>{getGreeting()}</p>
      </header>

      <ChakraLadder activePhaseIndex={phaseIndex} age={age} spiral={spiral} />

      <div className={styles.caption}>
        <span className={styles.devanagari} style={{ color: chakra.hex }}>
          {chakra.devanagari}
        </span>
        <h1 className={styles.chakraName} style={{ color: chakra.hex }}>
          {chakra.name}
        </h1>
        <p className={styles.sanskrit}>
          {chakra.sanskrit} — {deep?.shortCard?.subtitle || chakra.theme}
        </p>
      </div>

      {deep && (
        <GlassCard className={styles.card} glowColor={`${chakra.hex}55`}>
          <span className={styles.label}>Your phase</span>
          <p className={styles.leadBody}>{deep.shortCard.description}</p>
          <p className={styles.cardMeta}>
            Age {age} · year {ageIntoPhase + 1} of 7 · spiral {spiral}
          </p>
        </GlassCard>
      )}

      <WatercolorBloom colors={chakraColors} />

      <GlassCard className={styles.card}>
        <span className={styles.label}>Ruling planet</span>
        <h2 className={styles.cardTitle}>{chakra.planet}</h2>
        {deep ? (
          <p className={styles.cardBody}>{deep.astrology.planetBody}</p>
        ) : (
          <p className={styles.cardBody}>
            The {chakra.planet} signature colors this chapter of your life.
          </p>
        )}
        <p className={styles.cardMeta}>
          Resonant signs: {chakra.zodiac.join(', ')}
        </p>
      </GlassCard>

      {deep && (
        <GlassCard className={styles.card} glowColor={`${chakra.hex}20`}>
          <span className={styles.label}>Core theme</span>
          <h2 className={styles.cardTitle}>{deep.coreTheme.title}</h2>
          <p className={styles.cardBody}>{deep.coreTheme.gift}</p>
        </GlassCard>
      )}

      <div className={styles.neighbors}>
        {previousChakra ? (
          <NeighborCard
            label="Just completed"
            chakra={previousChakra}
            caption={`${previousChakra.ageRange.start}–${previousChakra.ageRange.end}`}
          />
        ) : (
          <div />
        )}
        {nextChakra ? (
          <NeighborCard
            label={`In ${yearsToNext} year${yearsToNext === 1 ? '' : 's'}`}
            chakra={nextChakra}
            caption={`${nextChakra.ageRange.start}–${nextChakra.ageRange.end}`}
            align="right"
          />
        ) : (
          <div />
        )}
      </div>

      <SpiralIllustration color="var(--text-illustration)" size={140} />

      {deep && (
        <GlassCard className={styles.card}>
          <span className={styles.label}>A practice for today</span>
          <h2 className={styles.cardTitle}>{deep.practices[0].title}</h2>
          <p className={styles.cardBody}>{deep.practices[0].body}</p>
        </GlassCard>
      )}

      {deep && (
        <GlassCard className={styles.reflectionCard}>
          <span className={styles.label}>A reflection</span>
          <blockquote className={styles.quote} style={{ borderColor: `${chakra.hex}60` }}>
            {deep.personal.quote}
          </blockquote>
        </GlassCard>
      )}

      <Link to={`/explore/chakras/${chakra.id}`} className={styles.deepLink}>
        Enter {chakra.name} →
      </Link>

      <p className={styles.hint}>
        Natal chart and today's transits arrive in the next build step.
      </p>
    </div>
  );
}

function NeighborCard({ label, chakra, caption, align = 'left' }) {
  return (
    <Link to={`/explore/chakras/${chakra.id}`} className={styles.neighborLink}>
      <GlassCard className={styles.neighborCard}>
        <span className={styles.neighborLabel} style={{ textAlign: align }}>{label}</span>
        <div className={styles.neighborRow} style={{ flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
          <span className={styles.neighborDevanagari} style={{ color: chakra.hex }}>
            {chakra.devanagari}
          </span>
          <div>
            <div className={styles.neighborName} style={{ color: chakra.hex, textAlign: align }}>
              {chakra.name}
            </div>
            <div className={styles.neighborCaption} style={{ textAlign: align }}>
              {caption}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
