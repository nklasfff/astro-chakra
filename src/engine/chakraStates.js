// Developmental + state content for each chakra.
// Structure mirrors the content brief — fill in from parallel chat.
//
// Fields:
//   formation: { title, body } — formation years (0-7 for root, etc.)
//   revisit: { title, spiral2, anytime } — how it returns
//   states: { deficient, balanced, excessive } — each with title/body/signs
//   subChakra: { bodyTemplate } — what it feels like as sub-chakra
//   reflectionPrompts: [3 short questions]

const CHAKRA_STATES = {
  root: {
    formation: {
      title: 'The ground given before words',
      body: 'Between zero and seven, the root is shaped by the temperature of the room. Were you held? Was there enough? Did the people around you feel safe themselves? The body records these answers before the mind can question them.',
    },
    revisit: {
      title: 'The ground returns',
      spiral2: 'In your fifties, the root comes back to be re-met. Retirement, parents dying, bodies changing — old questions about safety rise, asking for a more spacious answer.',
      anytime: 'A move, a loss, a financial fear, a serious illness — any of these can reopen the root at any age. The chakra is never done. It just waits.',
    },
    states: {
      deficient: {
        title: 'The ground feels thin',
        body: 'When the root is deficient, the body lives just above the floor. You may dissociate, forget to eat, feel unable to land in your own life. Safety never quite arrives.',
        signs: [
          'Chronic low-grade anxiety with no object',
          'Difficulty trusting your own body',
          'Weight either very low or shifting',
          'Feeling like a visitor in your own home',
          'Exhaustion that sleep cannot reach',
        ],
      },
      balanced: {
        title: 'The body rests in gravity',
        body: 'When the root is balanced, the body breathes without bracing. You can receive care. You trust the floor. Money worries come and go without colonising the whole day.',
        signs: [
          'Sleep arrives without negotiation',
          'You eat when hungry and stop when full',
          'Your weight sits where it wants to',
          'Home feels like home',
          'You can sit still without flinching',
        ],
      },
      excessive: {
        title: 'The grip on ground',
        body: 'When the root is excessive, safety becomes fixation. You hoard — money, food, objects, routines. The body clenches around security until the clenching itself feels like danger.',
        signs: [
          'Obsessive financial worry even when safe',
          'Rigid routines you cannot break',
          'Hoarding — food, money, objects',
          'Chronic tension in hips and low back',
          'Inability to tolerate change',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When root sits inside another chakra\'s decade, safety becomes the background question. Whatever that decade is about — desire, will, love, voice — gets asked with the body first: is it safe enough to be here at all?',
    },
    reflectionPrompts: [
      'Where in your body does safety actually live?',
      'What would enough look like today?',
      'Whose ground did you borrow as a child?',
    ],
  },

  // sacral, solar, heart, throat, thirdeye, crown — filled in from parallel chat
};

export function getChakraStates(id) {
  return CHAKRA_STATES[id] || null;
}

export function hasChakraStates(id) {
  return Boolean(CHAKRA_STATES[id]);
}

export default CHAKRA_STATES;
