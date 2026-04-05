import { CHAKRAS } from '../../engine/chakras';
import styles from './CosmicDNA.module.css';

/**
 * A pulsing mandala at the center represents the self.
 * Six branches radiate outward showing what the person is made of:
 * Sun sign, Moon sign, current chakra, ruling planet, element, chakra-phase.
 * Each branch ends in a small colored node. The whole form rotates slowly
 * and the core breathes.
 *
 * Inputs: chart (natal chart), chakra (current phase chakra).
 */
export default function CosmicDNA({ chart, chakra, size = 320 }) {
  if (!chart || !chakra) return null;

  const cx = 200;
  const cy = 200;

  const sun = chart.sun;
  const moon = chart.moon;

  // Element to color
  const elementColor = {
    fire: 'var(--chakra-sacral)',
    earth: 'var(--chakra-solar)',
    air: 'var(--chakra-throat)',
    water: 'var(--chakra-thirdeye)',
  };

  const branches = [
    {
      id: 'sun',
      glyph: '☉',
      label: sun.sign.name,
      color: `var(--chakra-${sun.chakra})`,
      element: elementColor[sun.sign.element],
      angle: -90,
    },
    {
      id: 'moon',
      glyph: '☽',
      label: moon.sign.name,
      color: `var(--chakra-${moon.chakra})`,
      element: elementColor[moon.sign.element],
      angle: -30,
    },
    {
      id: 'chakra',
      glyph: chakra.devanagari.charAt(0),
      label: chakra.name,
      color: chakra.hex,
      element: chakra.hex,
      angle: 30,
    },
    {
      id: 'planet',
      glyph: planetGlyph(chakra.planet),
      label: chakra.planet,
      color: chakra.hex,
      element: chakra.hex,
      angle: 90,
    },
    {
      id: 'sunelement',
      glyph: elementGlyph(sun.sign.element),
      label: sun.sign.element,
      color: elementColor[sun.sign.element],
      element: elementColor[sun.sign.element],
      angle: 150,
    },
    {
      id: 'moonelement',
      glyph: elementGlyph(moon.sign.element),
      label: moon.sign.element,
      color: elementColor[moon.sign.element],
      element: elementColor[moon.sign.element],
      angle: 210,
    },
  ];

  const branchR = 144;
  const nodeR = 152;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 400 400" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`dna-petal-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.7" />
              <stop offset="55%" stopColor={c.hex} stopOpacity="0.25" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id="dna-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={chakra.hex} stopOpacity="0.75" />
            <stop offset="50%" stopColor={chakra.hex} stopOpacity="0.3" />
            <stop offset="100%" stopColor={chakra.hex} stopOpacity="0" />
          </radialGradient>
          <filter id="dna-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="dna-softblur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>

        {/* Outer orbital ring — rotates slowly counter-clockwise */}
        <g className={styles.outerRing}>
          <circle
            cx={cx}
            cy={cy}
            r="170"
            fill="none"
            stroke="var(--line-faint)"
            strokeWidth="0.6"
            strokeDasharray="1 8"
          />
        </g>

        {/* Seven chakra petal halo — core mandala, rotates clockwise */}
        <g className={styles.petalRing}>
          {CHAKRAS.map((c, i) => {
            const angle = (-90 + i * (360 / 7)) * (Math.PI / 180);
            const px = cx + 80 * Math.cos(angle);
            const py = cy + 80 * Math.sin(angle);
            return (
              <g
                key={c.id}
                className={styles.petal}
                style={{ animationDelay: `${-i * 0.8}s` }}
              >
                <circle
                  cx={px}
                  cy={py}
                  r="36"
                  fill={`url(#dna-petal-${i})`}
                  filter="url(#dna-blur)"
                />
              </g>
            );
          })}
        </g>

        {/* Connection lines from center to each branch node — static */}
        {branches.map((b, i) => {
          const rad = (b.angle * Math.PI) / 180;
          const x1 = cx + 42 * Math.cos(rad);
          const y1 = cy + 42 * Math.sin(rad);
          const x2 = cx + branchR * Math.cos(rad);
          const y2 = cy + branchR * Math.sin(rad);
          return (
            <line
              key={`line-${b.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={b.color}
              strokeWidth="0.6"
              opacity="0.3"
              strokeDasharray="1 3"
            />
          );
        })}

        {/* Branch nodes — DNA strands */}
        {branches.map((b, i) => {
          const rad = (b.angle * Math.PI) / 180;
          const x = cx + nodeR * Math.cos(rad);
          const y = cy + nodeR * Math.sin(rad);
          return (
            <g
              key={b.id}
              className={styles.branchNode}
              style={{ animationDelay: `${-i * 0.5}s` }}
            >
              {/* Glow halo */}
              <circle
                cx={x}
                cy={y}
                r="22"
                fill={b.element}
                opacity="0.22"
                filter="url(#dna-softblur)"
              />
              {/* Node ring */}
              <circle
                cx={x}
                cy={y}
                r="17"
                fill="var(--bg)"
                stroke={b.color}
                strokeWidth="1.2"
                opacity="0.85"
              />
              {/* Glyph */}
              <text
                x={x}
                y={y - 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="15"
                fontFamily="var(--font-display)"
                fontWeight="300"
                fill={b.color}
                style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
              >
                {b.glyph}
              </text>
              {/* Label */}
              <text
                x={x}
                y={y + 30}
                textAnchor="middle"
                fontSize="8"
                fontFamily="var(--font-body)"
                fontWeight="500"
                letterSpacing="0.6"
                fill="var(--text-secondary)"
              >
                {b.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Central core mandala — breathes */}
        <g className={styles.core}>
          <circle cx={cx} cy={cy} r="60" fill="url(#dna-core)" filter="url(#dna-blur)" />
          <circle
            cx={cx}
            cy={cy}
            r="34"
            fill="var(--bg)"
            opacity="0.85"
          />
          <circle
            cx={cx}
            cy={cy}
            r="28"
            fill="none"
            stroke={chakra.hex}
            strokeWidth="0.9"
            opacity="0.6"
          />
        </g>

        {/* Inner still point */}
        <circle cx={cx} cy={cy} r="3" fill={chakra.hex} opacity="0.9" />
      </svg>
    </div>
  );
}

function planetGlyph(planetName) {
  const map = {
    Saturn: '♄',
    Moon: '☽',
    Sun: '☉',
    Venus: '♀',
    Mercury: '☿',
    Jupiter: '♃',
    Neptune: '♆',
    Mars: '♂',
    Uranus: '♅',
  };
  return map[planetName] || '●';
}

function elementGlyph(element) {
  const map = {
    fire: '△',
    earth: '▽',
    air: '△',
    water: '▽',
  };
  // Use subtly different positions — but Western astrology elements have
  // specific alchemical glyphs. Use simpler shapes for clarity.
  const alchemy = {
    fire: '🜂',
    earth: '🜃',
    air: '🜁',
    water: '🜄',
  };
  return alchemy[element] || '·';
}
