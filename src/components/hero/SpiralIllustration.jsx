/**
 * A slow inward spiral drawn in soft line — represents the return,
 * the second spiral, the chakra cycle beginning again at a higher octave.
 */
export default function SpiralIllustration({ color = 'var(--text-illustration)', size = 160 }) {
  // Build an archimedean spiral
  const points = [];
  const turns = 3.2;
  const steps = 180;
  const cx = 100;
  const cy = 100;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = (i / steps) * 78;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-md) 0' }}>
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx={cx} cy={cy} r="2" fill={color} opacity="0.6" />
      </svg>
    </div>
  );
}
