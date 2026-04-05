import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraThread.module.css';

/**
 * A horizontal watercolor thread connecting seven chakra blooms.
 * Each bloom breathes and drifts vertically in a staggered rhythm.
 * Uses CSS animations only (no SMIL) so motion persists across React
 * route changes.
 */
export default function ChakraThread({ width = 340 }) {
  const n = CHAKRAS.length;
  const padding = 28;
  const usableW = 300 - padding * 2;
  const step = usableW / (n - 1);

  return (
    <div className={styles.wrap} style={{ '--width': `${width}px` }}>
      <svg viewBox="0 0 300 90" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`thread-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.6" />
              <stop offset="60%" stopColor={c.hex} stopOpacity="0.2" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="thread-blur">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Undulating thread */}
        <path
          className={styles.thread}
          d={`M ${padding} 45 Q 150 30 ${300 - padding} 45`}
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        {/* Seven blooms drifting vertically in staggered rhythm */}
        {CHAKRAS.map((chakra, i) => {
          const x = padding + i * step;
          return (
            <g
              key={chakra.id}
              className={styles.bloom}
              style={{ animationDelay: `${-i * 1.3}s` }}
            >
              <circle
                cx={x}
                cy="45"
                r="20"
                fill={`url(#thread-${i})`}
                filter="url(#thread-blur)"
              />
              <circle cx={x} cy="45" r="2.2" fill={chakra.hex} opacity="0.8" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
