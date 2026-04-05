import styles from './PlanetaryOrbit.module.css';

/**
 * Seven planets orbiting a center at different speeds.
 * Uses negative animation-delay to offset starting position — so each
 * planet starts at a different point of its orbit cycle without
 * conflicting transforms. Speeds tuned so 3-4 are always in visible motion.
 */
const PLANETS = [
  { name: 'Mercury', color: '#628db2', speed: 34, startAngle: 310 },
  { name: 'Moon', color: '#dd7c5c', speed: 44, startAngle: 135 },
  { name: 'Venus', color: '#7ea158', speed: 62, startAngle: 60 },
  { name: 'Sun', color: '#d5a743', speed: 78, startAngle: 230 },
  { name: 'Mars', color: '#c26848', speed: 96, startAngle: 18 },
  { name: 'Jupiter', color: '#6e6aa8', speed: 135, startAngle: 195 },
  { name: 'Saturn', color: '#9f7bc0', speed: 180, startAngle: 85 },
];

export default function PlanetaryOrbit({ size = 260 }) {
  const cx = 150;
  const cy = 150;
  const baseRadius = 30;
  const ringSpacing = 15;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          {PLANETS.map((p, i) => (
            <radialGradient key={`pg-${i}`} id={`planet-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.9" />
              <stop offset="55%" stopColor={p.color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="orbit-blur">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {/* Center */}
        <circle cx={cx} cy={cy} r="4" fill="var(--text-illustration-bright)" opacity="0.85" />
        <circle cx={cx} cy={cy} r="9" fill="none" stroke="var(--line-medium)" strokeWidth="0.6" />

        {PLANETS.map((planet, i) => {
          const r = baseRadius + i * ringSpacing;
          // Negative delay so the animation is already "in progress" at the desired start angle.
          // A full rotation (0->360deg) takes `speed` seconds, so delay = -(startAngle/360) * speed.
          const delay = -((planet.startAngle / 360) * planet.speed);
          return (
            <g key={planet.name}>
              {/* Orbit ring */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--line-subtle)"
                strokeWidth="0.7"
                opacity="0.8"
              />
              {/* Rotating group */}
              <g
                className={styles.orbit}
                style={{
                  animationDuration: `${planet.speed}s`,
                  animationDelay: `${delay}s`,
                }}
              >
                <g transform={`translate(${cx} ${cy - r})`}>
                  <circle r="10" fill={`url(#planet-${i})`} filter="url(#orbit-blur)" />
                  <circle r="3.4" fill={planet.color} opacity="0.98" />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
