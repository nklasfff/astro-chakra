import styles from './MoonPhase.module.css';

/**
 * SVG illustration of the moon at a given phase (0 = new, 0.5 = full).
 * Uses two overlapping circles with masking to create the terminator.
 */
export default function MoonPhase({ phase = 0, size = 80 }) {
  const cx = 50;
  const cy = 50;
  const r = 34;

  // Phase 0 = new (fully dark), 0.5 = full, 1 = new again.
  // Waxing (0 → 0.5): light grows from right. Waning (0.5 → 1): light fades from right.
  const waxing = phase <= 0.5;
  // Fraction of lit side (0 = new, 1 = full)
  const lit = waxing ? phase * 2 : (1 - phase) * 2;

  // The terminator is an ellipse whose width depends on phase.
  // At lit = 0.5, the terminator is a straight line (rx = 0).
  // At lit = 0 or 1, terminator = full circle (rx = r).
  const ellipseRx = r * Math.abs(1 - 2 * lit);
  const darkOnRight = lit < 0.5;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={styles.moon} aria-hidden="true">
      <defs>
        <radialGradient id="moon-surface" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--text-illustration-bright)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--text-illustration)" stopOpacity="0.65" />
        </radialGradient>
        <filter id="moon-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Soft halo */}
      <circle cx={cx} cy={cy} r={r + 8} fill="var(--chakra-sacral)" opacity="0.12" filter="url(#moon-glow)" />

      {/* Dark moon base */}
      <circle cx={cx} cy={cy} r={r} fill="var(--bg-elevated)" stroke="var(--line-subtle)" strokeWidth="0.8" />

      {/* Lit portion */}
      <g>
        <defs>
          <clipPath id={`moon-clip-${phase.toFixed(3)}`}>
            {waxing ? (
              // Waxing: light on right, semicircle right side
              <rect x={cx} y={cy - r} width={r} height={r * 2} />
            ) : (
              // Waning: light on left, semicircle left side
              <rect x={cx - r} y={cy - r} width={r} height={r * 2} />
            )}
          </clipPath>
        </defs>

        {/* The half-circle lit portion */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#moon-surface)"
          clipPath={`url(#moon-clip-${phase.toFixed(3)})`}
        />

        {/* The terminator shape — an ellipse that adds/subtracts light */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={ellipseRx}
          ry={r}
          fill={darkOnRight
            ? (waxing ? 'var(--bg-elevated)' : 'url(#moon-surface)')
            : (waxing ? 'url(#moon-surface)' : 'var(--bg-elevated)')}
          clipPath={`url(#moon-clip-${phase.toFixed(3)})`}
        />
      </g>

      {/* Outer rim for definition */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line-medium)" strokeWidth="0.6" />
    </svg>
  );
}
