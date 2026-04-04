import styles from './ReflectingPool.module.css';

/**
 * A meditative illustration of ripples expanding outward on still water.
 * Each ripple grows from the center, fades as it expands. Infinite loop.
 * Used as the hero for the Journal page.
 */
export default function ReflectingPool({ size = 260, accentColor = 'var(--chakra-throat)' }) {
  const cx = 150;
  const cy = 150;
  const ripples = [0, 1, 2, 3];

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px`, '--ring-color': accentColor }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id="pool-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.28" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.05" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="pool-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Soft pool of water */}
        <circle cx={cx} cy={cy} r="118" fill="url(#pool-center)" filter="url(#pool-blur)" />

        {/* Expanding ripples */}
        {ripples.map((i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="10"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.9"
            className={styles.ripple}
            style={{ animationDelay: `${i * 1.5}s` }}
          />
        ))}

        {/* Center dot — the point of reflection */}
        <circle cx={cx} cy={cy} r="3.5" fill={accentColor} opacity="0.7" />
        <circle cx={cx} cy={cy} r="8" fill="none" stroke={accentColor} strokeWidth="0.4" opacity="0.4" />
      </svg>
    </div>
  );
}
