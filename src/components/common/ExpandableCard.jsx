import { useState } from 'react';
import GlassCard from './GlassCard';
import styles from './ExpandableCard.module.css';

/**
 * A GlassCard variant where the body can be collapsed behind a + icon.
 * The label and title are always visible; tapping toggles the rest.
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

  return (
    <GlassCard
      className={styles.card}
      glowColor={glowColor}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.head}>
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
      {open && <div className={styles.body}>{children}</div>}
    </GlassCard>
  );
}
