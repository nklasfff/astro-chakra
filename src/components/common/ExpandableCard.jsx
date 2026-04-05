import { useState } from 'react';
import GlassCard from './GlassCard';
import styles from './ExpandableCard.module.css';

/**
 * A GlassCard variant where the body can be collapsed behind a + icon.
 * The label and title are always visible; tapping the header toggles the rest.
 * Each card keeps its own open state — cards stay open independently.
 * Clicking inside the body does NOT close the card.
 */
export default function ExpandableCard({
  label,
  title,
  titleColor,
  children,
  defaultOpen = false,
  glowColor,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <GlassCard className={styles.card} glowColor={glowColor}>
      <div className={styles.head} onClick={toggle}>
        <div className={styles.headText}>
          {label && <span className={styles.label}>{label}</span>}
          {title && (
            <h2 className={styles.title} style={titleColor ? { color: titleColor } : undefined}>
              {title}
            </h2>
          )}
        </div>
        <span className={styles.chevron}>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className={styles.body} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </GlassCard>
  );
}
