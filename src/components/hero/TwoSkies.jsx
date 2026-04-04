import styles from './TwoSkies.module.css';

/**
 * Two overlapping watercolor circles — two inner skies meeting.
 * Used as the hero for the Relations / synastry page.
 * Each circle has its own breath, and a line of subtle light connects them
 * through the overlap region.
 */
export default function TwoSkies({ size = 260, colorA = 'var(--chakra-heart)', colorB = 'var(--chakra-sacral)' }) {
  const cx1 = 110;
  const cx2 = 190;
  const cy = 150;
  const r = 68;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id="sky-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colorA} stopOpacity="0.42" />
            <stop offset="60%" stopColor={colorA} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sky-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colorB} stopOpacity="0.42" />
            <stop offset="60%" stopColor={colorB} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colorB} stopOpacity="0" />
          </radialGradient>
          <filter id="sky-blur">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* Sky A — left */}
        <g className={styles.skyA}>
          <circle cx={cx1} cy={cy} r={r} fill="url(#sky-a)" filter="url(#sky-blur)" />
          <circle cx={cx1} cy={cy} r={r - 6} fill="none" stroke={colorA} strokeWidth="0.6" opacity="0.5" />
          <circle cx={cx1} cy={cy} r="3" fill={colorA} opacity="0.75" />
        </g>

        {/* Sky B — right */}
        <g className={styles.skyB}>
          <circle cx={cx2} cy={cy} r={r} fill="url(#sky-b)" filter="url(#sky-blur)" />
          <circle cx={cx2} cy={cy} r={r - 6} fill="none" stroke={colorB} strokeWidth="0.6" opacity="0.5" />
          <circle cx={cx2} cy={cy} r="3" fill={colorB} opacity="0.75" />
        </g>

        {/* Connection line through the vesica — the shared territory */}
        <line
          x1={cx1}
          y1={cy}
          x2={cx2}
          y2={cy}
          stroke="var(--text-illustration-bright)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          opacity="0.5"
        />

        {/* Vesica outline — the sacred overlap */}
        <ellipse
          cx="150"
          cy={cy}
          rx="28"
          ry={r - 5}
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="0.4"
          opacity="0.6"
          className={styles.vesica}
        />
      </svg>
    </div>
  );
}
