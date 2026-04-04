import { SIGNS } from '../../engine/zodiac';
import styles from './BirthSignature.module.css';

/**
 * A personal mandala: three watercolor blooms representing Sun, Moon, and
 * the current chakra phase — the person's inner triangle. Each bloom
 * breathes at its own tempo. Unique to the user and only drawn here.
 */
export default function BirthSignature({ sun, moon, chakra, size = 260 }) {
  if (!sun || !moon || !chakra) return null;

  const cx = 150;
  const cy = 150;

  const sunColor = `var(--chakra-${sun.chakra})`;
  const moonColor = `var(--chakra-${moon.chakra})`;
  const chakraColor = chakra.hex;

  // Triangle vertices — Sun top, Moon bottom-left, Chakra-phase bottom-right
  const sunPos = { x: cx, y: cy - 58 };
  const moonPos = { x: cx - 52, y: cy + 34 };
  const chakraPos = { x: cx + 52, y: cy + 34 };

  const sunSignGlyph = SIGNS.find((s) => s.id === sun.sign.id)?.glyph;
  const moonSignGlyph = SIGNS.find((s) => s.id === moon.sign.id)?.glyph;

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px` }}>
      <svg viewBox="0 0 300 300" className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id="sig-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={sunColor} stopOpacity="0.55" />
            <stop offset="60%" stopColor={sunColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={sunColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sig-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={moonColor} stopOpacity="0.55" />
            <stop offset="60%" stopColor={moonColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={moonColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sig-chakra" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={chakraColor} stopOpacity="0.55" />
            <stop offset="60%" stopColor={chakraColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={chakraColor} stopOpacity="0" />
          </radialGradient>
          <filter id="sig-blur">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Triangle connecting the three — slowly pulsing outline */}
        <polygon
          points={`${sunPos.x},${sunPos.y} ${moonPos.x},${moonPos.y} ${chakraPos.x},${chakraPos.y}`}
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="0.6"
          opacity="0.7"
          className={styles.triangle}
        />

        {/* Outer anchor ring */}
        <circle
          cx={cx}
          cy={cy}
          r="118"
          fill="none"
          stroke="var(--line-faint)"
          strokeWidth="0.5"
          strokeDasharray="1 6"
        />

        {/* Sun bloom */}
        <g className={styles.bloomSun}>
          <circle cx={sunPos.x} cy={sunPos.y} r="62" fill="url(#sig-sun)" filter="url(#sig-blur)" />
          <circle cx={sunPos.x} cy={sunPos.y} r="22" fill="none" stroke={sunColor} strokeWidth="0.8" opacity="0.6" />
          <text
            x={sunPos.x}
            y={sunPos.y - 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontFamily="var(--font-display)"
            fill={sunColor}
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            ☉
          </text>
          <text
            x={sunPos.x}
            y={sunPos.y + 15}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill="var(--text-secondary)"
          >
            {sunSignGlyph} {sun.sign.name}
          </text>
        </g>

        {/* Moon bloom */}
        <g className={styles.bloomMoon}>
          <circle cx={moonPos.x} cy={moonPos.y} r="58" fill="url(#sig-moon)" filter="url(#sig-blur)" />
          <circle cx={moonPos.x} cy={moonPos.y} r="20" fill="none" stroke={moonColor} strokeWidth="0.8" opacity="0.6" />
          <text
            x={moonPos.x}
            y={moonPos.y - 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="17"
            fontFamily="var(--font-display)"
            fill={moonColor}
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            ☽
          </text>
          <text
            x={moonPos.x}
            y={moonPos.y + 14}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill="var(--text-secondary)"
          >
            {moonSignGlyph} {moon.sign.name}
          </text>
        </g>

        {/* Chakra bloom */}
        <g className={styles.bloomChakra}>
          <circle cx={chakraPos.x} cy={chakraPos.y} r="58" fill="url(#sig-chakra)" filter="url(#sig-blur)" />
          <circle cx={chakraPos.x} cy={chakraPos.y} r="20" fill="none" stroke={chakraColor} strokeWidth="0.8" opacity="0.6" />
          <text
            x={chakraPos.x}
            y={chakraPos.y - 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="16"
            fontFamily="var(--font-display)"
            fill={chakraColor}
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          >
            {chakra.devanagari.charAt(0)}
          </text>
          <text
            x={chakraPos.x}
            y={chakraPos.y + 14}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill="var(--text-secondary)"
          >
            {chakra.name}
          </text>
        </g>

        {/* Center dot */}
        <circle cx={cx} cy={cy + 5} r="2" fill="var(--text-illustration-bright)" opacity="0.6" />
      </svg>
    </div>
  );
}
