/**
 * A soft watercolor bloom — organic, painted-looking circle with soft edges.
 * Used as a section divider or breathing-room illustration, echoing the
 * reference image's watercolor wheels.
 */
export default function WatercolorBloom({
  colors = ['#c26848', '#d5a743', '#7ea158', '#628db2', '#9f7bc0'],
  size = 220,
  className = '',
}) {
  const n = colors.length;
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-md) 0' }}>
      <svg viewBox="0 0 240 120" width={size} height={size * (120 / 240)} aria-hidden="true">
        <defs>
          {colors.map((c, i) => (
            <radialGradient key={i} id={`bloom-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity="0.55" />
              <stop offset="50%" stopColor={c} stopOpacity="0.22" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="watercolor-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        {/* Soft thread line running through the blooms */}
        <line
          x1="20"
          y1="60"
          x2="220"
          y2="60"
          stroke="var(--line-faint)"
          strokeWidth="0.5"
          strokeDasharray="1 4"
        />
        {colors.map((c, i) => {
          const x = 20 + (i * 200) / (n - 1);
          const y = 60;
          const r = 28;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={`url(#bloom-${i})`}
                filter="url(#watercolor-blur)"
              />
              <circle cx={x} cy={y} r="2" fill={c} opacity="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
