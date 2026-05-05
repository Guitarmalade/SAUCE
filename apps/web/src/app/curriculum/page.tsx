import { CORE_AREAS, LEVEL_ONE_EXERCISES, SAMPLE_EXERCISES } from "@sauce/curriculum";

export default function CurriculumPage() {
  return (
    <main>
      <div className="shell">
        <span className="eyebrow">Curriculum browser</span>
        <h1 className="headline" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
          Structured, sequential, musical.
        </h1>
        <div className="grid">
          {CORE_AREAS.map((area) => (
            <article className="card" key={area.id}>
              <span className="status">{area.pillar}</span>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
              <p>Sample exercise: {SAMPLE_EXERCISES[area.id]}</p>
            </article>
          ))}
        </div>
        <h2 className="section-title">Level 1 roadmap</h2>
        <div className="grid">
          {LEVEL_ONE_EXERCISES.map((exercise) => (
            <article className="card" key={exercise.key}>
              <span className="status">
                Level {exercise.level} • {exercise.saucePhase}
              </span>
              <h3>{exercise.title}</h3>
              <p>{exercise.summary}</p>
              <p>Target BPM: {exercise.targetBpm}</p>
              <p>Access: {exercise.freePreview ? "Free preview" : "Paid"}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
