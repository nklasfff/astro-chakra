import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getChakra } from '../engine/chakras';
import { getChakraDeep } from '../engine/chakraDeep';
import { getJourneyPosition } from '../engine/chakraJourney';
import { addReflection } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import ReflectionInput from '../components/common/ReflectionInput';
import styles from './ChakraDeepPage.module.css';

function Expandable({ title, children, glowColor, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = (e) => { e.stopPropagation(); setOpen(!open); };
  return (
    <GlassCard glowColor={glowColor} className={styles.expandable}>
      <div className={styles.expandHeader} onClick={toggle}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.expandIcon}>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className={styles.expandContent} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </GlassCard>
  );
}

export default function ChakraDeepPage() {
  const { chakraId } = useParams();
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();

  const chakra = getChakra(chakraId);
  const deep = getChakraDeep(chakraId);

  if (!chakra) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
        <div className={styles.comingSoon}>
          <h2>Chakra not found</h2>
        </div>
      </div>
    );
  }

  if (!deep) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
        <header className={styles.header}>
          <span className={styles.label}>Chakra {chakra.number} · {chakra.ageRange.start}–{chakra.ageRange.end}</span>
          <h1 className={styles.devanagari} style={{ color: chakra.hex }}>{chakra.devanagari}</h1>
          <h2 className={styles.title} style={{ color: chakra.hex }}>{chakra.name}</h2>
          <p className={styles.subtitle}>{chakra.sanskrit} — {chakra.theme}</p>
        </header>
        <div className={styles.comingSoon}>
          <p>Deep content for this chakra is being written.</p>
        </div>
      </div>
    );
  }

  const isCurrentChakra = data?.phase?.chakra?.id === chakra.id;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>Chakra {chakra.number} · {chakra.ageRange.start}–{chakra.ageRange.end}</span>
        <h1 className={styles.devanagari} style={{ color: chakra.hex }}>{chakra.devanagari}</h1>
        <h2 className={styles.title} style={{ color: chakra.hex }}>{chakra.name}</h2>
        <p className={styles.subtitle}>{chakra.sanskrit} — {deep.shortCard.subtitle}</p>
        {isCurrentChakra && (
          <span className={styles.currentBadge} style={{ background: `${chakra.hex}1f`, color: chakra.hex }}>
            You are here
          </span>
        )}
      </header>

      {/* Overview — always open */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.overview.title}</h2>
        <p className={styles.body}>{deep.overview.body}</p>
        <p className={styles.body}>{deep.overview.detail}</p>
      </GlassCard>

      {/* Personal — always open */}
      <GlassCard glowColor={`${chakra.hex}14`}>
        <p className={styles.quoteIntro}>{deep.personal.title}</p>
        <blockquote className={styles.quote} style={{ borderColor: `${chakra.hex}50` }}>
          {deep.personal.quote}
        </blockquote>
        <p className={styles.quoteReflection}>{deep.personal.reflection}</p>
      </GlassCard>

      {/* Chakra correspondences — compact info bar */}
      <GlassCard className={styles.infoBar}>
        <div className={styles.infoGrid}>
          <InfoRow label="Planet" value={chakra.planet} color={chakra.hex} />
          <InfoRow label="Element" value={chakra.element} />
          <InfoRow label="Location" value={chakra.location} />
          <InfoRow label="Zodiac" value={chakra.zodiac.join(', ')} />
          <InfoRow label="Theme" value={chakra.theme} color={chakra.hex} />
        </div>
      </GlassCard>

      {/* Collapsible sections */}
      <Expandable title={deep.whenBalanced.title}>
        <p className={styles.body}>{deep.whenBalanced.body}</p>
      </Expandable>

      <Expandable title={deep.whenChallenged.title}>
        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Physical signs</h3>
          {deep.whenChallenged.physical.map((item, i) => (
            <p key={i} className={styles.listItem}>· {item}</p>
          ))}
        </div>
        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Emotional signs</h3>
          {deep.whenChallenged.emotional.map((item, i) => (
            <p key={i} className={styles.listItem}>· {item}</p>
          ))}
        </div>
      </Expandable>

      <Expandable title={deep.coreTheme.title} glowColor={`${chakra.hex}10`}>
        <p className={styles.body}>{deep.coreTheme.body}</p>
        <p className={styles.body}>{deep.coreTheme.shadow}</p>
        <p className={styles.bodyAccent}>{deep.coreTheme.gift}</p>
      </Expandable>

      <Expandable title={deep.thisChakraInYouNow.title}>
        <p className={styles.body}>{deep.thisChakraInYouNow.body}</p>
        <p className={styles.body}>{deep.thisChakraInYouNow.gift}</p>
        <p className={styles.bodyAccent}>{deep.thisChakraInYouNow.wisdom}</p>
      </Expandable>

      <Expandable title="Guidance">
        <div className={styles.adviceList}>
          {deep.advice.map((item, i) => (
            <div key={i} className={styles.adviceItem}>
              <h3 className={styles.adviceTitle}>{item.title}</h3>
              <p className={styles.adviceBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </Expandable>

      <Expandable title="Practices">
        <div className={styles.exerciseList}>
          {deep.practices.map((p, i) => (
            <div key={i} className={styles.exerciseItem}>
              <span className={styles.exerciseNum}>{i + 1}</span>
              <div>
                <h3 className={styles.exerciseTitle}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Expandable>

      <Expandable title={`${deep.astrology.rulingPlanet} — ruling planet`} glowColor={`${chakra.hex}10`}>
        <p className={styles.body}>{deep.astrology.planetBody}</p>
        <p className={styles.bodyAccent}>{deep.astrology.transitHint}</p>
      </Expandable>

      {/* Reflection — what this chakra stirs in you today */}
      <GlassCard className={styles.reflectionCard} glowColor={`${chakra.hex}15`}>
        <span className={styles.reflectionLabel}>Reflect on {chakra.name.toLowerCase()}</span>
        <p className={styles.reflectionHint}>
          Something you noticed, a practice you tried, a question sitting with you.
        </p>
        <ReflectionInput
          placeholder={`What is ${chakra.name.toLowerCase()} asking of you today?`}
          buttonLabel="Keep this"
          onSave={({ text, themes }) => {
            if (!data) return;
            const pos = getJourneyPosition(data.age);
            addReflection({
              text,
              themes,
              source: 'practice',
              chakraId: pos.primary.id,
              chakraName: pos.primary.name,
              age: data.age,
              spiral: pos.spiral,
              sourceMeta: { chakraReading: chakra.id, chakraReadingName: chakra.name },
            });
          }}
          minHeight={100}
        />
      </GlassCard>

      <button className={styles.topBtn} onClick={scrollToTop}>
        ↑ Back to top
      </button>
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue} style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}
