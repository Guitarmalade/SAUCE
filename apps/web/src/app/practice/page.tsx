import Link from "next/link";
import { LEVEL_ONE_EXERCISES } from "@sauce/curriculum";
import { PracticeLogForm } from "../../components/practice-log-form";

export default function PracticePage() {
  const session = LEVEL_ONE_EXERCISES[0];
  const checklist = [
    "Internalize tempo",
    "Pocket and feel",
    "Intentional ending",
    "Melodic repetition",
  ];

  if (!session) {
    return (
      <main className="claude-page">
        <div className="shell claude-shell">
          <section className="claude-hero-bar claude-hero-bar-compact">
            <div className="claude-page-heading">
              <div className="claude-back-pill" aria-hidden="true">
                ←
              </div>
              <div>
                <h1 className="claude-main-title">Practice</h1>
                <p className="claude-subtitle">Practice content is loading.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="claude-page">
      <div className="shell claude-shell">
        <section className="claude-hero-bar">
          <div className="claude-page-heading">
            <div className="claude-back-pill" aria-hidden="true">
              ←
            </div>
            <div>
              <h1 className="claude-main-title">Now Sizzling...</h1>
              <p className="claude-subtitle">
                {session.title} · {session.summary}
              </p>
            </div>
          </div>

          <div className="claude-timer-pod">
            <div className="claude-timer-icon">◔</div>
            <div className="claude-timer-value">0:00</div>
            <button className="claude-primary-button" type="button">
              Start
            </button>
          </div>
        </section>

        <section className="claude-content-grid">
          <div className="claude-main-column">
            <article className="claude-panel claude-panel-featured">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">♫</span>
                <h2>{session.title}</h2>
              </div>
              <div className="claude-chip-group">
                <span className="claude-info-chip">{session.saucePhase}</span>
                <span className="claude-info-chip">
                  {session.targetBpm} BPM
                </span>
                <span className="claude-info-chip">
                  {session.freePreview ? "Free preview" : "Paid access"}
                </span>
              </div>
              <div className="claude-media-card">
                <div className="claude-media-play">▶</div>
                <p>Click to view sheet music:</p>
                <strong>{session.title}</strong>
                <em>{session.summary}</em>
              </div>
            </article>

            <article className="claude-panel">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">◎</span>
                <h2>Improvisation Goals</h2>
              </div>
              <div className="claude-stack-rows">
                {session.instructions.map((instruction) => (
                  <div className="claude-list-line" key={instruction}>
                    <strong>Step</strong>
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="claude-side-column">
            <article className="claude-tip-panel">
              <h2>BBQ Pro Tip</h2>
              <p>
                Advance only when the articulation stays clean. The groove
                matters more than the speed number.
              </p>
            </article>

            <article className="claude-panel">
              <div className="claude-small-heading">Practice Checklist</div>
              <div className="claude-checklist">
                {checklist.map((item) => (
                  <div className="claude-check-row" key={item}>
                    <span className="claude-check-box" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="claude-panel">
              <div className="claude-small-heading">Progression Guardrail</div>
              <p className="claude-panel-copy">
                Advance only when completion and confidence trend in the right
                direction.
              </p>
              <div className="claude-mini-stat-grid">
                <div className="claude-mini-stat">
                  <strong>{session.targetBpm}</strong>
                  <span>clean BPM target</span>
                </div>
                <div className="claude-mini-stat">
                  <strong>{session.level}</strong>
                  <span>current level gate</span>
                </div>
              </div>
            </article>

            <Link className="claude-complete-button" href="/dashboard">
              Session Complete
            </Link>
          </aside>
        </section>

        <section className="claude-form-shell">
          <div className="claude-form-header">
            <div>
              <div className="claude-small-heading">Practice Log</div>
              <h2 className="claude-form-title">
                Capture the session before you move on.
              </h2>
            </div>
            <div className="claude-chip-group">
              <span className="claude-info-chip">
                {session.freePreview ? "Free preview" : "Paid access"}
              </span>
              <Link className="claude-secondary-button" href="/curriculum">
                Browse lessons
              </Link>
            </div>
          </div>
          <PracticeLogForm />
        </section>
      </div>
    </main>
  );
}
