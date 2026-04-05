import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLotus.module.css';

/**
 * Living chakra mandala — the hero of Home.
 * Seven watercolor petals continuously cycle through all chakra hues.
 * Each petal's bloom radius expands and contracts (true breathing, via SMIL).
 * The whole lotus slowly turns.
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

        {/* Lotus rotates slowly as one */}
        <g className={styles.lotusLayer}>
          {CHAKRAS.map((chakra, i) => {
            const rotation = i * (360 / petalCount);
            const isActive = chakra.id === activeChakraId;
            const animationDelay = `${-i * (cycleSeconds / petalCount)}s`;
            // Each petal's breath is offset by a fraction of its cycle
            const breathOffset = `${-i * 0.85}s`;
            return (
              <g key={chakra.id} transform={`rotate(${rotation} ${cx} ${cy})`}>
                {/* Big soft watercolor bloom — SMIL animates radius */}
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="48"
                  className={styles.petalBloom}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                  filter="url(#lotus-soft-blur)"
                >
                  <animate
                    attributeName="r"
                    values="44;58;44"
                    dur="10s"
                    repeatCount="indefinite"
                    begin={breathOffset}
                  />
                </circle>
                {/* Denser inner color */}
                <circle
                  cx={cx}
                  cy={cy - distance}
                  r="20"
                  className={`${styles.petalCore} ${isActive ? styles.petalCoreActive : ''}`}
                  style={{
                    animationDelay,
                    '--cycle-duration': `${cycleSeconds}s`,
                  }}
                  filter="url(#lotus-core-blur)"
                >
                  <animate
                    attributeName="r"
                    values="18;26;18"
                    dur="8s"
                    repeatCount="indefinite"
                    begin={breathOffset}
                  />
                </circle>
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
                >
                  <animate
                    attributeName="r"
                    values="1.8;3;1.8"
                    dur="7s"
                    repeatCount="indefinite"
                    begin={breathOffset}
                  />
                </circle>
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
        >
          <animate
            attributeName="r"
            values="2.5;3.5;2.5"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
