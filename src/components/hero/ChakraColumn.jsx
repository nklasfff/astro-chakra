import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraColumn.module.css';

/**
 * The sushumna — vertical watercolor column of the seven chakras.
 * Crown at top, root at bottom. Two energy particles rise and fall along
 * the central channel in an infinite cycle.
 * Uses CSS animations only (no SMIL) so motion persists across remounts.
 */
export default function ChakraColumn({ width = 180, height = 400 }) {
  const cx = 100;
  const topY = 40;
  const bottomY = 360;
  const n = CHAKRAS.length;
  const step = (bottomY - topY) / (n - 1);
  const ordered = [...CHAKRAS].reverse();

  return (
    <div className={styles.wrap} style={{ '--width': `${width}px`, '--height': `${height}px` }}>
      <svg viewBox="0 0 200 400" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`col-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.65" />
              <stop offset="55%" stopColor={c.hex} stopOpacity="0.22" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id="channel-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9f7bc0" stopOpacity="0.3" />
            <stop offset="16.66%" stopColor="#6e6aa8" stopOpacity="0.3" />
            <stop offset="33.33%" stopColor="#628db2" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7ea158" stopOpacity="0.3" />
            <stop offset="66.66%" stopColor="#d5a743" stopOpacity="0.3" />
            <stop offset="83.33%" stopColor="#dd7c5c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c26848" stopOpacity="0.3" />
          </linearGradient>
          <filter id="col-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Central channel */}
        <line
          x1={cx}
          y1={topY - 10}
          x2={cx}
          y2={bottomY + 10}
          stroke="url(#channel-gradient)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Two travelling energy particles — one ascending, one descending */}
        <circle
          cx={cx}
          cy={bottomY}
          r="2.4"
          fill="var(--text-illustration-bright)"
          className={styles.particleUp}
        />
        <circle
          cx={cx}
          cy={topY}
          r="2.4"
          fill="var(--text-illustration-bright)"
          className={styles.particleDown}
        />

        {/* Seven chakra blooms (crown → root) */}
        {ordered.map((chakra, i) => {
          const y = topY + i * step;
          const chakraIndex = 6 - i;
          return (
            <g
              key={chakra.id}
              className={styles.bloom}
              style={{ animationDelay: `${-i * 0.9}s` }}
            >
              <ellipse
                cx={cx}
                cy={y}
                rx="42"
                ry="24"
                fill={`url(#col-${chakraIndex})`}
                filter="url(#col-blur)"
              />
              <circle
                cx={cx}
                cy={y}
                r="9"
                fill="none"
                stroke={chakra.hex}
                strokeWidth="0.6"
                opacity="0.4"
              />
              <circle cx={cx} cy={y} r="2.5" fill={chakra.hex} opacity="0.8" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
