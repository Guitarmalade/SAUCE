import Link from "next/link";
import { LEVEL_ONE_EXERCISES } from "@sauce/curriculum";

const checklist = [
  "Internalize tempo",
  "Pocket and feel",
  "Intentional ending",
  "Melodic repetition",
];

const improvGoals = [
  {
    name: "Cycling Licks",
    detail: "Repetitive, high-energy patterns.",
  },
  {
    name: "Turnaround Licks",
    detail: "Nailing the landing of the form.",
  },
  {
    name: "Unison Bends",
    detail: "Classic blues screaming sustain.",
  },
];

export default function HomePage() {
  const feature = LEVEL_ONE_EXERCISES[1] ?? LEVEL_ONE_EXERCISES[0];

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
              <p className="claude-subtitle">Focus on pocket and resolution.</p>
            </div>
          </div>

          <div className="claude-timer-pod">
            <div className="claude-timer-icon">◔</div>
            <div className="claude-timer-value">0:00</div>
            <Link className="claude-primary-button" href="/practice">
              Start
            </Link>
          </div>
        </section>

        <section className="claude-content-grid">
          <div className="claude-main-column">
            <article className="claude-panel claude-panel-featured">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">♫</span>
                <h2>Rhythm Anchor: Blues 1.5 w/ Turnaround</h2>
              </div>
              <div className="claude-media-card">
                <div className="claude-media-play">▶</div>
                <p>Click to view sheet music:</p>
                <strong>{feature?.title ?? "12 bar blues shuffle 2"}</strong>
                <em>
                  Maintain a consistent triplet feel and don&apos;t rush the
                  turnaround.
                </em>
              </div>
            </article>

            <article className="claude-panel">
              <div className="claude-panel-heading">
                <span className="claude-panel-icon">◎</span>
                <h2>Improvisation Goals</h2>
              </div>
              <div className="claude-goal-list">
                {improvGoals.map((goal, index) => (
                  <div className="claude-goal-row" key={goal.name}>
                    <div className="claude-goal-index">{index + 1}</div>
                    <div className="claude-goal-copy">
                      <strong>{goal.name}</strong>
                      <span>{goal.detail}</span>
                      <Link className="claude-inline-link" href="/curriculum">
                        View reference file
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="claude-side-column">
            <article className="claude-tip-panel">
              <h2>BBQ Pro Tip</h2>
              <p>
                A dominant chord can be reduced to the color tones. Isolate the
                third, fifth, and flat seventh, then use that sound to push
                outside and resolve cleanly.
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
              <div className="claude-small-heading">Open the app</div>
              <div className="claude-route-stack">
                <Link className="claude-route-link" href="/dashboard">
                  Open dashboard
                </Link>
                <Link className="claude-route-link" href="/practice">
                  Open my shed
                </Link>
                <Link className="claude-route-link" href="/onboarding">
                  Start onboarding
                </Link>
              </div>
            </article>

            <Link className="claude-complete-button" href="/dashboard">
              Session Complete
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
