import type { GoalHorizon, OnboardingInput, PracticeLog, PracticeLogInput, StudentProfile } from "@sauce/domain";
import { buildDashboardSummary, createPracticeLog, createStudentProfile } from "@sauce/domain";
import { createPrismaClient } from "./client";

function toStudentProfile(record: {
  id: string;
  currentLevel: number;
  streak: number;
  primaryKey: string;
  chosenPath: string;
  focusAreas: string[];
  user: { name: string | null; email: string; subscription: "FREE" | "PAID" };
  goals: { horizon: string; title: string }[];
}): StudentProfile {
  return {
    id: record.id,
    name: record.user.name ?? "Student",
    email: record.user.email,
    tier: record.user.subscription === "PAID" ? "paid" : "free",
    currentLevel: record.currentLevel,
    primaryKey: record.primaryKey,
    chosenPath: record.chosenPath === "song-first" ? "song-first" : "core-first",
    focusAreas: record.focusAreas as StudentProfile["focusAreas"],
    streak: record.streak,
    goals: record.goals.map((goal) => ({
      horizon: goal.horizon as GoalHorizon,
      title: goal.title
    }))
  };
}

export async function loadStudentProfile(): Promise<StudentProfile | null> {
  const prisma = createPrismaClient();
  const profile = await prisma.studentProfile.findFirst({
    include: {
      user: true,
      goals: true
    },
    orderBy: {
      id: "asc"
    }
  });

  return profile ? toStudentProfile(profile) : null;
}

export async function upsertStudentProfile(input: OnboardingInput): Promise<StudentProfile> {
  const prisma = createPrismaClient();
  const nextProfile = createStudentProfile(input);

  const user = await prisma.user.upsert({
    where: { email: nextProfile.email },
    update: {
      name: nextProfile.name,
      subscription: nextProfile.tier === "paid" ? "PAID" : "FREE"
    },
    create: {
      email: nextProfile.email,
      name: nextProfile.name,
      subscription: nextProfile.tier === "paid" ? "PAID" : "FREE"
    }
  });

  const profile = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {
      currentLevel: nextProfile.currentLevel,
      streak: nextProfile.streak,
      primaryKey: nextProfile.primaryKey,
      chosenPath: nextProfile.chosenPath,
      focusAreas: nextProfile.focusAreas
    },
    create: {
      userId: user.id,
      currentLevel: nextProfile.currentLevel,
      streak: nextProfile.streak,
      primaryKey: nextProfile.primaryKey,
      chosenPath: nextProfile.chosenPath,
      focusAreas: nextProfile.focusAreas
    }
  });

  await prisma.goal.deleteMany({
    where: { profileId: profile.id }
  });

  await prisma.goal.createMany({
    data: nextProfile.goals.map((goal) => ({
      profileId: profile.id,
      horizon: goal.horizon,
      title: goal.title
    }))
  });

  const hydrated = await prisma.studentProfile.findUniqueOrThrow({
    where: { id: profile.id },
    include: { user: true, goals: true }
  });

  return toStudentProfile(hydrated);
}

export async function createPracticeLogRecord(input: PracticeLogInput): Promise<PracticeLog> {
  const prisma = createPrismaClient();
  const profile = await prisma.studentProfile.findFirst({
    include: { user: true, goals: true },
    orderBy: { id: "asc" }
  });

  if (!profile) {
    throw new Error("Create a student profile before logging practice.");
  }

  const session = await prisma.practiceSession.create({
    data: {
      profileId: profile.id,
      area: input.area,
      level: input.level,
      durationSec: input.durationMin * 60,
      notes: input.notes,
      startedAt: new Date(),
      endedAt: new Date()
    }
  });

  const entry = await prisma.practiceEntry.create({
    data: {
      sessionId: session.id,
      exerciseKey: input.exerciseKey,
      bpm: input.bpm,
      confidence: input.confidence,
      notes: input.notes,
      durationMin: input.durationMin
    }
  });

  return {
    id: entry.id,
    exerciseKey: entry.exerciseKey,
    level: session.level,
    area: session.area as PracticeLog["area"],
    bpm: entry.bpm ?? input.bpm,
    confidence: (entry.confidence ?? input.confidence) as PracticeLog["confidence"],
    durationMin: entry.durationMin,
    notes: entry.notes ?? "",
    submittedAt: entry.submittedAt.toISOString()
  };
}

export async function listPracticeLogRecords(): Promise<PracticeLog[]> {
  const prisma = createPrismaClient();
  const entries = await prisma.practiceEntry.findMany({
    include: {
      session: true
    },
    orderBy: {
      submittedAt: "desc"
    },
    take: 20
  });

  return entries.map((entry) =>
    createPracticeLog({
      exerciseKey: entry.exerciseKey,
      level: entry.session.level,
      area: entry.session.area as PracticeLog["area"],
      bpm: entry.bpm ?? 0,
      confidence: (entry.confidence ?? 3) as PracticeLog["confidence"],
      durationMin: entry.durationMin,
      notes: entry.notes ?? ""
    })
  );
}

export async function buildPersistedDashboardSummary() {
  const student = await loadStudentProfile();
  if (!student) {
    return null;
  }

  const logs = await listPracticeLogRecords();
  return buildDashboardSummary(student, logs);
}

