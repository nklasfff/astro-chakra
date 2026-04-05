import { CHAKRAS } from '../../engine/chakras';
import { getSpiralMatrix } from '../../engine/chakraJourney';
import styles from './JourneyTimeline.module.css';

/**
 * A 7x7 matrix visualization of a life spiral.
 * Rows = chakra decades (root at bottom, crown at top).
 * Columns = years within decade (sub-chakras from left to right).
 * Each cell is colored by BOTH the row chakra and column chakra, lightly.
 * The user's current position is highlighted.
 *
 * Interactive: clicking a cell notifies the parent of the new age.
 */
export default function JourneyTimeline({
  spiral = 1,
  currentAge,
  selectedAge,
  onSelectAge,
  size = 320,
}) {
  const cells = getSpiralMatrix(spiral);
  const selectedInSpiral = selectedAge != null && selectedAge >= (spiral - 1) * 49 && selectedAge < spiral * 49;
  const currentInSpiral = currentAge != null && currentAge >= (spiral - 1) * 49 && currentAge < spiral * 49;

  const gridPadding = 30;
  const labelWidth = 20;
  const viewBox = 360;
  const usableW = viewBox - gridPadding * 2 - labelWidth;
  const usableH = viewBox - gridPadding * 2;
  const cellW = usableW / 7;
  const cellH = usableH / 7;
  const cellMargin = 2;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <linearGradient key={i} id={`cell-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.18" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0.08" />
            </linearGradient>
          ))}
        </defs>

        {/* Column header labels (sub-chakras, top) — devanagari */}
        {CHAKRAS.map((c, i) => {
          const x = gridPadding + labelWidth + i * cellW + cellW / 2;
          return (
            <text
              key={`col-${c.id}`}
              x={x}
              y={gridPadding - 10}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-display)"
              fill={c.hex}
              opacity="0.85"
              style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
            >
              {c.devanagari.charAt(0)}
            </text>
          );
        })}

        {/* Row header labels (decade chakras, right side) — read bottom-up */}
        {CHAKRAS.map((c, i) => {
          // Row 0 is top (crown), row 6 is bottom (root) — so reverse
          const rowIndex = 6 - i;
          const y = gridPadding + rowIndex * cellH + cellH / 2 + 3;
          return (
            <text
              key={`row-${c.id}`}
              x={gridPadding + labelWidth - 6}
              y={y}
              textAnchor="end"
              fontSize="9"
              fontFamily="var(--font-display)"
              fill={c.hex}
              opacity="0.85"
              style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
            >
              {c.devanagari.charAt(0)}
            </text>
          );
        })}

        {/* 49 cells — plotted in grid, root decade at bottom */}
        {cells.map((cell, idx) => {
          // Invert row so root (decadeIndex=0) is at the bottom
          const row = 6 - cell.decadeIndex;
          const col = cell.yearInDecade;
          const x = gridPadding + labelWidth + col * cellW + cellMargin;
          const y = gridPadding + row * cellH + cellMargin;
          const w = cellW - cellMargin * 2;
          const h = cellH - cellMargin * 2;

          const isSelected = selectedInSpiral && cell.age === (selectedAge - (spiral - 1) * 49);
          const isCurrent = currentInSpiral && cell.age === currentAge;
          const isPast = currentInSpiral && cell.age < currentAge;
          const isFuture = currentInSpiral && cell.age > currentAge;

          return (
            <g
              key={idx}
              className={styles.cell}
              onClick={() => onSelectAge && onSelectAge((spiral - 1) * 49 + cell.age)}
              style={{ cursor: onSelectAge ? 'pointer' : 'default' }}
            >
              {/* Base fill — mix of primary and sub */}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="4"
                fill={`url(#cell-${cell.decadeIndex})`}
                opacity={isFuture ? 0.4 : 1}
              />
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="4"
                fill={`url(#cell-${cell.subIndex})`}
                opacity={isFuture ? 0.4 : 0.7}
              />
              {/* Current / selected indicator */}
              {isCurrent && (
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="4"
                  fill="none"
                  stroke={cell.primary.hex}
                  strokeWidth="1.8"
                  opacity="0.95"
                  className={styles.currentPulse}
                />
              )}
              {isSelected && !isCurrent && (
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="4"
                  fill="none"
                  stroke="var(--text-bright)"
                  strokeWidth="1.2"
                  opacity="0.8"
                />
              )}
              {/* Past marker — small dot */}
              {isPast && (
                <circle
                  cx={x + w / 2}
                  cy={y + h / 2}
                  r="1.2"
                  fill="var(--text-illustration)"
                  opacity="0.45"
                />
              )}
              {/* Age label on current cell */}
              {isCurrent && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 3}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-display)"
                  fontStyle="italic"
                  fill={cell.primary.hex}
                  style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
                >
                  {currentAge}
                </text>
              )}
            </g>
          );
        })}

        {/* Spiral label */}
        <text
          x={viewBox / 2}
          y={viewBox - 8}
          textAnchor="middle"
          fontSize="8.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fill="var(--text-muted)"
          letterSpacing="0.5"
        >
          spiral {spiral} · ages {(spiral - 1) * 49}–{spiral * 49 - 1}
        </text>
      </svg>
    </div>
  );
}
