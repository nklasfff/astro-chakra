// Planet metadata — names, glyphs, and meanings for use across the app.

export const PLANETS = [
  {
    id: 'sun',
    name: 'Sun',
    glyph: '☉',
    chakra: 'solar',
    domain: 'Identity and vitality',
    body: 'The self made visible. What you are here to become.',
  },
  {
    id: 'moon',
    name: 'Moon',
    glyph: '☽',
    chakra: 'sacral',
    domain: 'Feeling and memory',
    body: 'Your emotional body. What you need to feel held.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    glyph: '☿',
    chakra: 'throat',
    domain: 'Mind and speech',
    body: 'How you think, speak, and translate between worlds.',
  },
  {
    id: 'venus',
    name: 'Venus',
    glyph: '♀',
    chakra: 'heart',
    domain: 'Love and beauty',
    body: 'How you relate, attract, and recognise what nourishes.',
  },
  {
    id: 'mars',
    name: 'Mars',
    glyph: '♂',
    chakra: 'solar',
    domain: 'Will and action',
    body: 'Your force. How you move toward what you want.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    glyph: '♃',
    chakra: 'thirdeye',
    domain: 'Expansion and meaning',
    body: 'The frame you lay over experience. What you trust.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    glyph: '♄',
    chakra: 'root',
    domain: 'Structure and time',
    body: 'What endures. The bones of the life you are building.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    glyph: '♅',
    chakra: 'throat',
    domain: 'Awakening and change',
    body: 'What in you refuses the inherited script.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    glyph: '♆',
    chakra: 'crown',
    domain: 'Dissolution and depth',
    body: 'Where the edges of you become porous. The sacred and the fog.',
  },
];

export function getPlanet(id) {
  return PLANETS.find((p) => p.id === id) || null;
}
