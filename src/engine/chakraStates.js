// Developmental + state content for each chakra.
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
      title: 'The ground you were given before you could ask',
      body: 'Between birth and seven, the body decides whether the world is solid. Not through thought — through skin, through temperature, through the steadiness or absence of hands. The nervous system writes its first draft here: safe or not safe. Every chakra that follows is built on this answer. If the floor was uncertain, the whole structure learns to brace.',
    },
    revisit: {
      title: 'The ground, questioned again',
      spiral2:
        "Around forty-nine, the root resurfaces — not as a child's need but as an adult's reckoning. Retirement, empty nests, shifting bodies. The question is the same but the voice asking it is older: do I still belong here?",
      anytime:
        'The root reawakens whenever the floor moves. Job loss, eviction, divorce, diagnosis, the death of a parent. Any event that makes the body ask again whether it has permission to stay.',
    },
    states: {
      deficient: {
        title: 'The body that floats',
        body: "A deficient root leaves the body without an anchor. You live slightly above your own life — present enough to function, absent enough to never quite land. The legs feel provisional. The world stays at arm's length.",
        signs: [
          'Chronic anxiety with no specific object',
          'Difficulty feeling at home in any space',
          'Underweight or forgetting to eat for hours',
          'Spaciness, poor follow-through on practical tasks',
          'Startling easily at ordinary sounds',
        ],
      },
      balanced: {
        title: 'Feet that trust the floor',
        body: "A balanced root is quiet. You don't think about the ground — you simply stand on it. The body rests in its own weight. Practicalities get handled without drama. Sleep comes without negotiation.",
        signs: [
          'Steady energy throughout the day',
          'Comfortable being still and alone',
          'Finances handled without chronic dread',
          'Physical health tended to, not ignored',
          'A sense of belonging that needs no proof',
        ],
      },
      excessive: {
        title: "The fist that won't open",
        body: 'An excessive root grips. The body hoards safety — accumulating, controlling, refusing change as though any movement might pull the floor away. Rigidity disguises itself as responsibility. Stillness becomes stagnation.',
        signs: [
          'Hoarding money, food, or objects against future lack',
          'Resistance to any change, even welcome ones',
          'Overworking as a substitute for feeling secure',
          'Heaviness and sluggishness in the lower body',
          'Controlling behaviour disguised as care or planning',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When root is the sub-chakra, the year carries an undertone of foundation. Whatever the parent chakra is working on, this year asks you to check the ground beneath it. Practical questions surface: is the structure sound? Do the basics hold? The body wants contact with something solid before it moves further.',
    },
    reflectionPrompts: [
      'Where in your body do you feel most at home?',
      'What did safety look like in the house you grew up in?',
      'When the ground shifts, what do you reach for first?',
    ],
  },

  sacral: {
    formation: {
      title: 'The body that discovered it could want something',
      body: "Between seven and fourteen, desire arrives without permission. The child who learned to stand now learns to reach — toward taste, texture, warmth, another body's closeness. Emotion becomes tidal. The sacral records whether that rising was met with welcome or alarm. Shame enters here, not as a thought but as a flinch — the hand pulling back before it knows why.",
    },
    revisit: {
      title: 'Desire, revisited with different skin',
      spiral2:
        'Around fifty-six, the sacral returns wearing an older face. The body has changed. Sexuality shifts. Appetite narrows or widens unexpectedly. The question is no longer whether wanting is allowed — but whether you still know what you want at all.',
      anytime:
        "The sacral reawakens with any disruption to pleasure, creativity, or emotional flow. A creative block, a sexual rupture, a grief that freezes the body's capacity to feel. Anything that makes sensation dangerous again.",
    },
    states: {
      deficient: {
        title: 'The body gone quiet',
        body: "A deficient sacral flatlines sensation. Pleasure becomes theoretical — something you understand but can't locate in the body. Emotions pass through like weather behind glass. You function, but the colour has drained from things.",
        signs: [
          'Emotional numbness or a persistent feeling of beige',
          'Low or absent sexual desire without medical cause',
          'Difficulty identifying what you actually want',
          'Rigid daily routines that resist any spontaneity',
          'Creative projects abandoned before they begin',
        ],
      },
      balanced: {
        title: 'A body that moves freely',
        body: "A balanced sacral lets emotion pass through without taking up residence. You cry when it's time and stop when it's done. Pleasure doesn't need justification. Creativity arrives like appetite — not forced, not performed, just present.",
        signs: [
          'Emotions felt fully and released without drama',
          'Healthy relationship with pleasure and indulgence',
          'Creative impulses followed without overthinking',
          'Comfort with change and the unknown',
          'Hips and lower belly soft and mobile',
        ],
      },
      excessive: {
        title: 'The flood without banks',
        body: "An excessive sacral overwhelms its own channel. Emotion becomes weather you can't get out of. Desire runs without direction — compulsive, urgent, never quite satisfied. The body chases sensation the way thirst chases water, never registering that it has already drunk.",
        signs: [
          'Emotional reactions disproportionate to the situation',
          'Compulsive pursuit of pleasure, food, or sex',
          'Poor boundaries — giving access before being asked',
          "Mood swings that dominate the day's architecture",
          'Addictive patterns that restart despite intention',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When sacral is the sub-chakra, the year carries an undertone of feeling and desire. Whatever the parent chakra is working on, this year asks what you want from it — not what you should want, but the raw, unedited appetite. Emotion rises closer to the surface. The body asks for more fluidity, more honesty about pleasure.',
    },
    reflectionPrompts: [
      'What pleasure have you been postponing without good reason?',
      'When did you first learn that wanting something was dangerous?',
      'Where does your body hold its unshed tears?',
    ],
  },

  solar: {
    formation: {
      title: 'The first real no',
      body: "Between fourteen and twenty-one, the self begins to take a shape others can push against. Identity hardens, desires become plans, the child learns to say no and mean it. If this no is crushed or mocked, the will learns to hide. If it's met, the person steps forward into their own life.",
    },
    revisit: {
      title: 'Power, re-met',
      spiral2:
        'After sixty-three, the solar plexus returns quieter. You no longer need to prove capacity. Will softens into choice. What you do, you do because it matters — not because someone is watching.',
      anytime:
        "A public failure, burnout, being overruled or overlooked, taking on leadership too soon, chronic illness that strips your sense of agency. These return you to the teenager's question: can I want something and make it real?",
    },
    states: {
      deficient: {
        title: 'Will gone quiet',
        body: "When the solar plexus is deficient, you hesitate even where you're capable. You defer, explain yourself too much, lose the thread of your own direction. Effort arrives tired.",
        signs: [
          'Difficulty starting things you care about',
          'Defer decisions to others habitually',
          'Low energy even with rest',
          'Say yes when you mean no',
          'Shame at wanting to be seen',
        ],
      },
      balanced: {
        title: 'Fire that warms',
        body: 'When balanced, action is steady. You take decisions without drama, finish what you begin, rest when tired. Anger rises cleanly when boundaries are crossed, then passes. Direction feels like home.',
        signs: [
          'Decisions arrive without long debate',
          'You finish more than you abandon',
          'Anger comes and goes cleanly',
          'Direction feels stable day to day',
          'Your yes and no are clear',
        ],
      },
      excessive: {
        title: 'Force that burns',
        body: 'When excessive, will becomes domination. You push through people and limits, burn bridges, burn out. Effort masks a fear that stopping means disappearing.',
        signs: [
          'Constantly pushing toward goals',
          'Anger that flashes and scars',
          'Discomfort with rest or softness',
          "Control over others' choices",
          'Burnout followed by doubling down',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When solar plexus threads through another chakra's decade, will and direction show up underneath whatever else is forming. You notice where your agency is given, refused, or negotiated — and that shapes how the decade takes hold.",
    },
    reflectionPrompts: [
      'Where did you say yes when you meant no?',
      "What do you want to do that you haven't started?",
      'When did you last feel your own will?',
    ],
  },

  heart: {
    formation: {
      title: 'Learning to open and close',
      body: 'Between twenty-one and twenty-eight, love stops being something parents give and becomes something you practice. First real partnerships, first real losses, first friendships that outlast circumstance. The heart learns how to open wide and how to close when it must — and whether closing feels like protection or exile.',
    },
    revisit: {
      title: 'Love in longer time',
      spiral2:
        "After seventy, the heart returns more spacious. Grief has taught it endurance. Love shows up as presence rather than promise. Forgiveness becomes possible where it wasn't, for reasons you couldn't force earlier.",
      anytime:
        "Deep grief, betrayal, becoming a parent, the end of a long relationship, caring for someone dying. These crack the heart open or closed — returning you to the twenty-five-year-old's question: can I stay open to this?",
    },
    states: {
      deficient: {
        title: 'The door held shut',
        body: 'When the heart is deficient, you observe love from a safe distance. Connection feels effortful. You give duty where tenderness lived once. Receiving feels almost unbearable.',
        signs: [
          'Struggle to receive affection openly',
          'Love as obligation more than warmth',
          'Difficulty crying even when needed',
          'Chest tight, breath shallow often',
          'Loneliness even in company',
        ],
      },
      balanced: {
        title: 'Open without losing shape',
        body: "When balanced, love moves freely. You stay connected without dissolving, feel others' pain without drowning, receive care without deflecting. The chest breathes wide and closes when it needs rest.",
        signs: [
          "Can hold others' feelings without merging",
          'Breath reaches upper chest easily',
          'Grief and joy both welcome',
          'Forgiveness arrives in its own time',
          'Connection restores rather than depletes',
        ],
      },
      excessive: {
        title: 'Heart without walls',
        body: "When excessive, love becomes merging. You take on everyone's pain, lose yourself in caretaking, cannot tell where you end. Devotion hides an old fear of being alone.",
        signs: [
          "Carry others' emotions as your own",
          'Caretaking that depletes you reliably',
          'Difficulty being alone',
          'Love given to earn safety',
          'Resentment masked as loyalty',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When heart threads through another chakra's decade, tenderness and connection sit quietly underneath. You notice who you love, who you grieve, who you cannot quite let in — and this colors whatever that decade is asking you to build.",
    },
    reflectionPrompts: [
      'Who are you holding too closely right now?',
      'Where did you close and never reopen?',
      'What would feel like being loved well today?',
    ],
  },

  throat: {
    formation: {
      title: 'Finding the true voice',
      body: "Between twenty-eight and thirty-five, voice becomes the central question. Career, creative calling, speaking hard truths, listening beneath words. The throat learns the difference between noise and signal, between speech that performs and speech that tells what's actually there.",
    },
    revisit: {
      title: 'Voice deepens with age',
      spiral2:
        'After seventy-seven, the throat returns more economical. You speak less and say more. The voice carries what it carries and stops explaining. Silence becomes a language you understand fluently.',
      anytime:
        "A creative breakthrough, being silenced, a truth you've avoided speaking, public speaking stress, a secret finally told, singing or teaching for the first time. These return you to the thirty-year-old's question: whose voice am I using?",
    },
    states: {
      deficient: {
        title: 'Words held back',
        body: 'When the throat is deficient, you swallow what you meant to say. You soften truth, agree too quickly, struggle to ask for what you need. The voice arrives weaker than the feeling.',
        signs: [
          'Speak up hours after the moment',
          'Ask permission instead of stating need',
          'Creative voice feels stuck inside',
          'Throat tightens in difficult conversations',
          'Words feel thinner than the truth',
        ],
      },
      balanced: {
        title: 'Voice with spine',
        body: 'When balanced, what you say matches what you feel. Hard conversations happen without collapse. You listen deeply and answer from underneath thought. Silence holds as much as speech.',
        signs: [
          'Hard things said without drama',
          'Listening feels restful not draining',
          'Creative expression flows in chosen form',
          'Silence comfortable in company',
          'Asking for what you need feels possible',
        ],
      },
      excessive: {
        title: 'Words without bottom',
        body: 'When excessive, the throat overruns. You fill silence, talk over feeling, explain and defend until truth is buried. Speech becomes performance, a wall instead of a bridge.',
        signs: [
          'Fill silence even when unnecessary',
          'Interrupt or talk over others',
          'Explain motives before being asked',
          'Truth lost in elaboration',
          'Exhausted after social speaking',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When throat threads through another chakra's decade, expression and truthfulness run underneath. You notice what you say, what you hold back, what you cannot quite name — and that tells you where that decade is actually being lived.",
    },
    reflectionPrompts: [
      'What have you been not saying out loud?',
      'Whose voice surfaces when you speak?',
      'What truth would soften your throat if spoken?',
    ],
  },

  thirdeye: {
    formation: {
      title: 'Seeing past the first answer',
      body: 'Between thirty-five and forty-two, pattern-recognition sharpens. The stories you were told about yourself, family, work, meaning — they get examined. You start to see your life from slightly above, noticing the shapes that were always there.',
    },
    revisit: {
      title: 'Vision clarifies',
      spiral2:
        "After eighty-four, the third eye returns uncluttered. You see without needing to act on what you see. Intuition arrives cleanly, without the earlier noise of hope and fear. What's true shows itself.",
      anytime:
        'A synchronicity that unsettles, a meditative opening, an intuition finally trusted, trauma that rewires perception, a diagnosis, a death. These return you to the late-thirties question: what am I actually seeing?',
    },
    states: {
      deficient: {
        title: 'Vision clouded',
        body: "When the third eye is deficient, perception dulls. You trust others' readings over your own. Dreams fade, intuition whispers too softly to hear, meaning feels distant or constructed.",
        signs: [
          'Dreams rarely remembered',
          'Intuition doubted or dismissed',
          'Difficulty seeing patterns in life',
          'Decisions made only by logic',
          'Meaning feels out of reach',
        ],
      },
      balanced: {
        title: 'Seeing clearly',
        body: 'When balanced, insight and reason cooperate. You sense patterns without forcing them. Intuition arrives and is checked, dreams speak, imagery guides rather than floods. The inner and outer eye meet.',
        signs: [
          'Trust hunches and verify them calmly',
          'Recognize patterns in your own life',
          'Dreams remembered and considered',
          'Visual imagination vivid and clear',
          'Decisions balance head and gut',
        ],
      },
      excessive: {
        title: 'Lost in vision',
        body: 'When excessive, imagination overtakes grounding. You live in symbols, prophecies, overinterpretations. Meaning layers so thick that ordinary reality feels inadequate.',
        signs: [
          'Over-interpret signs and synchronicities',
          'Disconnected from ordinary sensation',
          'Escapism through fantasy or vision',
          'Paranoid or conspiratorial thinking',
          'Dreams more vivid than waking life',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When third eye threads through another chakra's decade, vision and pattern sit underneath. You notice what you're seeing and what you're refusing to see — and that perception shapes whether this decade stays surface or goes deeper.",
    },
    reflectionPrompts: [
      'What pattern are you finally seeing now?',
      'What have you been refusing to look at?',
      'Whose vision of you did you inherit?',
    ],
  },

  crown: {
    formation: {
      title: 'The question of meaning itself',
      body: 'Between forty-two and forty-nine, something larger asks to be reckoned with. Belief, mortality, purpose, the sacred — whether you believe in anything, and whether belief is even the right word. The crown either opens into spaciousness or closes into quiet hollowness.',
    },
    revisit: {
      title: 'Meaning simplifies',
      spiral2:
        'After ninety-one, the crown returns spacious. You release much of what you thought you needed to know. Meaning arrives without being constructed. Presence itself becomes enough.',
      anytime:
        "A mystical experience, profound loss, meditation deepening, a long illness, approaching death, the birth of a child, catastrophic failure. These return you to the forty-five-year-old's question: what is this life actually for?",
    },
    states: {
      deficient: {
        title: 'The sky feels closed',
        body: "When the crown is deficient, life feels flat. Purpose evades you, the sacred feels like someone else's story, meaning-making stalls. You sense a ceiling just above your head.",
        signs: [
          'Sense of meaninglessness persists',
          'Spirituality feels foreign or forced',
          'Difficulty feeling awe',
          'Cynicism as default stance',
          'No felt connection to anything larger',
        ],
      },
      balanced: {
        title: 'Quiet sky, open top',
        body: 'When balanced, meaning is not manufactured. You sense belonging to something larger without needing to name it. Presence restores. Silence holds. The ordinary becomes enough.',
        signs: [
          'Awe arrives in ordinary moments',
          'Sense of belonging without belief',
          'Silence feels full not empty',
          'Meaning felt more than thought',
          'Mortality met without terror',
        ],
      },
      excessive: {
        title: 'Sky without ground',
        body: 'When excessive, spirituality becomes escape. You float above daily life, bypass emotion with enlightenment talk, detach from body and relationship. The crown opens at the expense of roots.',
        signs: [
          'Dissociation dressed as presence',
          'Spiritual bypass of hard feelings',
          'Disconnection from body and earth',
          'Guru projection or certainty-seeking',
          'Relationships feel beneath you',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When crown threads through another chakra's decade, the question of meaning quietly frames everything. You notice whether what you're doing connects to something larger — or whether it has become only motion, only task.",
    },
    reflectionPrompts: [
      'What is this decade actually for?',
      'Where does meaning arrive without being made?',
      'What are you belonging to right now?',
    ],
  },
};

export function getChakraStates(id) {
  return CHAKRA_STATES[id] || null;
}

export function hasChakraStates(id) {
  return Boolean(CHAKRA_STATES[id]);
}

export default CHAKRA_STATES;
