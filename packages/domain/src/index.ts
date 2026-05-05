export type SubscriptionTier = "free" | "paid";
export type GoalHorizon = "short" | "medium" | "long";
export type DomainArea =
  | "fretboard"
  | "rhythm"
  | "theory"
  | "technique"
  | "harmony"
  | "bag-of-tricks";

export type StudentGoal = {
  horizon: GoalHorizon;
  title: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  tier: SubscriptionTier;
  currentLevel: number;
  primaryKey: string;
  chosenPath: "core-first" | "song-first";
  goals: StudentGoal[];
  focusAreas: DomainArea[];
  streak: number;
};

export type PracticeLog = {
  id: string;
  exerciseKey: string;
  level: number;
  area: DomainArea;
  bpm: number;
  confidence: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  notes: string;
  submittedAt: string;
};

export type DashboardSummary = {
  student: StudentProfile;
  weeklyMinutes: number;
  averageConfidence: number;
  completedSessions: number;
  nextRecommendedFocus: string;
  nextCheckpoint: string;
  unlockedLevel: number;
  accessMessage: string;
};

export type OnboardingInput = {
  name: string;
  email: string;
  tier: SubscriptionTier;
  primaryKey: string;
  chosenPath: "core-first" | "song-first";
  shortTermGoal: string;
  mediumTermGoal: string;
  longTermGoal: string;
  focusAreas: DomainArea[];
};

export type PracticeLogInput = {
  exerciseKey: string;
  level: number;
  area: DomainArea;
  bpm: number;
  confidence: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  notes: string;
};

export const CORE_DOMAIN_AREAS: DomainArea[] = [
  "fretboard",
  "rhythm",
  "theory",
  "technique",
  "harmony",
  "bag-of-tricks"
];

export function createDefaultStudentProfile(): StudentProfile {
  return {
    id: "student-demo",
    name: "Student",
    email: "student@guitarmalade.local",
    tier: "free",
    currentLevel: 1,
    primaryKey: "A major",
    chosenPath: "core-first",
    goals: [
      { horizon: "short", title: "Improve note location confidence." },
      { horizon: "medium", title: "Complete level 1 rhythm and theory checkpoints." },
      { horizon: "long", title: "Improvise musically and perform with others." }
    ],
    focusAreas: ["fretboard", "rhythm", "theory"],
    streak: 4
  };
}

export function createStudentProfile(input: OnboardingInput): StudentProfile {
  return {
    id: "student-demo",
    name: input.name,
    email: input.email,
    tier: input.tier,
    currentLevel: 1,
    primaryKey: input.primaryKey,
    chosenPath: input.chosenPath,
    focusAreas: input.focusAreas,
    streak: 1,
    goals: [
      { horizon: "short", title: input.shortTermGoal },
      { horizon: "medium", title: input.mediumTermGoal },
      { horizon: "long", title: input.longTermGoal }
    ]
  };
}

export function createPracticeLog(input: PracticeLogInput): PracticeLog {
  return {
    id: `practice-${Date.now()}`,
    ...input,
    submittedAt: new Date().toISOString()
  };
}

export function getUnlockedLevelForTier(tier: SubscriptionTier): number {
  return tier === "paid" ? 5 : 1;
}

export function canAccessLevel(tier: SubscriptionTier, targetLevel: number) {
  return targetLevel <= getUnlockedLevelForTier(tier);
}

export function buildDashboardSummary(student: StudentProfile, logs: PracticeLog[]): DashboardSummary {
  const weeklyMinutes = logs.reduce((total, log) => total + log.durationMin, 0);
  const averageConfidence = logs.length
    ? Number((logs.reduce((total, log) => total + log.confidence, 0) / logs.length).toFixed(1))
    : 0;

  return {
    student,
    weeklyMinutes,
    averageConfidence,
    completedSessions: logs.length,
    nextRecommendedFocus: `Stay in ${student.primaryKey} and tighten ${
      student.focusAreas[0] ?? "fretboard"
    } before the next checkpoint.`,
    nextCheckpoint: "Complete every level 1 area at least once with confidence 4 or higher.",
    unlockedLevel: getUnlockedLevelForTier(student.tier),
    accessMessage:
      student.tier === "paid"
        ? "Full curriculum access is available."
        : "Free access includes level 1 and selected Bag O' Tricks preview material."
  };
}

export function summarizePractice(logs: PracticeLog[]) {
  const latest = logs[0];

  if (!latest) {
    return "No practice sessions logged yet.";
  }

  return `${logs.length} sessions logged, latest tempo ${latest.bpm} BPM, latest confidence ${latest.confidence}/5.`;
}
