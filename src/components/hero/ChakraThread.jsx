import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraThread.module.css';

/**
 * A horizontal watercolor thread connecting all seven chakras in a row.
 * Each chakra drops a soft bloom. The thread is drawn in Devanagari stroke
 * weight — suggesting script, suggesting continuity. Used as a section divider.
 */
export default function ChakraThread({ width = 320 }) {
  const n = CHAKRAS.length;
  const padding = 22;
  const usableW = 300 - padding * 2;
  const step = usableW / (n - 1);

  return (
    <div className={styles.wrap} style={{ '--width': `${width}px` }}>
      <svg viewBox="0 0 300 80" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`thread-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.5" />
              <stop offset="60%" stopColor={c.hex} stopOpacity="0.15" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="thread-blur">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* The thread */}
        <path
          d={`M ${padding} 40 Q ${150} ${28} ${300 - padding} 40`}
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Seven blooms with drift animation */}
        {CHAKRAS.map((chakra, i) => {
          const x = padding + i * step;
          // Offset Y slightly along the curve
          const curveOffset = Math.sin((i / (n - 1)) * Math.PI) * 12;
          const y = 40 - curveOffset;
          return (
            <g
              key={chakra.id}
              className={styles.bloom}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <circle
                cx={x}
                cy={y}
                r="18"
                fill={`url(#thread-${i})`}
                filter="url(#thread-blur)"
              />
              <circle cx={x} cy={y} r="2" fill={chakra.hex} opacity="0.7" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
