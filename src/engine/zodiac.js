// The twelve signs of Western astrology.
// Each sign occupies 30° of the zodiac, starting from 0° Aries.

export const SIGNS = [
  { id: 'aries',       name: 'Aries',       glyph: '♈', element: 'fire',  modality: 'cardinal', ruler: 'Mars' },
  { id: 'taurus',      name: 'Taurus',      glyph: '♉', element: 'earth', modality: 'fixed',    ruler: 'Venus' },
  { id: 'gemini',      name: 'Gemini',      glyph: '♊', element: 'air',   modality: 'mutable',  ruler: 'Mercury' },
  { id: 'cancer',      name: 'Cancer',      glyph: '♋', element: 'water', modality: 'cardinal', ruler: 'Moon' },
  { id: 'leo',         name: 'Leo',         glyph: '♌', element: 'fire',  modality: 'fixed',    ruler: 'Sun' },
  { id: 'virgo',       name: 'Virgo',       glyph: '♍', element: 'earth', modality: 'mutable',  ruler: 'Mercury' },
  { id: 'libra',       name: 'Libra',       glyph: '♎', element: 'air',   modality: 'cardinal', ruler: 'Venus' },
  { id: 'scorpio',     name: 'Scorpio',     glyph: '♏', element: 'water', modality: 'fixed',    ruler: 'Pluto' },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '♐', element: 'fire',  modality: 'mutable',  ruler: 'Jupiter' },
  { id: 'capricorn',   name: 'Capricorn',   glyph: '♑', element: 'earth', modality: 'cardinal', ruler: 'Saturn' },
  { id: 'aquarius',    name: 'Aquarius',    glyph: '♒', element: 'air',   modality: 'fixed',    ruler: 'Uranus' },
  { id: 'pisces',      name: 'Pisces',      glyph: '♓', element: 'water', modality: 'mutable',  ruler: 'Neptune' },
];

/**
 * Given an ecliptic longitude in degrees (0-360), return the sign object
 * plus the degree within that sign (0-30).
 */
export function getSignFromLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  const degreeInSign = normalized - index * 30;
  return {
    sign: SIGNS[index],
    signIndex: index,
    degreeInSign,
    longitude: normalized,
  };
}

export function getSign(id) {
  return SIGNS.find((s) => s.id === id) || null;
}

export function getSignByIndex(i) {
  const index = ((i % 12) + 12) % 12;
  return SIGNS[index];
}

/** Format a degree-in-sign as "12°34'" */
export function formatDegree(degreeInSign) {
  const d = Math.floor(degreeInSign);
  const m = Math.floor((degreeInSign - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}
