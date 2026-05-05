import Link from "next/link";
import {
  buildDashboardSummary,
  createDefaultStudentProfile,
  summarizePractice,
  type PracticeLog,
} from "@sauce/domain";
import { LEVEL_ONE_EXERCISES } from "@sauce/curriculum";

export default function DashboardPage() {
  const recentLogs: PracticeLog[] = [];
  const dashboard = buildDashboardSummary(
    createDefaultStudentProfile(),
    recentLogs,
  );
  const upcoming = LEVEL_ONE_EXERCISES.slice(0, 3);

  return (
    <main className="claude-page">
      <div className="shell claude-shell">
        <section className="claude-hero-bar claude-hero-bar-compact">
          <div className="claude-page-heading">
            <div className="claude-back-pill" aria-hidden="true">
              ⌂
            </div>
            <div>
              <h1 className="claude-main-title">Dashboard</h1>
              <p className="claude-subtitle">
                Keep the streak alive and move the method forward.
              </p>
            </div>
          </div>

          <div className="claude-chip-group">
            <span className="claude-info-chip">
              Level {dashboard.student.currentLevel}
            </span>
            <span className="claude-info-chip">
              {dashboard.student.streak} day streak
            </span>
            <span className="claude-info-chip">{dashboard.student.tier}</span>
          </div>
        </section>

        <section className="claude-content-grid">
          <div className="claude-main-column">
            <article className="claude-panel claude-panel-featured">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">⌂</span>
                <h2>Today&apos;s Recipe</h2>
              </div>
              <p className="claude-panel-copy">
                {dashboard.nextRecommendedFocus}
              </p>
              <div className="claude-stack-rows">
                {upcoming.map((exercise) => (
                  <div className="claude-list-line" key={exercise.key}>
                    <strong>{exercise.title}</strong>
                    <span>
                      {exercise.saucePhase} • {exercise.targetBpm} BPM
                    </span>
                  </div>
                ))}
              </div>
              <div className="claude-action-row">
                <Link className="claude-primary-button" href="/practice">
                  Start practice
                </Link>
                <Link className="claude-secondary-button" href="/curriculum">
                  Open curriculum
                </Link>
              </div>
            </article>

            <article className="claude-panel">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">◎</span>
                <h2>Goal Stack</h2>
              </div>
              <div className="claude-stack-rows">
                {dashboard.student.goals.map((goal) => (
                  <div className="claude-list-line" key={goal.horizon}>
                    <strong>{goal.horizon} term</strong>
                    <span>{goal.title}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="claude-side-column">
            <article className="claude-panel">
              <div className="claude-small-heading">Profile Snapshot</div>
              <div className="claude-mini-stat-grid">
                <div className="claude-mini-stat">
                  <strong>{dashboard.student.name}</strong>
                  <span>student</span>
                </div>
                <div className="claude-mini-stat">
                  <strong>{dashboard.unlockedLevel}</strong>
                  <span>highest unlocked</span>
                </div>
                <div className="claude-mini-stat">
                  <strong>{dashboard.weeklyMinutes}</strong>
                  <span>weekly minutes</span>
                </div>
                <div className="claude-mini-stat">
                  <strong>{dashboard.completedSessions}</strong>
                  <span>sessions logged</span>
                </div>
              </div>
            </article>

            <article className="claude-tip-panel claude-tip-panel-cool">
              <h2>Current Focus</h2>
              <p>{dashboard.nextCheckpoint}</p>
            </article>

            <article className="claude-panel">
              <div className="claude-small-heading">Access</div>
              <p className="claude-panel-copy">{dashboard.accessMessage}</p>
              <div className="claude-small-heading">Practice Snapshot</div>
              <p className="claude-panel-copy">
                {summarizePractice(recentLogs)}
              </p>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
