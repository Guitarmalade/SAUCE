import {
  buildDashboardSummary,
  createDefaultStudentProfile,
  createPracticeLog,
  createStudentProfile,
  type DashboardSummary,
  type OnboardingInput,
  type PracticeLog,
  type PracticeLogInput,
  type StudentProfile
} from "@sauce/domain";
import {
  buildPersistedDashboardSummary,
  createPracticeLogRecord,
  listPracticeLogRecords,
  loadStudentProfile,
  upsertStudentProfile
} from "@sauce/database";

type MemoryStore = {
  student: StudentProfile;
  practiceLogs: PracticeLog[];
};

const memoryStore: MemoryStore = {
  student: createDefaultStudentProfile(),
  practiceLogs: []
};

async function withDatabaseFallback<T>(primary: () => Promise<T>, fallback: () => T | Promise<T>) {
  try {
    return await primary();
  } catch {
    return await fallback();
  }
}

export async function getStudentProfile() {
  return withDatabaseFallback(
    async () => (await loadStudentProfile()) ?? memoryStore.student,
    () => memoryStore.student
  );
}

export async function saveStudentProfile(input: OnboardingInput) {
  return withDatabaseFallback(
    () => upsertStudentProfile(input),
    () => {
      memoryStore.student = createStudentProfile(input);
      return memoryStore.student;
    }
  );
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return withDatabaseFallback(
    async () => (await buildPersistedDashboardSummary()) ?? buildDashboardSummary(memoryStore.student, memoryStore.practiceLogs),
    () => buildDashboardSummary(memoryStore.student, memoryStore.practiceLogs)
  );
}

export async function addPracticeLog(input: PracticeLogInput) {
  return withDatabaseFallback(
    () => createPracticeLogRecord(input),
    () => {
      const log = createPracticeLog(input);
      memoryStore.practiceLogs = [log, ...memoryStore.practiceLogs].slice(0, 20);
      return log;
    }
  );
}

export async function listPracticeLogs() {
  return withDatabaseFallback(
    () => listPracticeLogRecords(),
    () => memoryStore.practiceLogs
  );
}
