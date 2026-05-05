import { OnboardingForm } from "../../components/onboarding-form";

export default function OnboardingPage() {
  return (
    <main>
      <div className="shell">
        <span className="eyebrow">Onboarding</span>
        <h1 className="headline" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
          Choose your goals, key center, and practice path.
        </h1>
        <div className="grid">
          <article className="card">
            <h3>Short-term goals</h3>
            <p>Examples: improve confidence, hit target BPM, clean up specific shapes.</p>
          </article>
          <article className="card">
            <h3>Medium-term goals</h3>
            <p>Examples: finish a level, internalize triads, build a usable Bag O&apos; Tricks set.</p>
          </article>
          <article className="card">
            <h3>Long-term goals</h3>
            <p>Examples: improvise fluently, complete the core system, play with others confidently.</p>
          </article>
        </div>
        <div style={{ marginTop: 24 }}>
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
