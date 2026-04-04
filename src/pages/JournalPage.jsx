import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { loadReflections, addReflection, deleteReflection } from '../utils/reflectionStore';
import ReflectingPool from '../components/hero/ReflectingPool';
import GlassCard from '../components/common/GlassCard';
import styles from './JournalPage.module.css';

// Chakra-aware prompts — each chakra has 3 prompts to rotate between.
const CHAKRA_PROMPTS = {
  root: [
    'Where in your life do you feel most held today?',
    'What is the ground beneath you right now — and what is it made of?',
    'When did you last feel fully at home in your body?',
  ],
  sacral: [
    'What does your body want today that you haven\'t given it?',
    'What pleasure felt easy today — without guilt or earning?',
    'Where is the hesitation between impulse and action living?',
  ],
  solar: [
    'What did you say yes to today that your body didn\'t agree to?',
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
  // Cycle prompts daily — stable for a given calendar day
  const dayNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return prompts[dayNum % prompts.length];
}

export default function JournalPage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    setEntries(loadReflections());
  }, []);

  const chakra = data?.phase?.chakra;
  const prompt = useMemo(
    () => (chakra ? getDailyPrompt(chakra.id, new Date()) : ''),
    [chakra]
  );

  const handleSave = () => {
    if (!text.trim()) return;
    const next = addReflection({
      text: text.trim(),
      chakraId: chakra?.id || null,
      chakraName: chakra?.name || null,
      prompt,
    });
    setEntries(next);
    setText('');
  };

  const handleDelete = (id) => {
    setEntries(deleteReflection(id));
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

      <div className={styles.writeArea}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Begin here. A sentence, a phrase, a word."
          rows="5"
        />
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!text.trim()}
        >
          Keep this
        </button>
      </div>

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
