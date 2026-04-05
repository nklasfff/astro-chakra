import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLotus.module.css';

/**
 * Watercolor 7-petal mandala.
 * All motion handled by CSS keyframes (transform-origin based) — this
 * survives React remounts when navigating between routes. SMIL
 * animations can become paused or fail to restart, so we avoid them here.
 */
export default function ChakraLotus({ activeChakraId, size = 280 }) {
  const cx = 150;
  const cy = 150;
  const petalCount = 7;
  const distance = 64;
  const cycleSeconds = 35;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <filter id="lotus-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Outer dashed rings — CSS rotation */}
        <g className={styles.outerRings}>
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

        {/* Lotus petal layer — counter-rotates via CSS */}
        <g className={styles.lotusLayer}>
          {CHAKRAS.map((chakra, i) => {
            const rotation = i * (360 / petalCount);
            const isActive = chakra.id === activeChakraId;
            const animationDelay = `${-i * (cycleSeconds / petalCount)}s`;
            return (
              <g
                key={chakra.id}
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="48"
                  className={styles.petalBloom}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                  filter="url(#lotus-blur)"
                />
                <ellipse
                  cx={cx}
                  cy={cy - distance}
                  rx="26"
                  ry="38"
                  fill="none"
                  className={`${styles.petalRing} ${isActive ? styles.petalRingActive : ''}`}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
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
