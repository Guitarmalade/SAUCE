'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import AlphaTabPlayer from '@/components/AlphaTabPlayer'
import { Splat } from '@/components/ui/Splats'

const SKILL_COLORS: Record<string, string> = {
  blues: "var(--marmalade)", rock: "var(--punch)", theory: "var(--grape)",
  ear: "var(--acid)", songwriting: "var(--cyan)", rhythm: "var(--punch)",
}

const SECTION_TIPS = [
  "The classic shuffle. Down-up alternate picking, palm-mute lightly. Lock with the metronome on beats 2 and 4.",
  "The IV chord. Same shuffle pattern but on the A string root. Watch your wrist — don't tighten up.",
  "Back to the I. Listen for the resolution. This is the easy section — internalize the groove.",
  "The turnaround. V chord (B7) for one bar, drop down to IV (A7) for the next. The most distinctive moment.",
  "Bring it home. Last two bars resolve back to E7. Add a fill or a single-note line if you're feeling it.",
];

export default function KitchenClient({ exercise }: { exercise: any }) {
  const skill = SKILL_COLORS[exercise.skill || 'blues'] || "var(--marmalade)"

  const subSteps = [
    { i: 1, title: "Shuffle on E7", bars: "1–4",   state: "done" },
    { i: 2, title: "IV change (A7)", bars: "5–6",  state: "done" },
    { i: 3, title: "Back home (E7)", bars: "7–8",  state: "current" },
    { i: 4, title: "V → IV turnaround", bars: "9–10", state: "next" },
    { i: 5, title: "Bring it home",     bars: "11–12", state: "locked" },
  ]

  const [activeStep, setActiveStep] = useState(2)
  const [timerRunning, setTimerRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [timerRunning])

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")

  return (
    <main className="shell workspace relative z-10">
      
      <section className="hero-bar">
        <div className="hero-title">
          <Link href="/student/dashboard" className="back-pill hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="drip-text text-[var(--ink)]">Now Sizzling...</h1>
            <p className="panel-copy">{exercise.title.split(" in ")[0]} <span style={{ color: skill }}>in E</span> · Keep the groove locked.</p>
          </div>
        </div>

        <div className="timer-pod border-[3px] border-[var(--ink)]">
          <div className="timer-icon"><Play className="w-8 h-8" style={{ color: skill }}/></div>
          <div className="timer-value text-[var(--cream-warm)]">
            {mm}<span style={{ color: skill }}>:</span>{ss}
          </div>
          <button 
            onClick={() => setTimerRunning(t => !t)}
            className="button button-primary ml-4"
            style={{ background: timerRunning ? 'var(--punch)' : skill, color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)" }}
          >
            {timerRunning ? "Pause" : "Start"}
          </button>
        </div>
      </section>

      <section className="content-grid">
        <div className="column">
          
          <article className="panel featured">
            <div className="panel-heading">
              <span className="panel-icon bg-[var(--ink)] text-[var(--cream-warm)] border-2 border-[var(--ink)]">♫</span>
              <h2 className="drip-text text-[var(--ink)]">{exercise.title.split(" in ")[0]}</h2>
            </div>
            
            <div className="chip-row mb-6">
              <span className="chip text-[var(--blue-deep)]">{exercise.stageName || 'Assimilate'}</span>
              <span className="chip">{exercise.bpm || 90} BPM</span>
              <span className="chip">Free preview</span>
            </div>
            
            {exercise.tab_url && (
              <div className="media-card !p-2 !border-[3px] !border-solid !border-[var(--ink)] !bg-[var(--cream-warm)]">
                <AlphaTabPlayer fileUrl={exercise.tab_url} />
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-heading">
              <span className="panel-icon border-2 border-[var(--ink)]" style={{ color: skill }}>◎</span>
              <h2 className="drip-text text-[var(--ink)]">Recipe Path</h2>
            </div>
            <p className="panel-copy mb-6">Master the progression section by section. Complete sections unlock the next phase.</p>
            
            {/* Horizontal path */}
            <div className="relative grid grid-cols-5 gap-0 items-start pt-3 pb-2">
              <div className="absolute top-[36px] left-[10%] right-[10%] h-1.5 rounded-full z-0" 
                  style={{ background: 'repeating-linear-gradient(90deg, var(--cream-shadow) 0 8px, transparent 8px 16px)' }} />
              
              <div className="absolute top-[36px] left-[10%] h-1.5 rounded-full z-10 transition-all duration-500"
                  style={{ width: `${(100 / subSteps.length) * 2}%`, background: skill }} />

              {subSteps.map((s, i) => {
                const active = i === activeStep
                const stateColors = {
                  done: { bg: skill, fg: "var(--ink)", ring: "var(--ink)" },
                  current: { bg: "var(--ink)", fg: skill, ring: skill },
                  next: { bg: "var(--cream-warm)", fg: skill, ring: skill },
                  locked: { bg: "var(--cream-shadow)", fg: "var(--ink-faint)", ring: "var(--ink-faint)" },
                }[s.state] || { bg: "var(--cream-shadow)", fg: "var(--ink-faint)", ring: "var(--ink-faint)" }

                return (
                  <button 
                    key={s.i} 
                    onClick={() => s.state !== "locked" && setActiveStep(i)}
                    disabled={s.state === "locked"}
                    className={`relative z-20 flex flex-col items-center gap-1.5 transition-all ${s.state === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div 
                      className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-paint text-[26px] transition-all duration-300"
                      style={{
                        background: stateColors.bg, color: stateColors.fg,
                        border: `3px ${s.state === "locked" ? "dashed" : "solid"} ${stateColors.ring}`,
                        boxShadow: active ? `0 0 0 4px ${skill}33, 4px 4px 0 ${skill}` : "none",
                        transform: active ? "translateY(-2px) scale(1.04)" : "none",
                      }}
                    >
                      {s.state === "done" ? "✓" : s.state === "locked" ? "🔒" : s.i}
                    </div>
                    <div className="text-center max-w-[100px] md:max-w-[130px]">
                      <div className="text-[9px] font-extrabold tracking-[.18em] uppercase text-[var(--marmalade)]">BARS {s.bars}</div>
                      <div className="mt-0.5 text-[12px] md:text-[13px] font-extrabold text-[var(--ink)] leading-tight">{s.title}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-8 p-5 rounded-[var(--r-lg)] bg-[var(--bg-accent)] border-2 border-[var(--blue-deep)] opacity-90 relative overflow-hidden">
              <Splat.Specks color="var(--blue-deep)" size={80} seed={9} className="absolute bottom-1 right-2 opacity-15 pointer-events-none"/>
              <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--blue-deep)]">Focus on Section #{activeStep + 1}</div>
              <h4 className="drip-text text-[22px] text-[var(--ink)] mt-1">{subSteps[activeStep]?.title}</h4>
              <p className="mt-2 text-[13px] text-[var(--ink)] font-medium leading-relaxed">
                {SECTION_TIPS[activeStep] || "Hit the changes cleanly. Eyes off the fretboard once you trust the shape."}
              </p>
            </div>
          </article>
        </div>

        <aside className="column">
          <article className="tip-panel cool">
            <h2 className="drip-text text-[var(--blue-deep)]">BBQ Pro Tip</h2>
            <p className="text-[var(--ink)]">Advance only when the articulation stays clean. The groove matters more than the speed number.</p>
          </article>

          <article className="panel">
            <div className="section-label">Practice Checklist</div>
            <div className="checklist">
              <div className="check-row"><div className="check-box bg-[var(--acid)] border-[var(--ink)] flex items-center justify-center text-xs font-bold text-[var(--ink)]">✓</div><span>Internalize tempo</span></div>
              <div className="check-row"><div className="check-box border-[var(--line-strong)]"></div><span>Pocket and feel</span></div>
              <div className="check-row"><div className="check-box border-[var(--line-strong)]"></div><span>Intentional ending</span></div>
              <div className="check-row"><div className="check-box border-[var(--line-strong)]"></div><span>Melodic repetition</span></div>
            </div>
          </article>

          <article className="panel">
            <div className="section-label">Progression Guardrail</div>
            <p className="panel-copy">Advance only when completion and confidence trend in the right direction.</p>
            <div className="mini-stat-grid mt-6">
              <div className="mini-stat"><strong className="num-display">80</strong><span>clean BPM target</span></div>
              <div className="mini-stat"><strong className="num-display">1</strong><span>current level gate</span></div>
            </div>
          </article>

          <button className="button button-outline-strong mt-2">Session Complete</button>
        </aside>
      </section>

      <section className="form-shell" id="log">
        <div className="form-header">
          <div>
            <div className="section-label">Practice Log</div>
            <h2 className="drip-text text-[var(--ink)] text-[32px]">Capture the session before you move on.</h2>
          </div>
          <div className="chip-row">
            <span className="chip">Free preview</span>
            <Link className="button button-secondary" href="/student/dashboard">Browse lessons</Link>
          </div>
        </div>

        <form>
          <div className="form-grid">
            <label className="field">
              <span>Exercise</span>
              <select defaultValue="12-Bar Blues">
                <option>A major note map</option>
                <option>Quarter-note grid</option>
                <option>12-Bar Blues</option>
              </select>
            </label>
            <label className="field">
              <span>BPM reached cleanly</span>
              <input type="number" defaultValue="80" />
            </label>
            <label className="field">
              <span>Confidence</span>
              <select defaultValue="4">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </label>
            <label className="field">
              <span>Minutes practiced</span>
              <input type="number" defaultValue={Math.floor(seconds/60)} readOnly />
            </label>
          </div>

          <label className="field mt-6">
            <span>Notes</span>
            <textarea defaultValue="Felt comfortable until the turnaround section. Need to drill bars 9-10 more slowly next time." />
          </label>

          <div className="flex gap-4 mt-8 items-center">
            <button className="button button-primary" type="button">Save practice log</button>
            <p className="form-status text-[13px]">Form state updates automatically based on timer.</p>
          </div>
        </form>
      </section>

    </main>
  )
}
