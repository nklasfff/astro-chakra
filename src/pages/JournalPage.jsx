import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { loadReflections, addReflection, deleteReflection } from '../utils/reflectionStore';
import { THEMES } from '../engine/themes';
import ReflectingPool from '../components/hero/ReflectingPool';
import GlassCard from '../components/common/GlassCard';
import ReflectionInput from '../components/common/ReflectionInput';
import styles from './JournalPage.module.css';

// Chakra-aware prompts — each chakra has 3 prompts to rotate between.
const CHAKRA_PROMPTS = {
  root: [
    'Where in your life do you feel most held today?',
    'What is the ground beneath you right now — and what is it made of?',
    'When did you last feel fully at home in your body?',
  ],
  sacral: [
    "What does your body want today that you haven't given it?",
    'What pleasure felt easy today — without guilt or earning?',
    'Where is the hesitation between impulse and action living?',
  ],
  solar: [
    "What did you say yes to today that your body didn't agree to?",
    'Where did you exercise clean will today — no force, no collapse?',
    'What would you do if you trusted your own power completely?',
  ],
  heart: [
    'What kindness landed in your chest today without deflection?',
    'What grief have you been carrying that wants to be named?',
    'Who did you let matter to you today?',
  ],
  throat: [
    'What did you almost say today and decide not to?',
    'What truth is asking to be spoken, to yourself first?',
    'Where is your public voice diverging from your private one?',
  ],
  thirdeye: [
    'What have you known but kept asking other people about?',
    'What pattern in your life have you been refusing to name?',
    'What did you see today that the mind then argued with?',
  ],
  crown: [
    'What arrived today that you did not manufacture?',
    'Where did meaning find you unbidden?',
    'What question has been living in you longest?',
  ],
};

function getDailyPrompt(chakraId, date) {
  const prompts = CHAKRA_PROMPTS[chakraId] || CHAKRA_PROMPTS.heart;
  const dayNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return prompts[dayNum % prompts.length];
}

export default function JournalPage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(loadReflections().filter((e) => !e.source || e.source === 'journal'));
  }, []);

  const chakra = data?.phase?.chakra;
  const age = data?.age;
  const spiral = data?.phase?.spiral;
  const prompt = useMemo(
    () => (chakra ? getDailyPrompt(chakra.id, new Date()) : ''),
    [chakra]
  );

  const handleSave = ({ text, themes }) => {
    const next = addReflection({
      text,
      themes,
      source: 'journal',
      chakraId: chakra?.id || null,
      chakraName: chakra?.name || null,
      age: age || null,
      spiral: spiral || null,
      prompt,
    });
    setEntries(next.filter((e) => !e.source || e.source === 'journal'));
  };

  const handleDelete = (id) => {
    const next = deleteReflection(id);
    setEntries(next.filter((e) => !e.source || e.source === 'journal'));
  };

  if (!data) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Journal</p>
        <h1 className={styles.title}>The reflecting pool</h1>
        <p className={styles.subtitle}>A sentence is enough. The ripple matters more than the stone.</p>
      </header>

      <ReflectingPool accentColor={chakra?.hex || 'var(--chakra-throat)'} size={260} />

      <GlassCard className={styles.promptCard} glowColor={`${chakra?.hex}25`}>
        <span className={styles.promptLabel}>Today's prompt</span>
        <p className={styles.prompt}>{prompt}</p>
      </GlassCard>

      <ReflectionInput
        placeholder="Begin here. A sentence, a phrase, a word."
        buttonLabel="Keep this"
        onSave={handleSave}
        minHeight={140}
      />

      {entries.length > 0 && (
        <div className={styles.entries}>
          <h3 className={styles.entriesTitle}>Earlier</h3>
          {entries.map((entry) => (
            <GlassCard key={entry.id} className={styles.entryCard}>
              <div className={styles.entryHeader}>
                <span className={styles.entryDate}>
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {entry.chakraName && (
                  <span
                    className={styles.entryChakra}
                    style={{ color: `var(--chakra-${entry.chakraId})` }}
                  >
                    {entry.chakraName} chakra
                  </span>
                )}
              </div>
              {entry.prompt && (
                <p className={styles.entryPrompt}>{entry.prompt}</p>
              )}
              <p className={styles.entryText}>{entry.text}</p>
              {entry.themes && entry.themes.length > 0 && (
                <div className={styles.entryThemes}>
                  {entry.themes.map((t) => {
                    const theme = THEMES.find((x) => x.id === t);
                    if (!theme) return null;
                    return (
                      <span
                        key={t}
                        className={styles.entryTheme}
                        style={{ color: `var(--chakra-${theme.chakraId})` }}
                      >
                        {theme.label}
                      </span>
                    );
                  })}
                </div>
              )}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(entry.id)}
                aria-label="Delete entry"
              >
                remove
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
