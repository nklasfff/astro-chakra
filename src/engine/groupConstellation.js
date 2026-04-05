// Group constellation analysis — what happens in the field between multiple people.
// Inspired by 9Lives' group-dynamics view, adapted for chakras + astrology.
//
// Input: array of "people" objects (each person's computed chart position).
// Output: composition (present/absent chakras), pairwise dynamics, dominant
// chakra, journey span, and field-level summaries.

import { CHAKRAS } from './chakras';
import { PLANETS } from './planets';

/**
 * Relationship types between two chakra positions.
 *
 * Chakras sit on a vertical axis (root=0, crown=6). The distance between two
 * people's primary chakras reveals how their energies meet:
 *
 *   0       → resonance (same centre, mirror)
 *   1       → flow (adjacent, energy passes between them)
 *   2–3     → bridge (different registers, translation required)
 *   4–6     → contrast (polar ends, creative tension)
 */
export const PAIR_TYPES = {
  resonance: {
    id: 'resonance',
    label: 'Resonance',
    mood: 'mirroring',
  },
  flow: {
    id: 'flow',
    label: 'Flow',
    mood: 'feeding',
  },
  bridge: {
    id: 'bridge',
    label: 'Bridge',
    mood: 'translating',
  },
  contrast: {
    id: 'contrast',
    label: 'Contrast',
    mood: 'tensioning',
  },
};

function classifyPair(indexA, indexB) {
  const d = Math.abs(indexA - indexB);
  if (d === 0) return 'resonance';
  if (d === 1) return 'flow';
  if (d <= 3) return 'bridge';
  return 'contrast';
}

/**
 * Analyse the field of a group. People should be objects like:
 *   { id, name, chakraId, chakraIndex, chakraName, chakraHex,
 *     sunSignName, moonSignName, age, spiral, spiralSeason }
 *
 * (See buildGroupPerson below — a helper that assembles this from natal + journey data.)
 */
export function analyzeGroup(people) {
  if (!people || people.length < 2) return null;

  // Presence / absence — which chakras are currently lit in the group
  const presentSet = new Set(people.map((p) => p.chakraId));
  const present = CHAKRAS.filter((c) => presentSet.has(c.id));
  const absent = CHAKRAS.filter((c) => !presentSet.has(c.id));

  // Pairwise dynamics
  const pairs = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i];
      const b = people[j];
      const type = classifyPair(a.chakraIndex, b.chakraIndex);
      pairs.push({
        a,
        b,
        distance: Math.abs(a.chakraIndex - b.chakraIndex),
        type,
        typeMeta: PAIR_TYPES[type],
      });
    }
  }

  // Type counts
  const typeCounts = { resonance: 0, flow: 0, bridge: 0, contrast: 0 };
  pairs.forEach((p) => {
    typeCounts[p.type] += 1;
  });

  // Dominant chakra — the one most carried in the field
  const chakraCounts = {};
  people.forEach((p) => {
    chakraCounts[p.chakraId] = (chakraCounts[p.chakraId] || 0) + 1;
  });
  const sortedChakras = Object.entries(chakraCounts).sort((a, b) => b[1] - a[1]);
  const dominantChakraId = sortedChakras[0][0];
  const dominantChakra = CHAKRAS.find((c) => c.id === dominantChakraId);
  const dominantPlanet = PLANETS.find((p) => p.chakra === dominantChakraId);

  // Journey span
  const ages = people.map((p) => p.age).filter((a) => a != null);
  const minAge = ages.length > 0 ? Math.min(...ages) : null;
  const maxAge = ages.length > 0 ? Math.max(...ages) : null;
  const spiralSet = new Set(people.map((p) => p.spiral).filter(Boolean));

  return {
    people,
    present,
    absent,
    pairs,
    typeCounts,
    dominantChakra,
    dominantPlanet,
    journeySpan: { minAge, maxAge, spirals: Array.from(spiralSet).sort() },
    size: people.length,
  };
}

/**
 * Helper: build a group-person object from a natal chart + journey position.
 */
export function buildGroupPerson({ id, name, chart, journey }) {
  const primary = journey.primary;
  const index = CHAKRAS.findIndex((c) => c.id === primary.id);
  return {
    id,
    name,
    chakraId: primary.id,
    chakraIndex: index,
    chakraName: primary.name,
    chakraHex: primary.hex,
    chakraDevanagari: primary.devanagari,
    sunSignName: chart?.sun?.sign?.name || null,
    sunChakra: chart?.sun?.chakra || null,
    moonSignName: chart?.moon?.sign?.name || null,
    moonChakra: chart?.moon?.chakra || null,
    age: journey.age,
    spiral: journey.spiral,
  };
}

/**
 * Short descriptions per pair type — placeholders ready to be rewritten
 * through the parallel content pipeline.
 */
export const PAIR_DESCRIPTIONS = {
  resonance: {
    body:
      'You share the same centre. Deep recognition moves between you — and so does the risk of amplifying each other\'s patterns.',
    gift: 'Mirror clarity. What one of you sees, the other can confirm.',
    shadow: 'Echo chamber. Blind spots multiply when nobody challenges them.',
  },
  flow: {
    body:
      'Your centres are adjacent. Energy passes between you easily — one feeds the next.',
    gift: 'Natural complementarity. The hand-off between you is frictionless.',
    shadow: 'Over-reliance. One of you may drain the other if the flow only runs one way.',
  },
  bridge: {
    body:
      'You sit in different registers. Translation is required — and that translation is where the learning lives.',
    gift: 'Mutual stretch. Each of you reaches toward the other\'s territory and grows.',
    shadow: 'Misunderstanding. Without patience, the translation can tire both of you.',
  },
  contrast: {
    body:
      'You carry opposite ends of the spectrum. The tension is real, and it is generative.',
    gift: 'Full-spectrum wisdom. Between you, the whole range is held.',
    shadow: 'Polarisation. When the tension is denied, it becomes distance.',
  },
};

export const FIELD_SUMMARIES = {
  presence:
    'What these centres share becomes the field\'s tone. The dominant chakra sets what is most easily felt, spoken, and decided together.',
  absence:
    'What is missing shapes the group as much as what is present. The absent centres point to qualities the group must consciously cultivate, or find elsewhere.',
  journeyRange:
    'The range of life seasons in this group carries its own intelligence. The younger seasons bring freshness; the older seasons bring depth. The conversation between them is the gift.',
};
