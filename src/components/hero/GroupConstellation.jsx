import styles from './GroupConstellation.module.css';

/**
 * A circular group mandala. Each person sits on a circle, represented as
 * a small watercolor disc in their primary chakra's color. Lines between
 * them are drawn in the color that matches their pair-relationship type.
 * The whole thing breathes slowly.
 */
const TYPE_COLOR = {
  resonance: 'var(--text-secondary)',
  flow: 'var(--chakra-heart)',
  bridge: 'var(--chakra-throat)',
  contrast: 'var(--chakra-root)',
};

export default function GroupConstellation({ people = [], pairs = [], size = 300 }) {
  if (!people || people.length < 2) return null;

  const cx = 150;
  const cy = 150;
  const r = 100;
  const n = people.length;

  // Place each person around the circle
  const positions = people.map((person, i) => {
    const angle = -90 + (i / n) * 360;
    const rad = (angle * Math.PI) / 180;
    return {
      person,
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  });

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <filter id="group-blur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Background circle — the field */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--line-faint)"
          strokeWidth="0.5"
          strokeDasharray="1 6"
        />

        {/* Pair connection lines */}
        {pairs.map((pair, i) => {
          const pa = positions.find((p) => p.person.id === pair.a.id);
          const pb = positions.find((p) => p.person.id === pair.b.id);
          if (!pa || !pb) return null;
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={TYPE_COLOR[pair.type] || 'var(--line-subtle)'}
              strokeWidth={pair.type === 'resonance' ? '0.6' : '0.9'}
              strokeDasharray={pair.type === 'resonance' ? '1 3' : undefined}
              opacity="0.55"
              className={styles.connection}
              style={{ animationDelay: `${-i * 0.7}s` }}
            />
          );
        })}

        {/* Each person — watercolor disc + devanagari glyph */}
        {positions.map(({ person, x, y }, i) => (
          <g
            key={person.id}
            className={styles.person}
            style={{ animationDelay: `${-i * 0.9}s` }}
          >
            {/* Glow halo */}
            <circle
              cx={x}
              cy={y}
              r="20"
              fill={person.chakraHex}
              opacity="0.22"
              filter="url(#group-blur)"
            />
            {/* Core disc */}
            <circle
              cx={x}
              cy={y}
              r="14"
              fill="var(--bg)"
              stroke={person.chakraHex}
              strokeWidth="1.2"
              opacity="0.95"
            />
            {/* Devanagari glyph */}
            <text
              x={x}
              y={y - 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontFamily="var(--font-display)"
              fill={person.chakraHex}
              style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
            >
              {person.chakraDevanagari?.charAt(0) || ''}
            </text>
            {/* Name below */}
            <text
              x={x}
              y={y + 28}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-display)"
              fontStyle="italic"
              fill="var(--text-secondary)"
            >
              {person.name}
            </text>
          </g>
        ))}

        {/* Center dot — the field's still point */}
        <circle
          cx={cx}
          cy={cy}
          r="2.5"
          fill="var(--text-illustration-bright)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
