// Compare two natal charts through the chakra lens: which chakras
// are activated in each person's chart (based on planetary presence),
// where they overlap, and what the resonance means.

import { CHAKRAS } from './chakras';
import { PLANETS } from './planets';

/**
 * Count how strongly each chakra is lit up in a chart — based on which
 * planets land in which chakras (via each planet's chakra correspondence).
 * Luminaries count double.
 */
export function getChakraActivation(chart) {
  const activation = {};
  CHAKRAS.forEach((c) => {
    activation[c.id] = 0;
  });

  for (const p of chart.planets) {
    const planetMeta = PLANETS.find((x) => x.id === p.id);
    if (!planetMeta) continue;
    const weight = (p.id === 'sun' || p.id === 'moon') ? 2 : 1;
    activation[planetMeta.chakra] += weight;
  }
  return activation;
}

/**
 * Given two charts, return the top shared chakras (both people have them lit)
 * and the top contrast chakras (where one is strong and the other weak).
 */
export function compareCharts(chartA, chartB) {
  const a = getChakraActivation(chartA);
  const b = getChakraActivation(chartB);

  const shared = [];
  const contrast = [];

  for (const c of CHAKRAS) {
    const aVal = a[c.id];
    const bVal = b[c.id];
    const min = Math.min(aVal, bVal);
    const diff = Math.abs(aVal - bVal);
    if (min >= 2) {
      shared.push({ chakra: c, strength: min });
    }
    if (diff >= 2) {
      contrast.push({ chakra: c, aVal, bVal, diff });
    }
  }

  shared.sort((x, y) => y.strength - x.strength);
  contrast.sort((x, y) => y.diff - x.diff);

  return { shared, contrast, a, b };
}

/**
 * One-line resonance summary for each chakra, used in Relations.
 */
export const CHAKRA_RESONANCE = {
  root: {
    shared: 'You both build ground. Safety, belonging, and bodily rhythm are instinctive between you.',
    oneLeads: 'One of you anchors the other. The ground comes from the person carrying the earth.',
  },
  sacral: {
    shared: 'Desire recognises desire. Feeling moves easily between you — creative, sensual, unguarded.',
    oneLeads: 'One of you thaws the other. Pleasure and emotion arrive as invitation, not demand.',
  },
  solar: {
    shared: 'Two wills in the room. Sparks can fly — it matters that neither of you makes the other smaller.',
    oneLeads: 'One of you brings the fire. The other learns what it is to be seen by someone willing to act.',
  },
  heart: {
    shared: 'You love in compatible keys. Care flows without translation, and grief is safe here too.',
    oneLeads: 'One of you opens first. The other learns what trust feels like by watching it practised.',
  },
  throat: {
    shared: 'You can say real things to each other. Silences are meaningful, words are not performed.',
    oneLeads: 'One of you speaks. The other learns their own voice by being heard clearly.',
  },
  thirdeye: {
    shared: 'You see similar patterns. What is subtle becomes speakable when you are together.',
    oneLeads: 'One of you perceives first. The other is invited to trust what they already knew.',
  },
  crown: {
    shared: 'You share the long horizon. Meaning, silence, presence — these travel well between you.',
    oneLeads: 'One of you has touched the wider quiet. The other is drawn toward it in your company.',
  },
};
