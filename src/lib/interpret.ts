export type DreamInput = {
  dream: string;
  age: string;
  dreamType: "dream" | "nightmare" | "lucid";
  dayMood: string;
  dreamMood: string;
};

export type DreamIcon =
  | "moon"
  | "water"
  | "flight"
  | "house"
  | "path"
  | "nature"
  | "person"
  | "stars"
  | "key"
  | "heart";

export type DreamReport = {
  title: string;
  subtitle: string;
  summary: string;
  symbols: Array<{
    name: string;
    meaning: string;
    icon: DreamIcon;
    color: string;
  }>;
  emotions: Array<{ label: string; value: number }>;
  emotionalInsight: string;
  themes: string[];
  reflection: string;
  prompts: string[];
  affirmation: string;
  interpretationNote: string;
};

type Mood =
  | "calm"
  | "happy"
  | "anxious"
  | "sad"
  | "excited"
  | "curious"
  | "confused"
  | "neutral";
type Feeling = "Calm" | "Wonder" | "Unease" | "Connection";
type Motif = {
  id: string;
  name: string;
  pattern: string;
  icon: DreamIcon;
  color: string;
  theme: string;
  meaning: string;
  question: string;
};
type MatchedMotif = Motif & { evidence: string; index: number; count: number };

const motifs: Motif[] = [
  {
    id: "water",
    name: "Water & the inner world",
    pattern:
      "water|ocean(?:s)?|sea(?:s)?|river(?:s)?|lake(?:s)?|wave(?:s)?|tide(?:s)?|swim(?:ming)?|swam|underwater|drown(?:ing|ed)?",
    icon: "water",
    color: "#95c8d2",
    theme: "Emotional depth",
    meaning:
      "Water can be a useful image for feelings that are difficult to put into words: sometimes spacious and soothing, sometimes powerful or uncertain. Its meaning here depends on what the water was doing and how you felt near it. It might invite you to notice the pace and depth of your current feelings, without assuming that the image has one universal meaning.",
    question:
      "What was the water like, and where in your waking life do you recognize that same feeling?",
  },
  {
    id: "flight",
    name: "Flight & possibility",
    pattern:
      "fly|flying|flew|flown|float(?:ing|ed)?|soar(?:ing|ed)?|wing(?:s)?|levitat(?:e|ing|ion)",
    icon: "flight",
    color: "#c9b8ed",
    theme: "Freedom & possibility",
    meaning:
      "The movement of flight can offer a fresh perspective on freedom, distance, or the wish for more room. Ease in the air may feel like possibility; difficulty staying aloft may bring up questions about support or control. Your own experience of the flight matters more than the symbol itself. Consider whether this image feels like moving toward something, taking a welcome pause, or creating space around a demanding situation.",
    question:
      "When you were airborne, did it feel more like freedom, distance, or a need for support?",
  },
  {
    id: "threshold",
    name: "Doorways & new chapters",
    pattern:
      "door(?:s|way|ways)?|gate(?:s|way|ways)?|key(?:s)?|threshold(?:s)?|entrance(?:s)?|portal(?:s)?",
    icon: "key",
    color: "#d6bc8a",
    theme: "Change & choice",
    meaning:
      "A door, key, or entrance can be a gentle way to think about access, choice, and boundaries. You may connect it with an opportunity, something private, or simply a place you remember. Notice whether you wanted to enter, leave, open it, or stay where you were. That small detail may say more about your personal relationship with change than any fixed symbolic definition could.",
    question:
      "What did you want to happen at the doorway or entrance, and does that wish connect with a current choice?",
  },
  {
    id: "house",
    name: "Rooms & belonging",
    pattern:
      "house(?:s)?|home(?:s)?|room(?:s)?|bedroom(?:s)?|basement(?:s)?|attic(?:s)?|building(?:s)?|apartment(?:s)?|castle(?:s)?",
    icon: "house",
    color: "#c6b5a5",
    theme: "Belonging & inner space",
    meaning:
      "Buildings and rooms can bring personal associations with belonging, privacy, memory, or the different roles you inhabit. A familiar place may carry a very different feeling from an unfamiliar one. Rather than assigning each room a hidden meaning, ask what this particular space allowed you to feel or do, and whether you have enough of that kind of space in everyday life.",
    question:
      "What felt familiar or unfamiliar about the place, and what does that place mean to you personally?",
  },
  {
    id: "path",
    name: "Paths & direction",
    pattern:
      "road(?:s)?|path(?:s|way|ways)?|journey(?:s)?|bridge(?:s)?|stair(?:s|case|cases)?|corridor(?:s)?|train(?:s)?|station(?:s)?|car(?:s)?|driv(?:e|ing)|drove|travel(?:ing|ling|led|ed)?",
    icon: "path",
    color: "#c5c4a1",
    theme: "Finding your direction",
    meaning:
      "Journeys and routes can be useful images for the way you are moving through a situation. A destination may matter, but so may the pace, your companions, and whether the route felt chosen. This could be a moment to notice where you feel directed by your own wishes and where you are responding to outside expectations. An ordinary recent journey could also be the source of the image.",
    question:
      "Did you know where you were going, and how did you feel about the direction or pace?",
  },
  {
    id: "nature",
    name: "Nature & renewal",
    pattern:
      "forest(?:s)?|tree(?:s)?|garden(?:s)?|flower(?:s)?|wood(?:s)?|mountain(?:s)?|field(?:s)?|grass|seed(?:s)?|plant(?:s)?",
    icon: "nature",
    color: "#a7c3ad",
    theme: "Growth & restoration",
    meaning:
      "Natural places may invite associations with rest, growth, complexity, or simply a landscape you know. Notice whether the setting felt welcoming, overwhelming, alive, or still. Your relationship with that place is the useful starting point. If the image feels restorative to you, it may offer a practical reminder to make room for something that helps you feel grounded.",
    question:
      "What feeling did the natural setting create, and where could you make room for that feeling while awake?",
  },
  {
    id: "people",
    name: "People & connection",
    pattern:
      "friend(?:s)?|mother|mom|mum|father|dad|parent(?:s)?|sister(?:s)?|brother(?:s)?|family|partner|husband|wife|child(?:ren)?|baby|babies|stranger(?:s)?|someone|grandmother|grandfather",
    icon: "person",
    color: "#d4b0b8",
    theme: "Connection & belonging",
    meaning:
      "The people in a dream can connect with memories, feelings about a relationship, or qualities you associate with them. Their presence does not tell us what they think or what will happen between you. Focus instead on what you felt in their company and what you needed in that moment: closeness, space, reassurance, recognition, or something else entirely.",
    question:
      "What did you need from the person in the dream, and is there a gentle way to acknowledge that need now?",
  },
  {
    id: "sky",
    name: "The sky & perspective",
    pattern:
      "star(?:s)?|moon|sky|skies|planet(?:s)?|galax(?:y|ies)|universe|constellation(?:s)?|space|sunrise|sunset",
    icon: "stars",
    color: "#c4b8e4",
    theme: "Perspective & wonder",
    meaning:
      "An open sky or celestial image can create a sense of wonder, distance, possibility, or solitude. Which of those fits depends on the mood of your dream and your personal associations. You might use the image to step back from a situation and ask what feels meaningful at a wider scale, while leaving room for it to be a beautiful image without a deeper message.",
    question:
      "Did the sky make you feel connected, small, peaceful, or something else, and what does that feeling remind you of?",
  },
  {
    id: "pursuit",
    name: "Pursuit & personal space",
    pattern:
      "chas(?:e|ed|ing)|pursu(?:e|ed|ing)|escap(?:e|ed|ing)|trapp(?:ed|ing)|hid(?:e|ing)|ran away|run away|running away",
    icon: "path",
    color: "#c5a5b8",
    theme: "Safety & boundaries",
    meaning:
      "Being pursued, hiding, or trying to escape can be an unsettling dream experience. As a reflective image, it may help you explore pressure, the need for a pause, or a boundary you would like to have. It does not establish that you are avoiding something or facing an actual threat. Start with what would have helped you feel safer inside the dream, and see whether that offers a kind next step while awake.",
    question:
      "What would have helped you feel safer or less pressured in that scene?",
  },
  {
    id: "falling",
    name: "Falling & support",
    pattern: "fall(?:ing)?|fell|drop(?:ping|ped)|cliff(?:s)?",
    icon: "flight",
    color: "#b4bad2",
    theme: "Trust & support",
    meaning:
      "A falling sensation may bring up questions about steadiness, trust, or having enough support. It can also occur as an ordinary sleep sensation, without a symbolic cause. If the image feels relevant to your waking life, notice where you might appreciate a firmer foothold or a little more help. The useful question is what helps you feel held, rather than whether the dream is warning you of something.",
    question:
      "What would a firmer foothold or a little more support look like in your life right now?",
  },
  {
    id: "animal",
    name: "Animals & instinct",
    pattern:
      "dog(?:s)?|cat(?:s)?|bird(?:s)?|wolf|wolves|snake(?:s)?|horse(?:s)?|fox(?:es)?|lion(?:s)?|bear(?:s)?|butterfl(?:y|ies)",
    icon: "nature",
    color: "#c2bb9b",
    theme: "Instinct & response",
    meaning:
      "An animal may carry a personal memory, a familiar relationship, or a quality you associate with that creature. There is no universal code that turns one species into one meaning. What matters here is the interaction: whether you felt protected, curious, wary, or close. That response may offer a useful way to explore how you meet something unfamiliar or respond to your own needs.",
    question:
      "What qualities do you personally associate with the animal, and how did you respond to it?",
  },
];

const clean = (value: string) => value.trim().replace(/\s+/g, " ");
const label = (value: string) =>
  clean(value).toLowerCase().replace(/[_-]+/g, " ");

function normalizeMood(value: string): Mood {
  const text = label(value);
  if (
    /anxious|anxiety|stress|worried|fear|scared|afraid|overwhelm|angry|frustrat|tense|uneasy/.test(
      text,
    )
  )
    return "anxious";
  if (/sad|low|lonely|melanchol|down|upset/.test(text)) return "sad";
  if (/excit|energetic|inspir|adventur|hopeful/.test(text)) return "excited";
  if (/happy|joy|content|positive|cheerful|grateful/.test(text)) return "happy";
  if (/calm|peace|relax|serene|safe/.test(text)) return "calm";
  if (/curious|curiosity|inquisitive/.test(text)) return "curious";
  if (/confus|mixed|uncertain|strange|surreal/.test(text)) return "confused";
  return "neutral";
}

const moodNames: Record<Mood, string> = {
  calm: "calm",
  happy: "happiness",
  anxious: "tension",
  sad: "sadness",
  excited: "excitement",
  curious: "curiosity",
  confused: "uncertainty",
  neutral: "a more neutral feeling",
};

function findMotifs(dream: string): MatchedMotif[] {
  return motifs
    .flatMap((motif) => {
      const matches = [
        ...dream.matchAll(new RegExp(`\\b(?:${motif.pattern})\\b`, "gi")),
      ];
      if (!matches.length) return [];
      return [
        {
          ...motif,
          evidence: matches[0][0],
          index: matches[0].index ?? 0,
          count: matches.length,
        },
      ];
    })
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .slice(0, 4);
}

function getLifeStage(age: string): { context: string; prompt: string } {
  const normalized = label(age);
  const firstNumber = Number(normalized.match(/\d+/)?.[0]);
  if (
    /under|below|teen/.test(normalized) ||
    (firstNumber > 0 && firstNumber < 18)
  ) {
    return {
      context:
        "If questions of belonging, growing independence, or finding your own voice feel relevant at your age, they may be useful context; there is no need to force that connection.",
      prompt:
        "Where would you like a little more understanding, support, or room to be yourself?",
    };
  }
  if (firstNumber >= 18 && firstNumber < 30) {
    return {
      context:
        "At this life stage, questions of identity, independence, and what comes next may offer useful context, if they fit your experience.",
      prompt:
        "Which current possibility or expectation feels most connected to the dream?",
    };
  }
  if (firstNumber >= 30 && firstNumber < 50) {
    return {
      context:
        "If you are balancing commitments with your own changing wishes, that tension may be useful context for this reading; your age alone does not tell us what your life looks like.",
      prompt:
        "Which part of your life could use more space for your own needs or wishes?",
    };
  }
  if (firstNumber >= 50) {
    return {
      context:
        "Questions of continuity, changing priorities, or what you want to make room for may offer a useful lens at this life stage, if they resonate with you.",
      prompt:
        "What feels worth carrying forward, and what would you like to make more room for?",
    };
  }
  return {
    context:
      "Your current circumstances and personal associations are more useful guides than a general symbol dictionary.",
    prompt:
      "What is happening in your life that feels closest to the atmosphere of this dream?",
  };
}

function makeExcerpt(dream: string): string {
  const sentence = dream.match(/[^.!?]+[.!?]?/)?.[0]?.trim() || dream;
  if (sentence.length <= 145) return sentence;
  const excerpt = sentence.slice(0, 142).replace(/\s+\S*$/, "");
  return `${excerpt}…`;
}

function emotionScores(
  day: Mood,
  dream: Mood,
  type: DreamInput["dreamType"],
  matches: MatchedMotif[],
  text: string,
): DreamReport["emotions"] {
  const weights: Record<Mood, Record<Feeling, number>> = {
    calm: { Calm: 12, Wonder: 4, Unease: 1, Connection: 5 },
    happy: { Calm: 7, Wonder: 7, Unease: 1, Connection: 9 },
    anxious: { Calm: 2, Wonder: 3, Unease: 14, Connection: 4 },
    sad: { Calm: 3, Wonder: 2, Unease: 8, Connection: 9 },
    excited: { Calm: 3, Wonder: 13, Unease: 3, Connection: 5 },
    curious: { Calm: 5, Wonder: 12, Unease: 3, Connection: 5 },
    confused: { Calm: 3, Wonder: 9, Unease: 8, Connection: 4 },
    neutral: { Calm: 6, Wonder: 6, Unease: 4, Connection: 5 },
  };
  const feelings: Feeling[] = ["Calm", "Wonder", "Unease", "Connection"];
  const scores = feelings.map(
    (feeling) => weights[dream][feeling] * 2 + weights[day][feeling],
  );
  if (type === "nightmare") scores[2] += 12;
  if (type === "lucid") scores[1] += 10;
  if (matches.some((motif) => ["sky", "flight"].includes(motif.id)))
    scores[1] += 7;
  if (matches.some((motif) => ["people", "house", "animal"].includes(motif.id)))
    scores[3] += 6;
  if (matches.some((motif) => ["pursuit", "falling"].includes(motif.id)))
    scores[2] += 8;
  if (/\b(?:peaceful|calm|safe|relaxed|serene)\b/i.test(text)) scores[0] += 8;
  if (/\b(?:afraid|terrified|scared|fear|panic|frightened)\b/i.test(text))
    scores[2] += 8;
  const total = scores.reduce((sum, score) => sum + score, 0);
  const percentages = scores.map((score) => Math.floor((score / total) * 100));
  let remaining = 100 - percentages.reduce((sum, score) => sum + score, 0);
  const order = scores
    .map((score, index) => ({
      index,
      remainder: (score / total) * 100 - percentages[index],
    }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const item of order) {
    if (!remaining) break;
    percentages[item.index] += 1;
    remaining -= 1;
  }
  return feelings.map((feeling, index) => ({
    label: feeling,
    value: percentages[index],
  }));
}

function reportTitle(
  matches: MatchedMotif[],
  type: DreamInput["dreamType"],
): string {
  const ids = matches.map((motif) => motif.id);
  if (ids.includes("water") && ids.includes("flight"))
    return "Between depth and possibility";
  if (ids.includes("water") && ids.includes("threshold"))
    return "At the edge of something new";
  if (type === "nightmare") return "Finding steadiness in the unknown";
  if (type === "lucid") return "A little more awake within";
  const titles: Record<string, string> = {
    water: "What moves beneath the surface",
    flight: "Room to rise",
    threshold: "A threshold within",
    house: "The spaces we carry",
    path: "Finding your own way",
    nature: "A quiet invitation to grow",
    people: "The threads that connect us",
    sky: "A wider kind of wonder",
    pursuit: "Making room to feel safe",
    falling: "Looking for a softer landing",
    animal: "Listening to your instincts",
  };
  return titles[ids[0]] || "A moment worth listening to";
}

/** A deterministic reflection aid. It does not predict events or infer mental health. */
export function interpretDream(input: DreamInput): DreamReport {
  const dream = clean(input.dream);
  if (!dream)
    throw new Error(
      "Write a little about your dream before beginning your reflection.",
    );

  const dayMood = normalizeMood(input.dayMood);
  const dreamMood = normalizeMood(input.dreamMood);
  const matches = findMotifs(dream);
  const stage = getLifeStage(input.age);
  const excerpt = makeExcerpt(dream);
  const type = input.dreamType;
  const typeName =
    type === "lucid"
      ? "lucid dream"
      : type === "nightmare"
        ? "nightmare"
        : "dream";
  const emotionalContrast =
    dayMood === dreamMood
      ? `The ${moodNames[dayMood]} you selected for both your day and your dream gives this reflection a consistent emotional thread. That continuity may be worth noticing, without treating it as proof that the day caused the dream.`
      : `You described your day with ${moodNames[dayMood]} and your dream with ${moodNames[dreamMood]}. That change in atmosphere is a useful starting point: what felt different in the dream, and what did that difference make possible or difficult? It does not necessarily reveal a hidden feeling.`;

  const motifSummary =
    matches.length > 1
      ? `The images of ${matches
          .slice(0, 3)
          .map((motif) => `“${motif.evidence}”`)
          .join(
            ", ",
          )} offer a few connected starting points. Read them as invitations to explore ${matches
          .slice(0, 2)
          .map((motif) => motif.theme.toLowerCase())
          .join(
            " and ",
          )}, and keep only the associations that fit your own experience.`
      : matches.length === 1
        ? `The image of “${matches[0].evidence}” offers a starting point for exploring ${matches[0].theme.toLowerCase()}. Its personal meaning depends on what happened around it and how you felt, so treat the following reading as a possibility to try on.`
        : "Rather than assigning a stock symbol to your description, this reading starts with your own words and the emotional atmosphere you selected. A small detail, a gesture, or the feeling you woke with may be more useful than a general symbolic explanation.";

  const typeContext =
    type === "nightmare"
      ? "Because you described this as a nightmare, begin with care for how it felt. A frightening dream is not a prediction or evidence that you wanted its events to happen. You can explore it at your own pace and leave any interpretation that feels unhelpful."
      : type === "lucid"
        ? "Because you described being aware within the dream, it may be interesting to explore where you felt able to choose and where the dream continued on its own. Lucidity does not require complete control; curiosity about your response can be more useful than judging how well you directed the scene."
        : "Dreams can weave together recent impressions, old memories, and imagined scenes without a single clear message. You can still use this one as a creative way to notice what matters to you, while allowing some of it to remain simply dreamlike.";

  const themes = [
    ...new Set([
      ...matches.map((motif) => motif.theme),
      ...(type === "lucid" ? ["Awareness & choice"] : []),
      ...(type === "nightmare" ? ["Care & reassurance"] : []),
      ...(dayMood !== dreamMood
        ? ["An emotional shift"]
        : ["Your emotional thread"]),
    ]),
  ].slice(0, 4);

  const closing =
    type === "nightmare"
      ? "For a gentle next step, take a moment to notice your surroundings, relax your shoulders, and remind yourself that the scene has ended. If you want, imagine one small change that would make its ending feel safer. You do not have to return to any part of the dream you would rather leave alone."
      : type === "lucid"
        ? "You might revisit one moment when you noticed you were dreaming and write down what you wanted to do next. Consider whether that wish points toward curiosity, rest, connection, or more choice in waking life. Choose one small, ordinary action that honors what feels useful, rather than trying to recreate the dream."
        : "Choose one image or feeling you want to carry into the day, and write one sentence about what it means to you. Then consider a small action: make room to rest, speak to someone, explore a possibility, or simply pay attention. The dream does not need a final explanation to become a useful moment of reflection.";

  return {
    title: reportTitle(matches, type),
    subtitle: `A personal reflection on your ${typeName}`,
    summary: `“${excerpt}” This moment from your own description anchors the reading. ${motifSummary} ${stage.context}`,
    symbols: matches.map((motif) => ({
      name: motif.name,
      meaning: `You mentioned “${motif.evidence}”. ${motif.meaning}`,
      icon: motif.icon,
      color: motif.color,
    })),
    emotions: emotionScores(dayMood, dreamMood, type, matches, dream),
    emotionalInsight: `${emotionalContrast} ${typeContext}`,
    themes,
    reflection: `${stage.context} ${closing}`,
    prompts: [
      matches[0]?.question ||
        `When you revisit “${excerpt}”, what detail or feeling stands out most strongly?`,
      dayMood !== dreamMood
        ? "What changed between the mood of your day and the mood of your dream, and what does that difference mean to you?"
        : "Where have you noticed a similar feeling recently, and what did you need in that moment?",
      stage.prompt,
    ],
    affirmation:
      type === "nightmare"
        ? "I can meet an unsettling memory with gentleness. I am allowed to pause and return to the present."
        : type === "lucid"
          ? "I can be curious about my inner world and make room for choices that feel like my own."
          : "I can listen to what stays with me, and give it meaning in my own time.",
    interpretationNote:
      "A locally generated, symbolic reflection based on the words and moods you shared. Symbol meanings are possibilities, not scientific findings, diagnoses, or predictions. The emotional chart is an illustrative balance of your selected moods and dream imagery, not a measurement. Your own associations come first.",
  };
}
