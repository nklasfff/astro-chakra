import { CHAKRAS } from '../../engine/chakras';
import styles from './ChakraLadder.module.css';

/**
 * The seven chakras as a vertical ladder, bottom to top.
 * The active chakra blooms; the others are quiet circles.
 * Mirrors 9Lives' LifeArc — the signature hero visualization.
 */
export default function ChakraLadder({ activePhaseIndex = 0, age, spiral = 1 }) {
  // Layout: 7 points stacked, root at bottom (index 0) → crown at top (index 6)
  const pointCount = 7;
  const topY = 40;
  const bottomY = 420;
  const spacing = (bottomY - topY) / (pointCount - 1);
  const centerX = 140;

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 280 460" className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={`g${i}`} id={`bloom${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.55" />
              <stop offset="60%" stopColor={c.hex} stopOpacity="0.15" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Central axis — the sushumna */}
        <line
          x1={centerX}
          y1={topY - 20}
          x2={centerX}
          y2={bottomY + 20}
          stroke="var(--line-faint)"
          strokeWidth="0.8"
          strokeDasharray="1 4"
        />

        {/* Seven chakra points — bottom (root) to top (crown) */}
        {CHAKRAS.map((chakra, i) => {
          const y = bottomY - i * spacing;
          const isActive = i === activePhaseIndex;
          const isPast = i < activePhaseIndex;
          const radius = isActive ? 14 : 5;
          const bloomRadius = isActive ? 44 : 20;

          return (
            <g key={chakra.id} className={isActive ? styles.activeGroup : ''}>
              {/* Bloom halo */}
              <circle
                cx={centerX}
                cy={y}
                r={bloomRadius}
                fill={`url(#bloom${i})`}
                opacity={isActive ? 1 : isPast ? 0.55 : 0.25}
              />
              {/* Outline ring */}
              <circle
                cx={centerX}
                cy={y}
                r={isActive ? 18 : 8}
                fill="none"
                stroke={chakra.hex}
                strokeWidth="0.9"
                opacity={isActive ? 0.7 : isPast ? 0.4 : 0.2}
              />
              {/* Core dot */}
              <circle
                cx={centerX}
                cy={y}
                r={radius / 3.5}
                fill={chakra.hex}
                opacity={isActive ? 0.95 : isPast ? 0.55 : 0.3}
              />
              {/* Label */}
              <text
                x={centerX + (isActive ? 44 : 30)}
                y={y + 3.5}
                fontSize={isActive ? '10.5' : '9'}
                fontFamily="var(--font-display)"
                fontStyle="italic"
                fill={isActive ? chakra.hex : 'var(--text-illustration)'}
                opacity={isActive ? 1 : isPast ? 0.7 : 0.45}
              >
                {chakra.name}
              </text>
              {/* Age range — only on active */}
              {isActive && (
                <text
                  x={centerX - 44}
                  y={y + 3.5}
                  fontSize="8"
                  textAnchor="end"
                  fontFamily="var(--font-body)"
                  fill="var(--text-illustration)"
                  opacity="0.7"
                >
                  {chakra.ageRange.start}–{chakra.ageRange.end}
                </text>
              )}
            </g>
          );
        })}

        {/* Current age marker — small dot on the axis */}
        {age != null && (() => {
          const ageInSpiral = age % 49;
          const exactY = bottomY - (ageInSpiral / 49) * (bottomY - topY);
          return (
            <g>
              <line
                x1={centerX - 6}
                y1={exactY}
                x2={centerX + 6}
                y2={exactY}
                stroke="var(--line-strong)"
                strokeWidth="0.8"
              />
            </g>
          );
        })()}

        {/* Spiral indicator */}
        {spiral > 1 && (
          <text
            x={centerX}
            y={bottomY + 38}
            fontSize="8"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill="var(--text-illustration)"
            opacity="0.7"
          >
            spiral {spiral}
          </text>
        )}
      </svg>
    </div>
  );
}
