import styles from './SpiralIllustration.module.css';

/**
 * A slowly rotating chakra-colored spiral — represents the second turn
 * of the life cycle, the return at a higher octave. Seven glowing
 * watercolor blooms ride the spiral, each carrying a chakra hue.
 * CSS-animated so the motion persists across React route changes.
 */
export default function SpiralIllustration({ size = 200 }) {
  const cx = 120;
  const cy = 120;
  const chakraColors = [
    '#c26848', // root (outermost — where the spiral begins)
    '#dd7c5c', // sacral
    '#d5a743', // solar
    '#7ea158', // heart
    '#628db2', // throat
    '#6e6aa8', // third eye
    '#9f7bc0', // crown (innermost — the still point)
  ];

  // Build an archimedean spiral path
  const turns = 2.8;
  const steps = 200;
  const maxR = 92;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = maxR - (i / steps) * (maxR - 12);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  // Place 7 blooms evenly along the spiral (root on outside, crown at center)
  const bloomStops = chakraColors.map((color, i) => {
    const t = (i / (chakraColors.length - 1)) * turns * Math.PI * 2;
    const r = maxR - (i / (chakraColors.length - 1)) * (maxR - 18);
    return {
      color,
      x: cx + r * Math.cos(t),
      y: cy + r * Math.sin(t),
    };
  });

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 240 240" className={styles.svg} aria-hidden="true">
        <defs>
          <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c26848" stopOpacity="0.7" />
            <stop offset="16.66%" stopColor="#dd7c5c" stopOpacity="0.7" />
            <stop offset="33.33%" stopColor="#d5a743" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#7ea158" stopOpacity="0.7" />
            <stop offset="66.66%" stopColor="#628db2" stopOpacity="0.7" />
            <stop offset="83.33%" stopColor="#6e6aa8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9f7bc0" stopOpacity="0.7" />
          </linearGradient>
          {chakraColors.map((c, i) => (
            <radialGradient key={i} id={`spiral-bloom-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity="0.7" />
              <stop offset="60%" stopColor={c} stopOpacity="0.22" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="spiral-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* The spiral itself — rotates slowly, colored with chakra gradient */}
        <g className={styles.spiralLayer}>
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="url(#spiral-gradient)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* Seven glowing blooms travelling the spiral — rotates with the spiral */}
        <g className={styles.bloomLayer}>
          {bloomStops.map((stop, i) => (
            <g
              key={i}
              className={styles.bloom}
              style={{ animationDelay: `${-i * 0.8}s` }}
            >
              <circle
                cx={stop.x}
                cy={stop.y}
                r={14 - i * 0.8}
                fill={`url(#spiral-bloom-${i})`}
                filter="url(#spiral-blur)"
              />
              <circle
                cx={stop.x}
                cy={stop.y}
                r="1.8"
                fill={stop.color}
                opacity="0.9"
              />
            </g>
          ))}
        </g>

        {/* Center point — the still heart */}
        <circle
          cx={cx}
          cy={cy}
          r="3"
          fill="var(--text-illustration-bright)"
          opacity="0.8"
          className={styles.center}
        />
      </svg>
    </div>
  );
}
