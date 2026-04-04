import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraThread.module.css';

/**
 * A horizontal watercolor thread connecting all seven chakras.
 * The thread itself undulates (path animates via SMIL).
 * Each bloom breathes in scale with a staggered delay.
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

        {/* Undulating thread — SMIL path animation */}
        <path
          d={`M ${padding} 45 Q ${150} 30 ${300 - padding} 45`}
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="9s"
            repeatCount="indefinite"
            values={`
              M ${padding} 45 Q ${150} 30 ${300 - padding} 45;
              M ${padding} 45 Q ${150} 60 ${300 - padding} 45;
              M ${padding} 45 Q ${150} 30 ${300 - padding} 45
            `}
          />
        </path>

        {/* Seven blooms breathing in staggered rhythm */}
        {CHAKRAS.map((chakra, i) => {
          const x = padding + i * step;
          const baseY = 45;
          return (
            <g
              key={chakra.id}
              className={styles.bloom}
              style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${x}px ${baseY}px` }}
            >
              <animate
                attributeName="cy"
                values={`${baseY - 8}; ${baseY + 8}; ${baseY - 8}`}
                dur="9s"
                repeatCount="indefinite"
                begin={`${-i * (9 / n)}s`}
              />
              <circle
                cx={x}
                cy={baseY}
                r="20"
                fill={`url(#thread-${i})`}
                filter="url(#thread-blur)"
              >
                <animate
                  attributeName="cy"
                  values={`${baseY - 8}; ${baseY + 8}; ${baseY - 8}`}
                  dur="9s"
                  repeatCount="indefinite"
                  begin={`${-i * (9 / n)}s`}
                />
              </circle>
              <circle cx={x} cy={baseY} r="2.2" fill={chakra.hex} opacity="0.8">
                <animate
                  attributeName="cy"
                  values={`${baseY - 8}; ${baseY + 8}; ${baseY - 8}`}
                  dur="9s"
                  repeatCount="indefinite"
                  begin={`${-i * (9 / n)}s`}
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
