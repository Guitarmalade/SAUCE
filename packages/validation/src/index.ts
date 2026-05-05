import type { DomainArea, OnboardingInput, PracticeLogInput, SubscriptionTier } from "@sauce/domain";

export type PracticeEntryInput = {
  exerciseKey: string;
  bpm?: number;
  confidence?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export function validatePracticeEntry(input: PracticeEntryInput) {
  if (!input.exerciseKey.trim()) {
    throw new Error("exerciseKey is required");
  }

  if (input.confidence && (input.confidence < 1 || input.confidence > 5)) {
    throw new Error("confidence must be between 1 and 5");
  }

  return input;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function validateOnboardingInput(input: unknown): OnboardingInput {
  const payload = (input ?? {}) as Record<string, unknown>;
  const tier = asString(payload.tier) as SubscriptionTier;
  const chosenPath = asString(payload.chosenPath) as OnboardingInput["chosenPath"];
  const focusAreas = asStringArray(payload.focusAreas) as DomainArea[];

  const parsed: OnboardingInput = {
    name: asString(payload.name),
    email: asString(payload.email),
    tier: tier === "paid" ? "paid" : "free",
    primaryKey: asString(payload.primaryKey),
    chosenPath: chosenPath === "song-first" ? "song-first" : "core-first",
    shortTermGoal: asString(payload.shortTermGoal),
    mediumTermGoal: asString(payload.mediumTermGoal),
    longTermGoal: asString(payload.longTermGoal),
    focusAreas
  };

  if (!parsed.name || !parsed.email || !parsed.primaryKey) {
    throw new Error("name, email, and primaryKey are required");
  }

  if (parsed.focusAreas.length === 0) {
    throw new Error("At least one focus area is required");
  }

  return parsed;
}

export function validatePracticeLogInput(input: unknown): PracticeLogInput {
  const payload = (input ?? {}) as Record<string, unknown>;
  const confidence = Number(payload.confidence);

  const parsed: PracticeLogInput = {
    exerciseKey: asString(payload.exerciseKey),
    level: Number(payload.level ?? 1),
    area: asString(payload.area) as DomainArea,
    bpm: Number(payload.bpm ?? 0),
    confidence: Math.max(1, Math.min(5, confidence || 1)) as PracticeLogInput["confidence"],
    durationMin: Number(payload.durationMin ?? 0),
    notes: asString(payload.notes)
  };

  if (!parsed.exerciseKey || !parsed.area || !parsed.bpm || !parsed.durationMin) {
    throw new Error("exerciseKey, area, bpm, and durationMin are required");
  }

  return parsed;
}
