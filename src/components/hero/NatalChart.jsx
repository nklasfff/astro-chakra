import { SIGNS } from '../../engine/zodiac';
import styles from './NatalChart.module.css';

/**
 * Circular natal chart SVG — the zodiac wheel with planets placed at their
 * ecliptic longitudes. Watercolor aesthetic: soft washes for each sign's
 * element, planet glyphs glowing in their chakra-linked colors.
 *
 * Layout:
 *   outer ring  : 12 signs (30° each) with glyphs
 *   middle ring : degree marks
 *   inner disc  : planet positions
 *
 * The chart is drawn with 0° Aries at 9 o'clock (left), angles increasing
 * counter-clockwise — the traditional astrological orientation.
 */
export default function NatalChart({ chart, size = 340 }) {
  if (!chart) return null;

  const cx = 200;
  const cy = 200;
  const outerR = 180;
  const signR = 165;
  const middleR = 138;
  const planetR = 100;
  const centerR = 40;

  // Ecliptic angle → SVG angle. In a traditional chart, 0° Aries is on the
  // left (9 o'clock), increasing counter-clockwise. SVG angles go clockwise
  // from 3 o'clock, so we map: svgAngle = 180 - eclipticLongitude.
  const eclipticToRadians = (lon) => ((180 - lon) * Math.PI) / 180;
  const polar = (lon, r) => {
    const a = eclipticToRadians(lon);
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };

  const elementColor = {
    fire: 'var(--chakra-sacral)',
    earth: 'var(--chakra-solar)',
    air: 'var(--chakra-throat)',
    water: 'var(--chakra-thirdeye)',
  };

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 400 400" className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id="chart-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
          </radialGradient>
          <filter id="planet-glow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Outer boundary */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--line-subtle)" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={middleR} fill="none" stroke="var(--line-faint)" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={centerR} fill="none" stroke="var(--line-subtle)" strokeWidth="0.5" />

        {/* Sign divisions (every 30°) */}
        {SIGNS.map((sign, i) => {
          const startLon = i * 30;
          const p1 = polar(startLon, middleR);
          const p2 = polar(startLon, outerR);
          return (
            <line
              key={`div-${sign.id}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--line-subtle)"
              strokeWidth="0.6"
            />
          );
        })}

        {/* Element wash behind each sign */}
        {SIGNS.map((sign, i) => {
          const midLon = i * 30 + 15;
          const p = polar(midLon, (middleR + outerR) / 2);
          return (
            <circle
              key={`wash-${sign.id}`}
              cx={p.x}
              cy={p.y}
              r="18"
              fill={elementColor[sign.element]}
              opacity="0.08"
              filter="url(#planet-glow)"
            />
          );
        })}

        {/* Sign glyphs + names */}
        {SIGNS.map((sign, i) => {
          const midLon = i * 30 + 15;
          const p = polar(midLon, signR);
          return (
            <g key={`sign-${sign.id}`}>
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontFamily="var(--font-display)"
                fill={elementColor[sign.element]}
                opacity="0.85"
              >
                {sign.glyph}
              </text>
              <text
                x={p.x}
                y={p.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="6.5"
                fontFamily="var(--font-body)"
                fill="var(--text-muted)"
                opacity="0.6"
                letterSpacing="0.5"
              >
                {sign.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Degree tick marks every 5° */}
        {Array.from({ length: 72 }, (_, i) => {
          const lon = i * 5;
          const isMajor = i % 6 === 0; // every 30°
          const inner = isMajor ? middleR - 6 : middleR - 3;
          const p1 = polar(lon, inner);
          const p2 = polar(lon, middleR);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--line-faint)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Planet positions — with spreading to prevent overlap */}
        {layoutPlanets(chart.planets).map((p) => (
          <Planet key={p.id} cx={cx} cy={cy} radius={planetR} polar={polar} planet={p} />
        ))}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="var(--text-illustration-bright)" opacity="0.7" />
      </svg>
    </div>
  );
}

/**
 * Spread planets that are within 5° of each other onto slightly different radii
 * to prevent glyph overlap.
 */
function layoutPlanets(planets) {
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);
  const spread = new Map();
  const threshold = 7;
  for (let i = 0; i < sorted.length; i++) {
    let offset = 0;
    for (let j = 0; j < i; j++) {
      const diff = Math.abs(sorted[i].longitude - sorted[j].longitude);
      const wrapDiff = Math.min(diff, 360 - diff);
      if (wrapDiff < threshold) {
        offset = (spread.get(sorted[j].id) || 0) + 1;
      }
    }
    spread.set(sorted[i].id, offset);
  }
  return sorted.map((p) => ({ ...p, radiusOffset: spread.get(p.id) || 0 }));
}

function Planet({ cx, cy, radius, polar, planet }) {
  const r = radius - planet.radiusOffset * 18;
  const pos = polar(planet.longitude, r);
  const chakraColor = `var(--chakra-${planet.chakra})`;

  return (
    <g>
      {/* Planet glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r="11"
        fill={chakraColor}
        opacity="0.18"
      />
      {/* Planet glyph */}
      <text
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontFamily="var(--font-display)"
        fill={chakraColor}
        style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
      >
        {planet.glyph}
      </text>
      {/* Thin radial line to the zodiac wheel */}
      <line
        x1={pos.x}
        y1={pos.y}
        x2={polar(planet.longitude, radius + 38).x}
        y2={polar(planet.longitude, radius + 38).y}
        stroke={chakraColor}
        strokeWidth="0.4"
        opacity="0.3"
      />
    </g>
  );
}
