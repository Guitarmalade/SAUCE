"use client";

import { useMemo, useState } from "react";
import { LEVEL_ONE_EXERCISES, getExerciseByKey } from "@sauce/curriculum";
import type { PracticeLogInput } from "@sauce/domain";
import { postJson } from "../lib/api";

export function PracticeLogForm() {
  const defaultExerciseKey = LEVEL_ONE_EXERCISES[0]?.key ?? "";
  const [form, setForm] = useState<PracticeLogInput>({
    exerciseKey: defaultExerciseKey,
    level: 1,
    area: LEVEL_ONE_EXERCISES[0]?.areaId ?? "fretboard",
    bpm: LEVEL_ONE_EXERCISES[0]?.targetBpm ?? 80,
    confidence: 4,
    durationMin: 20,
    notes: "Felt comfortable until the string crossing.",
  });
  const [status, setStatus] = useState(
    "Submit a log to capture the work in the API.",
  );

  const selectedExercise = useMemo(
    () => getExerciseByKey(form.exerciseKey),
    [form.exerciseKey],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving practice log...");

    try {
      const saved = await postJson<
        PracticeLogInput,
        { bpm: number; confidence: number; id: string }
      >("/practice/logs", form);
      setStatus(
        `Saved practice log ${saved.id} at ${saved.bpm} BPM with confidence ${saved.confidence}/5.`,
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not save practice log.",
      );
    }
  }

  return (
    <form className="claude-practice-form stack-lg" onSubmit={handleSubmit}>
      <div className="grid grid-two claude-form-grid">
        <label className="field">
          <span>Exercise</span>
          <select
            value={form.exerciseKey}
            onChange={(event) => {
              const nextExercise = getExerciseByKey(event.target.value);
              if (!nextExercise) {
                return;
              }

              setForm({
                ...form,
                exerciseKey: nextExercise.key,
                area: nextExercise.areaId,
                level: nextExercise.level,
                bpm: nextExercise.targetBpm,
              });
            }}
          >
            {LEVEL_ONE_EXERCISES.map((exercise) => (
              <option key={exercise.key} value={exercise.key}>
                {exercise.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>BPM reached cleanly</span>
          <input
            min={40}
            step={1}
            type="number"
            value={form.bpm}
            onChange={(event) =>
              setForm({ ...form, bpm: Number(event.target.value) })
            }
          />
        </label>
        <label className="field">
          <span>Confidence</span>
          <select
            value={form.confidence}
            onChange={(event) =>
              setForm({
                ...form,
                confidence: Number(event.target.value) as 1 | 2 | 3 | 4 | 5,
              })
            }
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
        <label className="field">
          <span>Minutes practiced</span>
          <input
            min={5}
            step={5}
            type="number"
            value={form.durationMin}
            onChange={(event) =>
              setForm({ ...form, durationMin: Number(event.target.value) })
            }
          />
        </label>
      </div>

      {selectedExercise ? (
        <article className="claude-inline-panel">
          <span className="claude-inline-status">
            {selectedExercise.saucePhase}
          </span>
          <h3>{selectedExercise.title}</h3>
          <p>{selectedExercise.summary}</p>
          <ul className="plain-list">
            {selectedExercise.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </article>
      ) : null}

      <label className="field">
        <span>Notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
      </label>

      <div className="stack-sm">
        <button className="claude-primary-button" type="submit">
          Save practice log
        </button>
        <p className="claude-form-status">{status}</p>
      </div>
    </form>
  );
}
