import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLotus.module.css';

/**
 * Living chakra mandala — the hero of Home.
 * Seven watercolor petals continuously cycle through all chakra hues.
 * The whole lotus slowly turns. Each petal breathes in scale.
 * Colors drift in an endless chain so no two moments look alike.
 */
export default function ChakraLotus({ activeChakraId, size = 280 }) {
  const cx = 150;
  const cy = 150;
  const petalCount = 7;
  const distance = 62;
  const cycleSeconds = 42;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <filter id="lotus-soft-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="lotus-core-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Lotus rotates slowly as one — CSS transform on viewBox origin */}
        <g className={styles.lotusLayer}>
          {CHAKRAS.map((chakra, i) => {
            const rotation = i * (360 / petalCount);
            const isActive = chakra.id === activeChakraId;
            const animationDelay = `${-i * (cycleSeconds / petalCount)}s`;
            return (
              <g
                key={chakra.id}
                transform={`rotate(${rotation} ${cx} ${cy})`}
                className={styles.petalGroup}
                style={{ animationDelay: `${-i * 1.1}s` }}
              >
                {/* Big soft watercolor bloom */}
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="52"
                  className={styles.petalBloom}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                  filter="url(#lotus-soft-blur)"
                />
                {/* Denser inner color */}
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="22"
                  className={`${styles.petalCore} ${isActive ? styles.petalCoreActive : ''}`}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                  filter="url(#lotus-core-blur)"
                />
                {/* Tiny bright dot at the petal's heart */}
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="2.2"
                  className={styles.petalDot}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Central still point — breathes gently */}
        <circle cx={cx} cy={cy} r="20" fill="var(--bg)" opacity="0.75" />
        <circle
          cx={cx}
          cy={cy}
          r="3"
          fill="var(--text-illustration-bright)"
          className={styles.centerDot}
        />
      </svg>
    </div>
  );
}
