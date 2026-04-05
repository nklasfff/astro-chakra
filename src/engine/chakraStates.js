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
        'When root is the sub-chakra, the year carries a undertone of foundation. Whatever the parent chakra is working on, this year asks you to check the ground beneath it. Practical questions surface: is the structure sound? Do the basics hold? The body wants contact with something solid before it moves further.',
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
      title: 'The furnace that turned wanting into doing something about it',
      body: 'Between fourteen and twenty-one, the self catches fire. The teenager discovers they can act — not just respond, not just endure, but push back, choose, refuse. The solar plexus records whether that first flame was fanned or doused. Humiliation lands here. So does the memory of the first time your no changed the shape of a room.',
    },
    revisit: {
      title: 'Power, reconsidered at a lower heat',
      spiral2:
        'Around sixty-three, the solar plexus returns — but the fire has a different quality. The career is winding down or already gone. The question is no longer can I make things happen but what was all that effort actually for? Identity loosens from achievement, and the belly must find a new reason to stay warm.',
      anytime:
        'The solar plexus reawakens whenever agency is threatened or tested. Redundancy, a controlling relationship, public failure, a decision that costs you standing. Any moment that asks: do I still have the right to act?',
    },
    states: {
      deficient: {
        title: 'The fire gone cold',
        body: 'A deficient solar plexus produces a life lived in the passive voice. Things happen to you. Decisions feel impossibly heavy. The belly stays hollow where a furnace should be. You wait for permission that nobody is going to give.',
        signs: [
          'Chronic difficulty making even small decisions',
          'People-pleasing that erases your own preferences',
          'Procrastination rooted in fear, not laziness',
          'Low physical energy, especially in the core',
          "Apologising before you've done anything wrong",
        ],
      },
      balanced: {
        title: 'A steady flame, well-tended',
        body: 'A balanced solar plexus acts without performing. You say no cleanly, yes deliberately. Effort matches the task — no more, no less. The stomach is calm before confrontation. Power doesn\'t need an audience.',
        signs: [
          'Decisions made from the gut without overthinking',
          "Healthy self-discipline that doesn't punish",
          'Confidence that stays quiet until needed',
          'Ability to receive criticism without collapsing',
          'Following through on commitments without resentment',
        ],
      },
      excessive: {
        title: 'The fire that eats the house',
        body: 'An excessive solar plexus confuses force with strength. Control becomes the organising principle — of people, of outcomes, of every variable within reach. The belly is never soft. Rest feels like failure. You burn through people and call it leadership.',
        signs: [
          'Need to control outcomes down to the smallest detail',
          'Anger that arrives fast and takes over completely',
          'Workaholism mistaken for passion or dedication',
          'Dominating conversations without noticing the pattern',
          'Inability to delegate or trust others with tasks',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When solar plexus is the sub-chakra, the year carries an undertone of will and agency. Whatever the parent chakra is working on, this year asks whether you are acting from your own centre or borrowing someone else's. The belly tightens around questions of authority. Something wants to be decided, not discussed.",
    },
    reflectionPrompts: [
      "What are you over-controlling because you're afraid to feel?",
      'When was the last time your no changed something?',
      'Where do you shrink when you could simply stand still?',
    ],
  },

  heart: {
    formation: {
      title: 'The place where the self learned to include another',
      body: 'Between twenty-one and twenty-eight, love stops being something you feel and becomes something you build with. The heart chakra forms through the collision of intimacy and independence — the discovery that letting someone matter to you is not the same as losing yourself. Grief enters the curriculum here. So does forgiveness, though it arrives years late and never looks the way you expected.',
    },
    revisit: {
      title: 'Love, stripped of its old costumes',
      spiral2:
        'Around seventy, the heart returns with less negotiation. Friends are dying. The body is smaller. Love at this age is not romantic architecture — it is the willingness to remain tender in a world that gives you every reason to close. The chest either softens or calcifies. There is very little middle ground.',
      anytime:
        'The heart reawakens with any breach of connection. Betrayal, abandonment, the death of someone who held a piece of your life. But also the unexpected — a kindness from a stranger that cracks something open you thought was sealed.',
    },
    states: {
      deficient: {
        title: 'The chest behind glass',
        body: 'A deficient heart keeps people at a precise distance — close enough to function, never close enough to wound. Loneliness is the background hum, but it gets called independence. The ribcage feels armoured. Tenderness is a language you understand but no longer speak.',
        signs: [
          'Difficulty receiving affection without deflecting it',
          'Loneliness in rooms full of people who care',
          'Relationships that stay shallow despite years together',
          'Critical of others as a way to maintain distance',
          'Chest tightness or rounded shoulders curving inward',
        ],
      },
      balanced: {
        title: 'A chest that breathes both ways',
        body: "A balanced heart holds without gripping. You can sit with someone's pain without wearing it. Forgiveness is not a project but something that happens when you stop clenching. Boundaries exist, but they have doors in them.",
        signs: [
          'Able to give and receive love without keeping score',
          'Grief moves through without becoming permanent weather',
          "Compassion for others that doesn't deplete you",
          'Comfortable being seen in your vulnerability',
          'Breathing that reaches deep into the back ribs',
        ],
      },
      excessive: {
        title: 'The heart that drowns in others',
        body: "An excessive heart loses itself in love's direction. You feel everything — yours, theirs, the room's. Boundaries dissolve not from trust but from the inability to tolerate separation. Giving becomes compulsive. You empty yourself and call it generosity, then resent the very people you gave to.",
        signs: [
          'Codependency disguised as deep devotion or care',
          'Sacrificing your own needs until resentment builds',
          'Jealousy that arrives before reason can intervene',
          'Staying in relationships long after the love is gone',
          "Absorbing other people's emotions as your own",
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When heart is the sub-chakra, the year carries an undertone of relationship and empathy. Whatever the parent chakra is working on, this year asks who you are doing it with — and whether love has a seat at the table. The chest softens or aches. Connection becomes the lens through which everything else is measured.',
    },
    reflectionPrompts: [
      "Who have you kept at arm's length to avoid being hurt?",
      'What grief have you not yet let finish its sentence?',
      'When did you last let someone see you without your armour?',
    ],
  },

  throat: {
    formation: {
      title: "The voice that finally stopped borrowing other people's words",
      body: "Between twenty-eight and thirty-five, the borrowed voices begin to chafe. The sentences you learned from parents, mentors, lovers — the ones that kept you safe, that got you hired, that made you palatable — start to feel like someone else's coat. The throat chakra forms when you discover the difference between being articulate and being honest. The cost of that discovery is real. So is the relief.",
    },
    revisit: {
      title: 'The voice, returned to its owner',
      spiral2:
        'Around seventy-seven, the throat comes back with less diplomacy. The social filters thin. What remains is either bitterness or clarity — the difference depends on whether a lifetime of swallowed truths has been digested or is still sitting in the jaw. Some elders speak with devastating simplicity. Others have gone quiet for the wrong reasons.',
      anytime:
        'The throat reawakens whenever expression is silenced or distorted. Being talked over in a meeting, a secret kept too long, an artistic voice abandoned for practical reasons. Any moment the body knows something true and the mouth stays shut.',
    },
    states: {
      deficient: {
        title: 'The voice swallowed whole',
        body: "A deficient throat edits before it speaks — not for clarity but for survival. The true sentence gets caught somewhere between the chest and the teeth. You become fluent in what other people want to hear. The neck stiffens around everything you didn't say.",
        signs: [
          'Saying yes when the body is clearly saying no',
          'Going mute in conflict, replaying it for days',
          'A voice that thins or disappears under pressure',
          'Creative work that stays in notebooks, never shared',
          'Chronic jaw tension or teeth grinding at night',
        ],
      },
      balanced: {
        title: 'Speech that rests in the body',
        body: 'A balanced throat speaks from below the surface. Words come from the chest first, then the mouth. Silence is a choice, not a retreat. You can say difficult things without dramatising them. Listening is as natural as speaking — both happen from the same depth.',
        signs: [
          'Able to speak hard truths without cruelty',
          'Comfortable with silence in conversation',
          'Voice stays steady regardless of the audience',
          'Creative expression flows without perfectionism',
          'Listening fully before forming a response',
        ],
      },
      excessive: {
        title: 'The mouth that cannot stop',
        body: 'An excessive throat fills every silence. Words become a barrier rather than a bridge — talking to avoid being heard, explaining to prevent being seen. The voice runs ahead of the body. Volume substitutes for substance. Opinions arrive before the situation has been felt.',
        signs: [
          'Talking over others without registering the pattern',
          'Gossiping as release for things never said directly',
          'Over-explaining as though truth needs a legal defence',
          'Inability to tolerate silence or pauses in conversation',
          'Giving unsolicited advice compulsively and often',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When throat is the sub-chakra, the year carries an undertone of expression and truth. Whatever the parent chakra is working on, this year asks whether you can say it out loud — plainly, without performance. Something needs naming. The throat tightens around the unsaid or loosens when the right word finally arrives.',
    },
    reflectionPrompts: [
      'What is the truest thing you are not saying right now?',
      'Whose voice do you still hear when you edit yourself?',
      'When did your silence cost you more than speaking would have?',
    ],
  },

  thirdeye: {
    formation: {
      title: 'The moment the story you were living became transparent',
      body: 'Between thirty-five and forty-two, the internal narrator quiets enough for you to notice it was narrating. The roles you performed with conviction — partner, professional, responsible adult — become slightly see-through. You catch yourself watching your own life from a step back. This is not detachment. It is the first honest look. The third eye forms when the mind stops explaining long enough to notice what is actually in the room.',
    },
    revisit: {
      title: 'Seeing, with less to defend',
      spiral2:
        'Around eighty-four, the third eye returns without urgency. The need to understand has loosened its grip. What remains is either a spacious clarity — the kind that sees without grasping — or a mind that has hardened around its conclusions. Perception at this age is not sharper. It is simpler. The unnecessary has fallen away.',
      anytime:
        'The third eye reawakens whenever your operating story breaks down. A worldview that no longer holds, a pattern you finally see after years inside it, a moment of sudden knowing that arrives without logic. Anything that forces you to look at what you have been looking past.',
    },
    states: {
      deficient: {
        title: 'The eye that refuses to look',
        body: "A deficient third eye lives inside the explanation instead of the experience. You mistake the story for the thing itself. Intuition knocks but gets reclassified as coincidence. The mind stays busy precisely so it won't have to see what is plainly there.",
        signs: [
          'Difficulty distinguishing intuition from anxiety',
          'Poor memory for dreams or inability to visualise',
          'Denial that persists despite obvious evidence',
          'Literal-mindedness that distrusts the symbolic',
          'Insensitivity to patterns others see clearly',
        ],
      },
      balanced: {
        title: 'A mind that sees without grasping',
        body: 'A balanced third eye lets perception arrive without forcing it into a conclusion. Intuition and logic collaborate rather than compete. You hold two contradictory truths without needing to resolve them tonight. The mind is spacious. Dreams carry useful information.',
        signs: [
          'Intuition trusted and acted on without drama',
          'Comfortable holding ambiguity and not-knowing',
          'Ability to see patterns without becoming rigid',
          'Rich dream life that informs waking choices',
          'Imagination vivid but grounded in reality',
        ],
      },
      excessive: {
        title: "The mind that won't stop watching",
        body: 'An excessive third eye sees too much and touches too little. The mind becomes a surveillance system — analysing, interpreting, never landing. You intellectualise feelings to avoid having them. Insight becomes a substitute for intimacy. You understand everything and experience almost nothing.',
        signs: [
          'Overthinking disguised as intelligence or depth',
          'Obsessive analysis that delays every decision',
          'Headaches centred behind the eyes or across the forehead',
          'Nightmares or intrusive mental imagery',
          'Cynicism dressed as realism, seeing through everything',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        'When third eye is the sub-chakra, the year carries an undertone of perception and pattern. Whatever the parent chakra is working on, this year asks you to step back and see the larger shape. The mind quiets its opinions long enough for something truer to surface. Insight arrives sideways — in dreams, in the peripheral, in the pause between thoughts.',
    },
    reflectionPrompts: [
      'What are you seeing clearly but refusing to act on?',
      'Which belief about yourself has outlived its usefulness?',
      "When did you last trust a knowing you couldn't explain?",
    ],
  },

  crown: {
    formation: {
      title: 'The summit that turned out to be open sky',
      body: 'Between forty-two and forty-nine, the upward climb reaches its end and finds there is no peak. The ambitions that drove you through decades thin into something quieter. The crown chakra forms not through effort but through a slow release of the need to arrive anywhere. The body is still here. The mortgage is still real. But something at the top of the skull has opened, and the question that organised your life — what should I become? — has been replaced by one you cannot answer with a plan.',
    },
    revisit: {
      title: 'Surrender, without anything left to prove',
      spiral2:
        "Around ninety-one, the crown returns as the body itself prepares to open. The boundary between self and world has thinned to almost nothing. For some this is terror — the final loss of control. For others it is recognition: the thing they were searching for was never separate from the thing doing the searching. The crown's last teaching is its simplest.",
      anytime:
        "The crown reawakens in the presence of birth, death, or any experience that exceeds the mind's capacity to frame it. A moment of causeless peace. The sudden disappearance of the sense of separation. Anything that makes the skull feel less like a wall and more like a window.",
    },
    states: {
      deficient: {
        title: 'The ceiling held firmly shut',
        body: 'A deficient crown keeps the mind in charge of meaning. Everything must be understood before it can be trusted. Spiritual questions get dismissed as impractical or naive. The skull becomes a closed room. You live a competent life but something essential stays locked above the reach of your attention.',
        signs: [
          'Cynicism toward anything beyond the material',
          'Rigid need to understand before you can trust',
          'Learning that accumulates but never transforms',
          'Apathy disguised as sophistication or realism',
          'A quiet sense that life should mean more',
        ],
      },
      balanced: {
        title: 'A stillness that is not empty',
        body: 'A balanced crown rests. Not in belief — in presence. You stop needing to know the answer before you can act. Trust becomes structural rather than emotional. An ordinary afternoon feels like enough. The body is light without being disconnected. Meaning is not something you chase. It is something you stand inside.',
        signs: [
          'Comfort with mystery and unanswered questions',
          'Moments of quiet awe in ordinary settings',
          "Faith that doesn't require proof or doctrine",
          'Sense of connection that needs no explanation',
          'Able to be fully present without agenda',
        ],
      },
      excessive: {
        title: 'The spirit that left the body behind',
        body: 'An excessive crown floats above life instead of living it. Spirituality becomes an exit strategy — a way to bypass difficulty rather than meet it. The body gets neglected. Practicalities feel beneath you. You are so busy transcending that you forget to pay the electricity bill or call the friend who is grieving.',
        signs: [
          'Spiritual bypassing of real emotional difficulty',
          'Dissociation from the body and its daily needs',
          'Intellectual superiority about matters of consciousness',
          'Inability to commit to practical or material tasks',
          'Using transcendence to avoid intimacy or conflict',
        ],
      },
    },
    subChakra: {
      bodyTemplate:
        "When crown is the sub-chakra, the year carries an undertone of surrender and perspective. Whatever the parent chakra is working on, this year asks you to hold it more loosely. The mind's grip softens. Purpose stops being a destination and becomes a quality of attention. Something wants to be released rather than resolved.",
    },
    reflectionPrompts: [
      'What would remain if you stopped trying to become anything?',
      'Where in your life have you mistaken understanding for experiencing?',
      'What is the simplest thing you keep overlooking?',
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
