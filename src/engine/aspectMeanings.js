// Short, poetic meanings for each major aspect — one for transits,
// one for synastry. Used in tap-to-reveal bodies.

export const ASPECT_MEANINGS = {
  conjunction: {
    glyph: '☌',
    transit:
      'Two currents merging into one. Whatever these planets govern in you is being concentrated, made unmistakable. Pay attention — the fusion is speaking.',
    synastry:
      'Where you meet as one voice. These two energies occupy the same room between you — amplifying each other, indistinguishable at close range.',
  },
  sextile: {
    glyph: '⚹',
    transit:
      'An open door. No pressure, no force — but if you reach, the support is there. An easy sixty degrees of cooperation.',
    synastry:
      'Easy cooperation. These energies flow between you when invited, and offer real support when either of you reaches for it.',
  },
  square: {
    glyph: '□',
    transit:
      'Friction that wants to change your shape. Ninety degrees of real tension — uncomfortable, but it is how new form gets made.',
    synastry:
      'Productive tension. These energies rub against each other, asking each of you to grow. The grit is the gift.',
  },
  trine: {
    glyph: '△',
    transit:
      'Flow without effort. These energies move together so smoothly you may not notice — but the ground beneath you has quietly arranged itself.',
    synastry:
      'Natural harmony. These energies recognise each other and travel together. Easy, almost taken for granted.',
  },
  opposition: {
    glyph: '☍',
    transit:
      'Polarity asking to be held. Both ends are true; the work is not choosing, but learning to stand in the middle with both hands occupied.',
    synastry:
      'You carry the other ends for each other. What they hold strongly, you hold in reverse — both true, the tension is the teaching.',
  },
};

export function getAspectMeaning(aspectId, context = 'transit') {
  return ASPECT_MEANINGS[aspectId]?.[context] || '';
}
