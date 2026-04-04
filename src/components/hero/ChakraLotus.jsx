import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLotus.module.css';

/**
 * Watercolor 7-petal mandala with:
 * - Slow continuous rotation of the whole form (SMIL, reliable)
 * - Each petal breathing in scale (staggered)
 * - Active chakra has a stronger pulse
 * Unique to astro-chakra.
 */
export default function ChakraLotus({ activeChakraId, size = 280 }) {
  const cx = 150;
  const cy = 150;
  const petalCount = 7;
  const distance = 64;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={`g-${i}`} id={`petal-${i}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.7" />
              <stop offset="55%" stopColor={c.hex} stopOpacity="0.28" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="lotus-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Slow-rotating outer rings — SMIL for reliable SVG rotation */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="240s"
            repeatCount="indefinite"
          />
          <circle
            cx={cx}
            cy={cy}
            r="122"
            fill="none"
            stroke="var(--line-faint)"
            strokeWidth="0.6"
            strokeDasharray="1 7"
          />
          <circle
            cx={cx}
            cy={cy}
            r="96"
            fill="none"
            stroke="var(--line-faint)"
            strokeWidth="0.5"
            strokeDasharray="0.5 9"
          />
        </g>

        {/* The whole lotus rotates slowly in the opposite direction */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`-360 ${cx} ${cy}`}
            dur="360s"
            repeatCount="indefinite"
          />
          {CHAKRAS.map((chakra, i) => {
            const rotation = i * (360 / petalCount);
            const isActive = chakra.id === activeChakraId;
            return (
              <g
                key={chakra.id}
                transform={`rotate(${rotation} ${cx} ${cy})`}
                className={`${styles.petal} ${isActive ? styles.petalActive : ''}`}
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <ellipse
                  cx={cx}
                  cy={cy - distance}
                  rx="40"
                  ry="54"
                  fill={`url(#petal-${i})`}
                  filter="url(#lotus-blur)"
                />
                <ellipse
                  cx={cx}
                  cy={cy - distance}
                  rx="26"
                  ry="38"
                  fill="none"
                  stroke={chakra.hex}
                  strokeWidth={isActive ? '1' : '0.55'}
                  opacity={isActive ? '0.7' : '0.38'}
                />
              </g>
            );
          })}
        </g>

        {/* Center — the still point */}
        <circle cx={cx} cy={cy} r="19" fill="var(--bg)" opacity="0.92" />
        <circle
          cx={cx}
          cy={cy}
          r="13"
          fill="none"
          stroke="var(--line-medium)"
          strokeWidth="0.7"
          className={styles.centerPulse}
        />
        <circle cx={cx} cy={cy} r="2.8" fill="var(--text-illustration-bright)" />
      </svg>
    </div>
  );
}
