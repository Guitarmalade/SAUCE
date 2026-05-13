"use client";

import { useState } from "react";
import type { DomainArea, OnboardingInput } from "@sauce/domain";
import { postJson } from "../lib/api";

const focusOptions: { value: DomainArea; label: string }[] = [
  { value: "fretboard", label: "Fretboard awareness" },
  { value: "rhythm", label: "Rhythm" },
  { value: "theory", label: "Music theory" },
  { value: "technique", label: "Technique" },
  { value: "harmony", label: "Harmony" },
  { value: "bag-of-tricks", label: "Bag O' Tricks" }
];

export function OnboardingForm() {
  const [form, setForm] = useState<OnboardingInput>({
    name: "Chris",
    email: "chris@guitarmalade.com",
    tier: "free",
    primaryKey: "A major",
    chosenPath: "core-first",
    shortTermGoal: "Improve note location confidence.",
    mediumTermGoal: "Complete level 1 rhythm and theory checkpoints.",
    longTermGoal: "Improvise more musically and play with people regularly.",
    focusAreas: ["fretboard", "theory", "rhythm"]
  });
  const [status, setStatus] = useState("Save your student starting point to the API.");

  function toggleArea(area: DomainArea) {
    setForm((current: OnboardingInput) => {
      const exists = current.focusAreas.includes(area);
      return {
        ...current,
        focusAreas: exists
          ? current.focusAreas.filter((item: DomainArea) => item !== area)
          : [...current.focusAreas, area]
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving profile...");

    try {
      const saved = await postJson<OnboardingInput, { name: string; tier: string }>("/student/profile", form);
      setStatus(`Saved ${saved.name}'s profile. Access tier: ${saved.tier}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save profile.");
    }
  }

  return (
    <form className="stack-lg" onSubmit={handleSubmit}>
      <div className="grid grid-two">
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="field">
          <span>Primary key center</span>
          <input
            value={form.primaryKey}
            onChange={(event) => setForm({ ...form, primaryKey: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Access tier</span>
          <select value={form.tier} onChange={(event) => setForm({ ...form, tier: event.target.value as "free" | "paid" })}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      </div>

      <div className="grid grid-two">
        <label className="field">
          <span>Learning path</span>
          <select
            value={form.chosenPath}
            onChange={(event) =>
              setForm({ ...form, chosenPath: event.target.value as "core-first" | "song-first" })
            }
          >
            <option value="core-first">Core first</option>
            <option value="song-first">Song first</option>
          </select>
        </label>
      </div>

      <div className="grid grid-two">
        <label className="field">
          <span>Short-term goal</span>
          <textarea
            value={form.shortTermGoal}
            onChange={(event) => setForm({ ...form, shortTermGoal: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Medium-term goal</span>
          <textarea
            value={form.mediumTermGoal}
            onChange={(event) => setForm({ ...form, mediumTermGoal: event.target.value })}
          />
        </label>
      </div>

      <label className="field">
        <span>Long-term goal</span>
        <textarea
          value={form.longTermGoal}
          onChange={(event) => setForm({ ...form, longTermGoal: event.target.value })}
        />
      </label>

      <div className="stack-sm">
        <span className="field-label">Focus areas</span>
        <div className="chip-row">
          {focusOptions.map((option) => {
            const active = form.focusAreas.includes(option.value);
            return (
              <button
                key={option.value}
                className={`chip ${active ? "chip-active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  toggleArea(option.value);
                }}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="stack-sm">
        <button className="button button-primary" type="submit">
          Save onboarding profile
        </button>
        <p className="subtle">{status}</p>
      </div>
    </form>
  );
}

