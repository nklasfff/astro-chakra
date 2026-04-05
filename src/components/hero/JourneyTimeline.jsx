import { CHAKRAS } from '../../engine/chakras';
import { getSpiralMatrix } from '../../engine/chakraJourney';
import styles from './JourneyTimeline.module.css';

/**
 * A 7x7 matrix visualization of a life spiral — rendered as 49 circles.
 * Rows = chakra decades (root at bottom, crown at top).
 * Columns = years within decade (sub-chakras from left to right).
 * Each circle is coloured by a blend of its decade chakra + sub-chakra.
 * The user's current position is highlighted with a pulsing ring.
 *
 * Interactive: tapping a circle notifies the parent of the new age.
 */
export default function JourneyTimeline({
  spiral = 1,
  currentAge,
  selectedAge,
  onSelectAge,
  size = 340,
}) {
  const cells = getSpiralMatrix(spiral);
  const selectedInSpiral =
    selectedAge != null && selectedAge >= (spiral - 1) * 49 && selectedAge < spiral * 49;
  const currentInSpiral =
    currentAge != null && currentAge >= (spiral - 1) * 49 && currentAge < spiral * 49;

  const gridPadding = 30;
  const labelWidth = 22;
  const viewBox = 360;
  const usableW = viewBox - gridPadding * 2 - labelWidth;
  const cellW = usableW / 7;
  const circleR = cellW / 2 - 1; // slightly less than cell to leave breathing room

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`cellgrad-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.55" />
              <stop offset="70%" stopColor={c.hex} stopOpacity="0.22" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0.05" />
            </radialGradient>
          ))}
        </defs>

        {/* Column header labels (sub-chakras, top) */}
        {CHAKRAS.map((c, i) => {
          const cx = gridPadding + labelWidth + i * cellW + cellW / 2;
          return (
            <text
              key={`col-${c.id}`}
              x={cx}
              y={gridPadding - 12}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-display)"
              fill={c.hex}
              opacity="0.9"
              style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
            >
              {c.devanagari.charAt(0)}
            </text>
          );
        })}

        {/* Row header labels (decade chakras, left side) */}
        {CHAKRAS.map((c, i) => {
          const rowIndex = 6 - i;
          const cy = gridPadding + rowIndex * cellW + cellW / 2 + 4;
          return (
            <text
              key={`row-${c.id}`}
              x={gridPadding + labelWidth - 8}
              y={cy}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-display)"
              fill={c.hex}
              opacity="0.9"
              style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
            >
              {c.devanagari.charAt(0)}
            </text>
          );
        })}

        {/* 49 circles */}
        {cells.map((cell, idx) => {
          const row = 6 - cell.decadeIndex;
          const col = cell.yearInDecade;
          const cx = gridPadding + labelWidth + col * cellW + cellW / 2;
          const cy = gridPadding + row * cellW + cellW / 2;

          const isSelected = selectedInSpiral && cell.age === selectedAge;
          const isCurrent = currentInSpiral && cell.age === currentAge;
          const isPast = currentInSpiral && cell.age < currentAge;
          const isFuture = currentInSpiral && cell.age > currentAge;

          return (
            <g
              key={idx}
              className={styles.cell}
              onClick={() => onSelectAge && onSelectAge(cell.age)}
              style={{ cursor: onSelectAge ? 'pointer' : 'default' }}
            >
              {/* Base watercolor wash — decade chakra */}
              <circle
                cx={cx}
                cy={cy}
                r={circleR}
                fill={`url(#cellgrad-${cell.decadeIndex})`}
                opacity={isFuture ? 0.5 : 1}
              />
              {/* Sub-chakra wash on top */}
              <circle
                cx={cx}
                cy={cy}
                r={circleR}
                fill={`url(#cellgrad-${cell.subIndex})`}
                opacity={isFuture ? 0.4 : 0.75}
              />
              {/* Thin colored outline for definition */}
              <circle
                cx={cx}
                cy={cy}
                r={circleR}
                fill="none"
                stroke={cell.primary.hex}
                strokeWidth="0.6"
                opacity={isFuture ? 0.25 : 0.45}
              />
              {/* Current / selected indicator */}
              {isCurrent && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={circleR + 1}
                  fill="none"
                  stroke={cell.primary.hex}
                  strokeWidth="2"
                  opacity="0.95"
                  className={styles.currentPulse}
                />
              )}
              {isSelected && !isCurrent && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={circleR + 1}
                  fill="none"
                  stroke="var(--text-bright)"
                  strokeWidth="1.4"
                  opacity="0.9"
                />
              )}
              {/* Past marker — small dot */}
              {isPast && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="1.4"
                  fill="var(--text-illustration)"
                  opacity="0.5"
                />
              )}
              {/* Age on current cell */}
              {isCurrent && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-display)"
                  fontStyle="italic"
                  fontWeight="500"
                  fill={cell.primary.hex}
                  style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
                >
                  {currentAge}
                </text>
              )}
            </g>
          );
        })}

        {/* Spiral label — larger for readability on phones */}
        <text
          x={viewBox / 2}
          y={viewBox - 6}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fill="var(--text-secondary)"
          letterSpacing="0.4"
        >
          spiral {spiral} · ages {(spiral - 1) * 49}–{spiral * 49 - 1}
        </text>
      </svg>
    </div>
  );
}
