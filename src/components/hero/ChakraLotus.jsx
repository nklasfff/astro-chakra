import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLotus.module.css';

/**
 * A unique hero illustration for astro-chakra: a watercolor mandala with
 * seven petals in the seven chakra hues, arranged around a central point.
 * Each petal breathes slowly and the whole form rotates imperceptibly.
 * Replaces 9Lives' pentagon — this is ours.
 */
export default function ChakraLotus({ activeChakraId, size = 260 }) {
  const cx = 150;
  const cy = 150;
  const petalCount = 7;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={`g-${i}`} id={`petal-${i}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.55" />
              <stop offset="55%" stopColor={c.hex} stopOpacity="0.22" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="lotus-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Slow-rotating outer ring */}
        <g className={styles.outerRing}>
          <circle
            cx={cx}
            cy={cy}
            r="120"
            fill="none"
            stroke="var(--line-faint)"
            strokeWidth="0.6"
            strokeDasharray="1 6"
          />
          <circle
            cx={cx}
            cy={cy}
            r="95"
            fill="none"
            stroke="var(--line-faint)"
            strokeWidth="0.5"
            strokeDasharray="0.5 8"
          />
        </g>

        {/* Seven watercolor petals — each at its own angle */}
        {CHAKRAS.map((chakra, i) => {
          const angle = (-90 + i * (360 / petalCount)) * (Math.PI / 180);
          const distance = 68;
          const px = cx + distance * Math.cos(angle);
          const py = cy + distance * Math.sin(angle);
          const rotation = (i * (360 / petalCount)) + 0;
          const isActive = chakra.id === activeChakraId;

          return (
            <g
              key={chakra.id}
              className={`${styles.petal} ${isActive ? styles.petalActive : ''}`}
              style={{ animationDelay: `${i * 0.4}s` }}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            >
              {/* The bloom */}
              <ellipse
                cx={cx}
                cy={cy - distance}
                rx="40"
                ry="52"
                fill={`url(#petal-${i})`}
                filter="url(#lotus-blur)"
              />
              {/* Petal outline */}
              <ellipse
                cx={cx}
                cy={cy - distance}
                rx="26"
                ry="38"
                fill="none"
                stroke={chakra.hex}
                strokeWidth={isActive ? '0.9' : '0.5'}
                opacity={isActive ? '0.6' : '0.32'}
              />
            </g>
          );
        })}

        {/* Inner circle — the still point */}
        <circle cx={cx} cy={cy} r="18" fill="var(--bg)" opacity="0.9" />
        <circle
          cx={cx}
          cy={cy}
          r="12"
          fill="none"
          stroke="var(--line-medium)"
          strokeWidth="0.6"
        />
        <circle cx={cx} cy={cy} r="2.5" fill="var(--text-illustration)" />
      </svg>
    </div>
  );
}
