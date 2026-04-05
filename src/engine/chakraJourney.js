// The 7x7 developmental matrix.
// Each 7-year decade belongs to one chakra (primary / "decade chakra").
// Within that decade, each year belongs to another chakra (sub-chakra),
// cycling through all seven.
//
// After age 49, the spiral begins again (spiral 2, ages 49-98).
// After 98, spiral 3 theoretically — we support up to 3.
//
// Formula: decade index = floor((age % 49) / 7)
//          year within decade = (age % 49) % 7
//          sub-chakra index = year within decade
//
// Example: age 40
//   40 % 49 = 40
//   decade index = floor(40/7) = 5 → Third Eye
//   year within decade = 40 % 7 = 5 → that year's sub-chakra = 5 → Third Eye
//   So age 40 = "Third Eye within Third Eye"
//
// Example: age 12
//   12 % 49 = 12
//   decade = floor(12/7) = 1 → Sacral
//   year within decade = 12 % 7 = 5 → Third Eye
//   So age 12 = "Third Eye within Sacral"
//
// Spiral: floor(age / 49) + 1 (so age 0-48 = spiral 1, 49-97 = spiral 2)

import { CHAKRAS } from './chakras';

/**
 * Core journey calculation from an age.
 * Returns primary chakra, sub-chakra, spiral number, year position.
 */
export function getJourneyPosition(age) {
  const safeAge = Math.max(0, age);
  const spiral = Math.floor(safeAge / 49) + 1;
  const ageInSpiral = safeAge % 49;
  const decadeIndex = Math.min(6, Math.floor(ageInSpiral / 7));
  const yearInDecade = ageInSpiral % 7;
  const subChakraIndex = yearInDecade;

  const primary = CHAKRAS[decadeIndex];
  const sub = CHAKRAS[subChakraIndex];

  return {
    age: safeAge,
    spiral,
    decadeIndex,
    yearInDecade,
    ageInSpiral,
    primary,
    primaryIndex: decadeIndex,
    sub,
    subIndex: subChakraIndex,
    ageRange: {
      start: (spiral - 1) * 49 + decadeIndex * 7,
      end: (spiral - 1) * 49 + (decadeIndex + 1) * 7 - 1,
    },
    isSamePrimaryAndSub: decadeIndex === subChakraIndex,
  };
}

/**
 * Build the full 7x7 matrix for a given spiral.
 * Returns 49 cells, each with primary + sub + absolute age.
 */
export function getSpiralMatrix(spiralNumber = 1) {
  const cells = [];
  for (let decadeIdx = 0; decadeIdx < 7; decadeIdx++) {
    for (let yearIdx = 0; yearIdx < 7; yearIdx++) {
      const absoluteAge = (spiralNumber - 1) * 49 + decadeIdx * 7 + yearIdx;
      cells.push({
        decadeIndex: decadeIdx,
        yearInDecade: yearIdx,
        subIndex: yearIdx,
        age: absoluteAge,
        primary: CHAKRAS[decadeIdx],
        sub: CHAKRAS[yearIdx],
      });
    }
  }
  return cells;
}

/**
 * All three spirals as a flat list of 49*3 cells.
 */
export function getFullJourneyMatrix() {
  return [1, 2, 3].flatMap((s) => getSpiralMatrix(s));
}

/**
 * Describe the spiral context ("formation", "integration", "mastery").
 */
export function getSpiralLabel(spiralNumber) {
  return (
    {
      1: 'Formation',
      2: 'Integration',
      3: 'Mastery',
    }[spiralNumber] || `Spiral ${spiralNumber}`
  );
}

export function getSpiralMeaning(spiralNumber) {
  return (
    {
      1: 'The first pass through the seven. The years the body and psyche are being shaped.',
      2: 'The second pass, after forty-nine. The chakras return — this time with a life lived behind them.',
      3: 'The third pass. Mastery, or the freedom to stop striving and simply be each centre as it arrives.',
    }[spiralNumber] || ''
  );
}
