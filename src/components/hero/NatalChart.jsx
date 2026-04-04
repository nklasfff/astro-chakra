import { useMemo } from 'react';
import { SIGNS } from '../../engine/zodiac';
import { computeNatalAspects } from '../../engine/transits';
import styles from './NatalChart.module.css';

/**
 * Circular natal chart SVG — the zodiac wheel with planets placed at their
 * ecliptic longitudes, plus aspect lines connecting significant pairs.
 *
 * Traditional orientation: 0° Aries on the left (9 o'clock), zodiac progressing
 * counter-clockwise. Each sign occupies exactly 30° of the wheel.
 */
export default function NatalChart({ chart, size = 360, showAspects = true }) {
  const aspects = useMemo(
    () => (showAspects && chart ? computeNatalAspects(chart) : []),
    [chart, showAspects]
  );

  if (!chart) return null;

  const cx = 200;
  const cy = 200;
  const outerR = 184;       // outermost boundary
  const signOuterR = 180;   // sign glyphs outer edge
  const signInnerR = 142;   // sign band inner edge
  const planetR = 108;      // where planets sit
  const aspectR = 76;       // aspect lines reach inside this radius
  const centerR = 28;

  // Traditional: 0° Aries is at 9 o'clock, zodiac increases counter-clockwise.
  // SVG angles: clockwise from 3 o'clock. So svgAngle = 180° - eclipticLongitude.
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

  const aspectColor = {
    conjunction: 'var(--text-secondary)',
    trine: 'var(--chakra-heart)',
    sextile: 'var(--chakra-throat)',
    square: 'var(--chakra-root)',
    opposition: 'var(--chakra-crown)',
  };

  const aspectOpacity = (orb) => Math.max(0.18, 0.55 - orb * 0.05);

  // Arc sector path for each sign's element wash.
  const sectorPath = (startLon, endLon, innerR, outerR_) => {
    const p1 = polar(startLon, innerR);
    const p2 = polar(startLon, outerR_);
    const p3 = polar(endLon, outerR_);
    const p4 = polar(endLon, innerR);
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR_} ${outerR_} 0 0 0 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 1 ${p1.x} ${p1.y} Z`;
  };

  const laidOutPlanets = layoutPlanets(chart.planets);

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 400 400" className={styles.svg} aria-hidden="true">
        <defs>
          <filter id="natal-glow">
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

        {/* Cardinal cross — subtle anchoring at 0°, 90°, 180°, 270° */}
        {[0, 90, 180, 270].map((angle) => {
          const p1 = polar(angle, centerR + 6);
          const p2 = polar(angle, signInnerR - 2);
          return (
            <line
              key={`cardinal-${angle}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--line-faint)"
              strokeWidth="0.4"
            />
          );
        })}

        {/* Aspect lines between planets */}
        {aspects.map((a, i) => {
          const pA = polar(laidOutPlanets.find(p => p.id === a.a.id).longitude, aspectR);
          const pB = polar(laidOutPlanets.find(p => p.id === a.b.id).longitude, aspectR);
          return (
            <line
              key={`aspect-${i}`}
              x1={pA.x}
              y1={pA.y}
              x2={pB.x}
              y2={pB.y}
              stroke={aspectColor[a.aspect.id]}
              strokeWidth={a.aspect.id === 'conjunction' ? 0 : 0.9}
              opacity={aspectOpacity(a.orb)}
              strokeLinecap="round"
            />
          );
        })}

        {/* Ring boundaries */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--line-medium)" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r={signInnerR} fill="none" stroke="var(--line-subtle)" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={aspectR} fill="none" stroke="var(--line-faint)" strokeWidth="0.4" strokeDasharray="1 4" />
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

        {/* Degree tick marks — 5° minor, 10° major, 30° sign divs already drawn */}
        {Array.from({ length: 72 }, (_, i) => {
          const lon = i * 5;
          if (lon % 30 === 0) return null; // skip where sign divisions already exist
          const isMajor = i % 2 === 0;
          const tickLen = isMajor ? 6 : 3;
          const p1 = polar(lon, signInnerR - tickLen);
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
              opacity="0.6"
            />
          );
        })}

        {/* Planet position markers — precise radial guide from ring to planet */}
        {laidOutPlanets.map((p) => {
          const ringPoint = polar(p.longitude, signInnerR);
          const planetR_ = planetR - p.radiusOffset * 26;
          const planetPoint = polar(p.longitude, planetR_);
          const chakraColor = `var(--chakra-${p.chakra})`;
          return (
            <g key={`guide-${p.id}`}>
              {/* Thin radial guide from ring to planet position */}
              <line
                x1={ringPoint.x}
                y1={ringPoint.y}
                x2={planetPoint.x}
                y2={planetPoint.y}
                stroke={chakraColor}
                strokeWidth="0.5"
                opacity="0.35"
              />
              {/* Position tick on the ring — strong mark at exact longitude */}
              <circle
                cx={ringPoint.x}
                cy={ringPoint.y}
                r="1.8"
                fill={chakraColor}
              />
            </g>
          );
        })}

        {/* Planet glyphs themselves */}
        {laidOutPlanets.map((p) => (
          <Planet key={p.id} planetR={planetR} polar={polar} planet={p} />
        ))}

        {/* Center */}
        <circle cx={cx} cy={cy} r="4" fill="var(--text-illustration-bright)" opacity="0.9" />
      </svg>
    </div>
  );
}

/**
 * Spread planets within ~8° of each other onto different radii to avoid overlap.
 */
function layoutPlanets(planets) {
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude);
  const placed = [];
  const threshold = 8;

  for (const planet of sorted) {
    let offset = 0;
    // Find smallest offset that doesn't collide
    while (true) {
      const collision = placed.some((p) => {
        if (p.radiusOffset !== offset) return false;
        const diff = Math.abs(planet.longitude - p.longitude);
        const wrapDiff = Math.min(diff, 360 - diff);
        return wrapDiff < threshold;
      });
      if (!collision) break;
      offset += 1;
      if (offset > 3) break; // safety
    }
    placed.push({ ...planet, radiusOffset: offset });
  }
  return placed;
}

function Planet({ planetR, polar, planet }) {
  const r = planetR - planet.radiusOffset * 26;
  const pos = polar(planet.longitude, r);
  const chakraColor = `var(--chakra-${planet.chakra})`;

  return (
    <g>
      {/* Filled background disc behind glyph */}
      <circle cx={pos.x} cy={pos.y} r="14" fill={chakraColor} opacity="0.2" />
      <circle
        cx={pos.x}
        cy={pos.y}
        r="14"
        fill="none"
        stroke={chakraColor}
        strokeWidth="1"
        opacity="0.7"
      />
      {/* Planet glyph */}
      <text
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
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
