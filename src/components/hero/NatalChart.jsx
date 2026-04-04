import { SIGNS } from '../../engine/zodiac';
import styles from './NatalChart.module.css';

/**
 * Circular natal chart SVG — the zodiac wheel with planets placed at their
 * ecliptic longitudes. Watercolor aesthetic: soft washes for each sign's
 * element, planet glyphs standing in their chakra-linked colors.
 */
export default function NatalChart({ chart, size = 360 }) {
  if (!chart) return null;

  const cx = 200;
  const cy = 200;
  const outerR = 184;       // outer circle
  const signOuterR = 180;   // sign glyphs outer band
  const signInnerR = 142;   // inner edge of sign band
  const planetBaseR = 108;  // planets base ring
  const centerR = 28;

  // In a traditional chart, 0° Aries is at 9 o'clock (left), angles increasing
  // counter-clockwise. SVG angles go clockwise from 3 o'clock, so:
  //   svgAngle = 180° - eclipticLongitude
  const toRad = (lon) => ((180 - lon) * Math.PI) / 180;
  const polar = (lon, r) => {
    const a = toRad(lon);
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };

  const elementColor = {
    fire: 'var(--chakra-sacral)',
    earth: 'var(--chakra-solar)',
    air: 'var(--chakra-throat)',
    water: 'var(--chakra-thirdeye)',
  };

  // Build the sector path for a sign wash
  const sectorPath = (startLon, endLon, innerR, outerR_) => {
    const p1 = polar(startLon, innerR);
    const p2 = polar(startLon, outerR_);
    const p3 = polar(endLon, outerR_);
    const p4 = polar(endLon, innerR);
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR_} ${outerR_} 0 0 0 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 1 ${p1.x} ${p1.y} Z`;
  };

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 400 400" className={styles.svg} aria-hidden="true">
        <defs>
          <filter id="planet-glow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Element washes — colored sectors per sign */}
        {SIGNS.map((sign, i) => (
          <path
            key={`wash-${sign.id}`}
            d={sectorPath(i * 30, (i + 1) * 30, signInnerR, signOuterR)}
            fill={elementColor[sign.element]}
            opacity="0.13"
          />
        ))}

        {/* Ring boundaries */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--line-medium)" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r={signInnerR} fill="none" stroke="var(--line-subtle)" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={planetBaseR} fill="none" stroke="var(--line-faint)" strokeWidth="0.5" strokeDasharray="1 4" />
        <circle cx={cx} cy={cy} r={centerR} fill="none" stroke="var(--line-subtle)" strokeWidth="0.6" />

        {/* Sign division lines */}
        {SIGNS.map((sign, i) => {
          const p1 = polar(i * 30, signInnerR);
          const p2 = polar(i * 30, signOuterR);
          return (
            <line
              key={`div-${sign.id}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--line-subtle)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Sign glyphs + names */}
        {SIGNS.map((sign, i) => {
          const midLon = i * 30 + 15;
          const p = polar(midLon, (signInnerR + signOuterR) / 2);
          return (
            <g key={`sign-${sign.id}`}>
              <text
                x={p.x}
                y={p.y - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontFamily="var(--font-display)"
                fill={elementColor[sign.element]}
                style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
              >
                {sign.glyph}
              </text>
              <text
                x={p.x}
                y={p.y + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="6.5"
                fontFamily="var(--font-body)"
                fontWeight="500"
                fill="var(--text-secondary)"
                letterSpacing="0.6"
              >
                {sign.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Degree tick marks every 5°, stronger every 10° */}
        {Array.from({ length: 72 }, (_, i) => {
          const lon = i * 5;
          const isMajor = i % 2 === 0;
          const inner = isMajor ? signInnerR - 7 : signInnerR - 4;
          const p1 = polar(lon, inner);
          const p2 = polar(lon, signInnerR);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--line-subtle)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Planet positions */}
        {layoutPlanets(chart.planets).map((p) => (
          <Planet key={p.id} planetBaseR={planetBaseR} signInnerR={signInnerR} polar={polar} planet={p} />
        ))}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="4" fill="var(--text-illustration-bright)" opacity="0.9" />
      </svg>
    </div>
  );
}

/**
 * Spread planets that are within ~8° of each other onto different radii
 * to prevent glyph overlap.
 */
function layoutPlanets(planets) {
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);
  const placed = [];
  const threshold = 8;

  for (const planet of sorted) {
    let offset = 0;
    for (const p of placed) {
      const diff = Math.abs(planet.longitude - p.longitude);
      const wrapDiff = Math.min(diff, 360 - diff);
      if (wrapDiff < threshold && p.radiusOffset === offset) {
        offset += 1;
      }
    }
    placed.push({ ...planet, radiusOffset: offset });
  }
  return placed;
}

function Planet({ planetBaseR, signInnerR, polar, planet }) {
  const r = planetBaseR - planet.radiusOffset * 26;
  const pos = polar(planet.longitude, r);
  const chakraColor = `var(--chakra-${planet.chakra})`;
  const tickInner = polar(planet.longitude, signInnerR - 2);
  const tickOuter = polar(planet.longitude, signInnerR + 8);

  return (
    <g>
      {/* Sharp tick on zodiac ring showing exact position */}
      <line
        x1={tickInner.x}
        y1={tickInner.y}
        x2={tickOuter.x}
        y2={tickOuter.y}
        stroke={chakraColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Filled background disc behind glyph for contrast */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r="15"
        fill={chakraColor}
        opacity="0.22"
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r="15"
        fill="none"
        stroke={chakraColor}
        strokeWidth="1.2"
        opacity="0.75"
      />
      {/* Planet glyph */}
      <text
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="17"
        fontFamily="var(--font-display)"
        fontWeight="400"
        fill={chakraColor}
        style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
      >
        {planet.glyph}
      </text>
    </g>
  );
}
