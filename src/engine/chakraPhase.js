// 7-year chakra life phases.
// Phases 1-7 cover ages 0-49 (root → crown).
// After 49, the spiral begins again: same chakra, higher octave.
// Spiral 1: ages 0-49 (formation). Spiral 2: 49-98 (integration/mastery).

import { CHAKRAS } from './chakras';

export function getChakraPhase(age) {
  const safeAge = Math.max(0, age);
  const spiral = Math.floor(safeAge / 49) + 1;
  const ageInSpiral = safeAge % 49;
  const phaseIndex = Math.min(6, Math.floor(ageInSpiral / 7));
  const chakra = CHAKRAS[phaseIndex];

  return {
    chakra,
    phaseIndex,
    spiral,
    ageInSpiral,
    ageRange: {
      start: (spiral - 1) * 49 + phaseIndex * 7,
      end: (spiral - 1) * 49 + (phaseIndex + 1) * 7 - 1,
    },
  };
}

export function getAllChakraPhases(spiral = 1) {
  return CHAKRAS.map((chakra, i) => ({
    chakra,
    phaseIndex: i,
    spiral,
    ageRange: {
      start: (spiral - 1) * 49 + i * 7,
      end: (spiral - 1) * 49 + (i + 1) * 7 - 1,
    },
  }));
}
