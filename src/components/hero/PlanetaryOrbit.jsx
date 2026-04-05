import styles from './PlanetaryOrbit.module.css';

/**
 * Seven planets orbiting a center at different speeds.
 * Uses CSS animations on SVG <g> wrappers (with CSS transform-origin)
 * so the motion survives React route changes and component remounts.
 */
const PLANETS = [
  { name: 'Saturn', color: '#c26848', speed: 280, startAngle: 18 },
  { name: 'Moon', color: '#dd7c5c', speed: 60, startAngle: 135 },
  { name: 'Sun', color: '#d5a743', speed: 120, startAngle: 230 },
  { name: 'Venus', color: '#7ea158', speed: 90, startAngle: 60 },
  { name: 'Mercury', color: '#628db2', speed: 45, startAngle: 310 },
  { name: 'Jupiter', color: '#6e6aa8', speed: 200, startAngle: 195 },
  { name: 'Neptune', color: '#9f7bc0', speed: 340, startAngle: 85 },
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
              <stop offset="0%" stopColor={p.color} stopOpacity="0.8" />
              <stop offset="60%" stopColor={p.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="orbit-blur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>

        {/* Center */}
        <circle cx={cx} cy={cy} r="4" fill="var(--text-illustration)" opacity="0.8" />
        <circle cx={cx} cy={cy} r="9" fill="none" stroke="var(--line-medium)" strokeWidth="0.5" />

        {PLANETS.map((planet, i) => {
          const r = baseRadius + i * ringSpacing;
          return (
            <g key={planet.name}>
              {/* Orbit ring */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--line-faint)"
                strokeWidth="0.4"
              />
              {/* Rotating group — CSS animation around viewBox center */}
              <g
                className={styles.orbit}
                style={{
                  animationDuration: `${planet.speed}s`,
                  transform: `rotate(${planet.startAngle}deg)`,
                }}
              >
                <g transform={`translate(${cx} ${cy - r})`}>
                  <circle r="9" fill={`url(#planet-${i})`} filter="url(#orbit-blur)" />
                  <circle r="2.8" fill={planet.color} opacity="0.9" />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
