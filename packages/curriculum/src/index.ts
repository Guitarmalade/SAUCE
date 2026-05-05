export type CurriculumAreaId = "fretboard" | "rhythm" | "theory" | "technique" | "harmony" | "bag-of-tricks";

export type CurriculumArea = {
  id: CurriculumAreaId;
  name: string;
  pillar: string;
  description: string;
};

export type LevelSummary = {
  number: 1 | 2 | 3 | 4 | 5;
  theme: string;
  outcome: string;
};

export type ExerciseDefinition = {
  key: string;
  level: number;
  areaId: CurriculumAreaId;
  title: string;
  summary: string;
  targetBpm: number;
  freePreview: boolean;
  saucePhase: "Study (Steal)" | "Assimilate" | "Utilize" | "Compose/Create" | "Experience/Elevate";
  instructions: string[];
};

export const CORE_AREAS: CurriculumArea[] = [
  {
    id: "fretboard",
    name: "Fretboard Awareness",
    pillar: "Core",
    description: "Map the neck clearly so every practice decision starts from orientation instead of guesswork."
  },
  {
    id: "rhythm",
    name: "Rhythm",
    pillar: "Core",
    description: "Internalize timing, groove, and subdivision so ideas land musically."
  },
  {
    id: "theory",
    name: "Music Theory",
    pillar: "Core",
    description: "Understand intervals, key centers, chord function, and why material works."
  },
  {
    id: "technique",
    name: "Technique",
    pillar: "Core",
    description: "Raise the clean speed floor and make mechanics reliable under pressure."
  },
  {
    id: "harmony",
    name: "Harmony",
    pillar: "Core",
    description: "Connect voicings, progressions, and voice leading so practice becomes music."
  },
  {
    id: "bag-of-tricks",
    name: "Bag O' Tricks",
    pillar: "Personalized",
    description: "Curate licks, embellishments, and solo devices students can actually use."
  }
];

export const LEVELS: LevelSummary[] = [
  { number: 1, theme: "Orientation", outcome: "Build a reliable base and establish repeatable practice habits." },
  { number: 2, theme: "Connection", outcome: "Connect shapes, scale logic, and triads inside a chosen key." },
  { number: 3, theme: "Application", outcome: "Turn vocabulary into phrases over progressions and musical examples." },
  { number: 4, theme: "Fluency", outcome: "Play with stronger confidence, speed, and harmonic control." },
  { number: 5, theme: "Voice", outcome: "Compose, improvise, and perform with a recognizable personal sound." }
];

export const LEVEL_ONE_EXERCISES: ExerciseDefinition[] = [
  {
    key: "lvl1-fretboard-a-major-map",
    level: 1,
    areaId: "fretboard",
    title: "A major note map",
    summary: "Find the notes up 12 and down 5 so the neck becomes navigable fast.",
    targetBpm: 80,
    freePreview: true,
    saucePhase: "Assimilate",
    instructions: [
      "Name every A across the neck.",
      "Use the up-12, down-5 rule.",
      "Say the note before you play it."
    ]
  },
  {
    key: "lvl1-rhythm-quarter-grid",
    level: 1,
    areaId: "rhythm",
    title: "Quarter-note grid",
    summary: "Lock simple comping patterns to the click before subdivision gets denser.",
    targetBpm: 76,
    freePreview: true,
    saucePhase: "Utilize",
    instructions: [
      "Play one bar per chord.",
      "Keep the click on two and four.",
      "Track how relaxed the strumming hand feels."
    ]
  },
  {
    key: "lvl1-theory-major-formula",
    level: 1,
    areaId: "theory",
    title: "Major scale formula",
    summary: "Connect whole and half steps to the actual key center you are studying.",
    targetBpm: 72,
    freePreview: true,
    saucePhase: "Assimilate",
    instructions: [
      "Spell the major scale degrees out loud.",
      "Play them on one string first.",
      "Identify the tonic, third, and fifth."
    ]
  },
  {
    key: "lvl1-technique-alt-picking",
    level: 1,
    areaId: "technique",
    title: "Alternate picking baseline",
    summary: "Create a clean, sustainable picking floor before chasing speed.",
    targetBpm: 84,
    freePreview: true,
    saucePhase: "Compose/Create",
    instructions: [
      "Use strict alternate picking.",
      "Increase only when articulation stays clean.",
      "Log the top clean BPM, not the sloppiest fast BPM."
    ]
  },
  {
    key: "lvl1-harmony-triad-sweet-spot",
    level: 1,
    areaId: "harmony",
    title: "Triad sweet spot",
    summary: "Move basic triads on one string set so harmony becomes visible and musical.",
    targetBpm: 74,
    freePreview: false,
    saucePhase: "Utilize",
    instructions: [
      "Stay on one string set.",
      "Hear the inversion before you grab it.",
      "Move the same shape family through the key."
    ]
  },
  {
    key: "lvl1-bag-otricks-sequence-lick",
    level: 1,
    areaId: "bag-of-tricks",
    title: "Sequence lick starter",
    summary: "Take one musical device and bend it into your own phrasing.",
    targetBpm: 88,
    freePreview: true,
    saucePhase: "Study (Steal)",
    instructions: [
      "Copy the shape exactly first.",
      "Shift the rhythm second.",
      "Resolve it into a phrase you actually like."
    ]
  }
];

export const SAMPLE_EXERCISES: Record<CurriculumAreaId, string> = {
  fretboard: "A major note map",
  rhythm: "Quarter-note grid",
  theory: "Major scale formula",
  technique: "Alternate picking baseline",
  harmony: "Triad sweet spot",
  "bag-of-tricks": "Sequence lick starter"
};

export function listExercisesForLevel(level: number) {
  return LEVEL_ONE_EXERCISES.filter((exercise) => exercise.level === level);
}

export function getExerciseByKey(key: string) {
  return LEVEL_ONE_EXERCISES.find((exercise) => exercise.key === key);
}
