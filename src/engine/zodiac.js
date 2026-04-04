// The twelve signs of Western astrology.
// Each sign occupies 30° of the zodiac, starting from 0° Aries.

export const SIGNS = [
  { id: 'aries',       name: 'Aries',       glyph: '♈', element: 'fire',  modality: 'cardinal', ruler: 'Mars',
    mode: 'Initiating fire. Direct, immediate, the body moving toward what it wants before the mind asks permission.' },
  { id: 'taurus',      name: 'Taurus',      glyph: '♉', element: 'earth', modality: 'fixed',    ruler: 'Venus',
    mode: 'Grounded earth. Sensory, steady, the body settling into what nourishes and refusing to be rushed.' },
  { id: 'gemini',      name: 'Gemini',      glyph: '♊', element: 'air',   modality: 'mutable',  ruler: 'Mercury',
    mode: 'Quick air. Curious, linking, the mind holding two things at once without needing to reconcile them yet.' },
  { id: 'cancer',      name: 'Cancer',      glyph: '♋', element: 'water', modality: 'cardinal', ruler: 'Moon',
    mode: 'Holding water. Protective, remembering, the feeling body building a shell around what matters.' },
  { id: 'leo',         name: 'Leo',         glyph: '♌', element: 'fire',  modality: 'fixed',    ruler: 'Sun',
    mode: 'Radiant fire. Expressive, warm, the self visible and uncontracted, trusting it has something to give.' },
  { id: 'virgo',       name: 'Virgo',       glyph: '♍', element: 'earth', modality: 'mutable',  ruler: 'Mercury',
    mode: 'Refining earth. Precise, caring, the hand that corrects the detail until the whole can breathe.' },
  { id: 'libra',       name: 'Libra',       glyph: '♎', element: 'air',   modality: 'cardinal', ruler: 'Venus',
    mode: 'Weighing air. Relating, aesthetic, holding two perspectives at once to find the balance point between them.' },
  { id: 'scorpio',     name: 'Scorpio',     glyph: '♏', element: 'water', modality: 'fixed',    ruler: 'Pluto',
    mode: 'Deep water. Intense, piercing, the emotion that goes all the way down and returns with something true.' },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '♐', element: 'fire',  modality: 'mutable',  ruler: 'Jupiter',
    mode: 'Seeking fire. Expansive, visionary, the arrow aimed at a horizon no one else has named yet.' },
  { id: 'capricorn',   name: 'Capricorn',   glyph: '♑', element: 'earth', modality: 'cardinal', ruler: 'Saturn',
    mode: 'Structuring earth. Patient, ambitious, building what will stand long after the scaffolding is taken down.' },
  { id: 'aquarius',    name: 'Aquarius',    glyph: '♒', element: 'air',   modality: 'fixed',    ruler: 'Uranus',
    mode: 'Electric air. Detached, inventive, seeing the pattern from high enough to redesign it.' },
  { id: 'pisces',      name: 'Pisces',      glyph: '♓', element: 'water', modality: 'mutable',  ruler: 'Neptune',
    mode: 'Dissolving water. Permeable, compassionate, the edges softening until self and other share the same breath.' },
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
