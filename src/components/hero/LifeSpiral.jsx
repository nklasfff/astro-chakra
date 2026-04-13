import { useMemo, useCallback } from 'react';
import { CHAKRAS } from '../../engine/chakras';
import styles from './LifeSpiral.module.css';

/**
 * A single continuous watercolor spiral representing a whole life.
 * Colors sweep through the 7 chakra hues as it turns.
 * One glowing bead marks the user's current age.
 * Tapping anywhere on the spiral navigates to that age.
 *
 * The spiral grows with the person — a 5-year-old sees a small arc,
 * a 75-year-old sees 1.5 full turns, a 105-year-old sees 2+ turns.
 * No "spiral 1, 2, 3" to switch — just one life, one spiral.
 *
 * feTurbulence + feDisplacementMap gives the path a hand-painted edge.
 */

const CYCLE = 49; // one full turn = 49 years (one chakra cycle)

function ageToChakraIndex(age) {
  return Math.min(6, Math.floor((age % CYCLE) / 7));
}

function ageToColor(age) {
  return CHAKRAS[ageToChakraIndex(age)].hex;
}

export default function LifeSpiral({
  currentAge = 40,
  selectedAge,
  onSelectAge,
  maxAge = 98, // how far the spiral extends
  size = 340,
}) {
  const cx = 180;
  const cy = 180;
  const viewBox = 360;

  // Build spiral points from age 0 to maxAge
  // Each full turn = CYCLE years, mapped to 360°
  // Radius grows outward from a small center
  const minR = 18;
  const maxR = 155;
  const totalTurns = maxAge / CYCLE;

  const ageToPoint = useCallback(
    (age) => {
      const t = age / CYCLE; // turns completed
      const angle = t * Math.PI * 2 - Math.PI / 2; // start at top
      const r = minR + (t / totalTurns) * (maxR - minR);
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      };
    },
    [cx, cy, totalTurns, minR, maxR]
  );

  // Generate path segments — one per year, colored by chakra
  const segments = useMemo(() => {
    const segs = [];
    const effectiveMax = Math.min(maxAge, 147);
    for (let age = 0; age <= effectiveMax; age++) {
      const p = ageToPoint(age);
      segs.push({
        age,
        x: p.x,
        y: p.y,
        color: ageToColor(age),
        chakraIndex: ageToChakraIndex(age),
        isPast: age <= currentAge,
        isFuture: age > currentAge,
      });
    }
    return segs;
  }, [currentAge, maxAge, ageToPoint]);

  // Build the SVG path as one continuous polyline
  const pathD = useMemo(() => {
    if (segments.length < 2) return '';
    return (
      'M ' +
      segments.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(' L ')
    );
  }, [segments]);

  // Current and selected positions
  const currentPoint = ageToPoint(currentAge);
  const selectedPoint =
    selectedAge != null && selectedAge !== currentAge
      ? ageToPoint(selectedAge)
      : null;

  // Handle clicks on the spiral — find nearest age
  const handleClick = useCallback(
    (e) => {
      if (!onSelectAge) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBox / rect.width;
      const scaleY = viewBox / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Find the segment closest to the click
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < segments.length; i++) {
        const dx = segments[i].x - clickX;
        const dy = segments[i].y - clickY;
        const dist = dx * dx + dy * dy;
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }
      // Only register if click is reasonably close to the spiral
      if (Math.sqrt(closestDist) < 25) {
        onSelectAge(segments[closest].age);
      }
    },
    [onSelectAge, segments, viewBox]
  );

  // Build colored gradient stops along the path
  const gradientStops = useMemo(() => {
    const stops = [];
    for (let i = 0; i <= 48; i++) {
      const age = Math.round((i / 48) * maxAge);
      const pct = ((i / 48) * 100).toFixed(1);
      stops.push(
        <stop
          key={i}
          offset={`${pct}%`}
          stopColor={ageToColor(age)}
          stopOpacity={age <= currentAge ? '0.7' : '0.2'}
        />
      );
    }
    return stops;
  }, [currentAge, maxAge]);

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        className={styles.svg}
        aria-hidden="true"
        onClick={handleClick}
        style={{ cursor: onSelectAge ? 'pointer' : 'default' }}
      >
        <defs>
          {/* Watercolor texture filter */}
          <filter id="spiral-watercolor" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradient that follows the spiral path */}
          <linearGradient id="spiral-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientStops}
          </linearGradient>

          {/* Glow for beads */}
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`spiral-glow-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.9" />
              <stop offset="60%" stopColor={c.hex} stopOpacity="0.3" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* The spiral path — watercolor-textured */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#spiral-path-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#spiral-watercolor)"
          className={styles.spiralPath}
        />

        {/* Chakra transition markers — small dots where the decade changes */}
        {segments
          .filter((s) => s.age > 0 && s.age % 7 === 0 && s.age <= currentAge + 7)
          .map((s) => (
            <circle
              key={`mark-${s.age}`}
              cx={s.x}
              cy={s.y}
              r="2"
              fill={s.color}
              opacity={s.isPast ? 0.7 : 0.25}
            />
          ))}

        {/* Selected age bead */}
        {selectedPoint && (
          <g>
            <circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="10"
              fill={`url(#spiral-glow-${ageToChakraIndex(selectedAge)})`}
            />
            <circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="5"
              fill="none"
              stroke="var(--text-bright)"
              strokeWidth="1.2"
              opacity="0.85"
            />
          </g>
        )}

        {/* Current age bead — the pulsing marker */}
        <g className={styles.currentBead}>
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="14"
            fill={`url(#spiral-glow-${ageToChakraIndex(currentAge)})`}
          />
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="6"
            fill="var(--bg)"
            stroke={ageToColor(currentAge)}
            strokeWidth="1.5"
          />
          <text
            x={currentPoint.x}
            y={currentPoint.y + 3.5}
            textAnchor="middle"
            fontSize="7"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill={ageToColor(currentAge)}
            style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
          >
            {currentAge}
          </text>
        </g>

        {/* Center — birth point */}
        <circle
          cx={segments[0]?.x || cx}
          cy={segments[0]?.y || cy}
          r="3"
          fill="var(--text-illustration-bright)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
