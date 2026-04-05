import { useMemo } from 'react';
import { CHAKRAS } from '../../engine/chakras';
import styles from './Constellation.module.css';

/**
 * A visual map of the user's written reflections.
 * Horizontal axis = time (oldest → newest).
 * Vertical axis = chakra (crown at top, root at bottom).
 * Each dot is an entry, placed at its time/chakra coordinates,
 * colored by the chakra active when written.
 *
 * The empty state shows 7 soft horizontal bands with a quiet hint.
 * As entries arrive, the constellation fills in.
 */
export default function Constellation({ entries, onSelect, size = 320, height = 260 }) {
  const viewW = 360;
  const viewH = 280;
  const padTop = 16;
  const padBottom = 24;
  const padLeft = 24;
  const padRight = 20;
  const usableH = viewH - padTop - padBottom;
  const usableW = viewW - padLeft - padRight;
  const bandHeight = usableH / 7;

  // Map chakra id → row index (crown top = 0, root bottom = 6)
  const rowIndex = useMemo(() => {
    const map = {};
    // CHAKRAS is root→crown (indexes 0→6). We want crown on top (row 0).
    CHAKRAS.forEach((c, i) => {
      map[c.id] = 6 - i;
    });
    return map;
  }, []);

  const sorted = useMemo(
    () => [...(entries || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [entries]
  );

  // Compute x-positions: if fewer than 2 entries, center. Otherwise spread
  // across the axis by timestamp (normalized to available width).
  const dots = useMemo(() => {
    if (sorted.length === 0) return [];
    if (sorted.length === 1) {
      const e = sorted[0];
      const row = rowIndex[e.chakraId] ?? 3;
      return [
        {
          ...e,
          x: padLeft + usableW / 2,
          y: padTop + row * bandHeight + bandHeight / 2,
        },
      ];
    }
    const first = new Date(sorted[0].createdAt).getTime();
    const last = new Date(sorted[sorted.length - 1].createdAt).getTime();
    const range = Math.max(last - first, 1);
    return sorted.map((e) => {
      const t = (new Date(e.createdAt).getTime() - first) / range;
      const row = rowIndex[e.chakraId] ?? 3;
      return {
        ...e,
        x: padLeft + t * usableW,
        y: padTop + row * bandHeight + bandHeight / 2,
      };
    });
  }, [sorted, rowIndex, bandHeight, padLeft, usableW, padTop]);

  return (
    <div className={styles.wrap} style={{ '--size': `${size}px`, '--height': `${height}px` }}>
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className={styles.svg} aria-hidden="true">
        <defs>
          {CHAKRAS.map((c, i) => (
            <radialGradient key={i} id={`star-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.hex} stopOpacity="0.9" />
              <stop offset="60%" stopColor={c.hex} stopOpacity="0.3" />
              <stop offset="100%" stopColor={c.hex} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="star-blur">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* 7 horizontal bands, one per chakra (crown top → root bottom) */}
        {CHAKRAS.slice().reverse().map((c, i) => {
          const y = padTop + i * bandHeight;
          return (
            <g key={c.id}>
              {/* Band background */}
              <rect
                x={padLeft}
                y={y}
                width={usableW}
                height={bandHeight}
                fill={c.hex}
                opacity="0.05"
              />
              {/* Band separator */}
              {i > 0 && (
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + usableW}
                  y2={y}
                  stroke="var(--line-faint)"
                  strokeWidth="0.4"
                />
              )}
              {/* Chakra devanagari at left edge */}
              <text
                x={padLeft - 8}
                y={y + bandHeight / 2 + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="var(--font-display)"
                fill={c.hex}
                opacity="0.85"
              >
                {c.devanagari.charAt(0)}
              </text>
            </g>
          );
        })}

        {/* Bottom time axis — only if there are entries */}
        {dots.length > 0 && (
          <g>
            <line
              x1={padLeft}
              y1={viewH - padBottom + 4}
              x2={padLeft + usableW}
              y2={viewH - padBottom + 4}
              stroke="var(--line-subtle)"
              strokeWidth="0.5"
            />
            <text
              x={padLeft}
              y={viewH - 6}
              textAnchor="start"
              fontSize="8.5"
              fontFamily="var(--font-display)"
              fontStyle="italic"
              fill="var(--text-muted)"
            >
              earliest
            </text>
            <text
              x={padLeft + usableW}
              y={viewH - 6}
              textAnchor="end"
              fontSize="8.5"
              fontFamily="var(--font-display)"
              fontStyle="italic"
              fill="var(--text-muted)"
            >
              now
            </text>
          </g>
        )}

        {/* The dots — stars in the constellation */}
        {dots.map((d, i) => {
          const chakraIdx = CHAKRAS.findIndex((c) => c.id === d.chakraId);
          return (
            <g
              key={d.id}
              className={styles.star}
              onClick={() => onSelect && onSelect(d)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              <circle
                cx={d.x}
                cy={d.y}
                r="8"
                fill={chakraIdx >= 0 ? `url(#star-${chakraIdx})` : 'var(--text-illustration)'}
                filter="url(#star-blur)"
              />
              <circle
                cx={d.x}
                cy={d.y}
                r="2"
                fill={chakraIdx >= 0 ? CHAKRAS[chakraIdx].hex : 'var(--text-illustration)'}
                opacity="0.95"
              />
            </g>
          );
        })}

        {/* Empty-state whisper */}
        {dots.length === 0 && (
          <text
            x={viewW / 2}
            y={viewH / 2 + 2}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fill="var(--text-muted)"
            opacity="0.7"
          >
            the sky is waiting for you to write
          </text>
        )}
      </svg>
    </div>
  );
}
