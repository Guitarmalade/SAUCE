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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <Link href="/student/roadmap" className="w-12 h-12 rounded-2xl bg-[var(--cream-warm)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] text-[var(--ink)] flex items-center justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: skill }}/>
            <span className="text-[11px] font-extrabold tracking-[.18em] text-[var(--ink-mid)] uppercase">
              {exercise.skill || 'BLUES'} · STAGE {exercise.stage || 'A'} · {exercise.stageName || 'ASSIMILATE'}
            </span>
          </div>
          <h1 className="drip-text text-[48px] text-[var(--ink)] leading-none mt-1">
            {exercise.title.split(" in ")[0]} <span style={{ color: skill }}>in E</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="px-4 py-2 rounded-full bg-[var(--cream-warm)] border-2 border-[var(--cream-shadow)] font-extrabold text-[13px] text-[var(--ink)]">⏱ {exercise.minutes || 15} min</span>
          <span className="px-4 py-2 rounded-full bg-[var(--cream-warm)] border-2 border-[var(--cream-shadow)] font-extrabold text-[13px] text-[var(--ink)]">♪ {exercise.bpm || 90} BPM</span>
          <span className="px-4 py-2 rounded-full bg-[var(--punch)] text-[var(--cream-warm)] font-extrabold text-[13px]">+{exercise.xp || 150} XP</span>
        </div>
      </div>

      {/* Recipe path */}
      <div className="relative p-5 md:p-7 bg-[var(--cream-warm)] rounded-[var(--r-lg)] border-2 border-[var(--cream-shadow)] overflow-hidden">
        <Splat.Specks color={skill} size={120} seed={3} className="absolute top-2 right-3 opacity-30 pointer-events-none"/>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--marmalade)]">Recipe path</span>
            <h3 className="drip-text text-[22px] text-[var(--ink)] mt-0.5">5 sections · cook them in order</h3>
          </div>
          <div className="text-[12px] font-extrabold text-[var(--ink-mid)]">
            <span style={{ color: skill, fontFamily: "var(--font-paint)", fontSize: 22 }}>2</span> / 5 done
          </div>
        </div>

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
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Tab / Video */}
        <div className="lg:col-span-2">
          {exercise.video_url ? (
            <div className="bg-[var(--ink)] rounded-[var(--r-lg)] p-1 overflow-hidden border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] aspect-video relative group mb-6">
              <video controls className="w-full h-full object-cover rounded-xl" src={exercise.video_url} />
            </div>
          ) : null}

          {exercise.tab_url && (
            <div className="bg-[var(--cream-warm)] rounded-[var(--r-lg)] border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] overflow-hidden">
              <div className="p-4 flex items-center justify-between bg-[var(--ink)] border-b-4" style={{ borderColor: skill }}>
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">🎸</span>
                  <div>
                    <div className="text-[10px] font-extrabold tracking-[.16em] text-white/50">NOTATION</div>
                    <div className="drip-text text-[18px] text-[var(--cream-warm)] leading-none mt-0.5">Scrolling tab</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <AlphaTabPlayer fileUrl={exercise.tab_url} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Timer card */}
          <div className="relative rounded-[var(--r-xl)] bg-[var(--ink)] text-[var(--cream-warm)] p-6 border-[3px] border-[var(--ink)] overflow-hidden shadow-[var(--shadow-pop)]">
            <Splat.Burst color={skill} size={180} className="absolute -top-10 -right-8 opacity-20 pointer-events-none" rotate={45}/>
            
            <div className="relative z-10 text-[11px] font-extrabold uppercase tracking-[.12em]" style={{ color: skill }}>
              {timerRunning ? "🔥 You're cooking" : "Ready when you are"}
            </div>
            
            <div className="relative z-10 drip-text text-[78px] leading-[0.9] mt-2 text-[var(--cream-warm)]">
              {mm}<span style={{ color: skill }}>:</span>{ss}
            </div>
            
            <div className="relative z-10 flex gap-2 mt-4">
              <button 
                onClick={() => setTimerRunning(t => !t)}
                className="flex-1 py-3 px-4 rounded-xl border-none font-black text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: skill, color: "var(--ink)", boxShadow: "4px 4px 0 var(--punch)" }}
              >
                {timerRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                {timerRunning ? "Pause" : "Start"}
              </button>
              <button 
                className="py-3 px-4 rounded-xl bg-[var(--punch)] text-[var(--cream-warm)] border-none font-extrabold text-[13px] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ boxShadow: `4px 4px 0 ${skill}` }}
              >
                Done ✓
              </button>
            </div>
          </div>

          {/* Section details */}
          <div className="relative p-5 rounded-[var(--r-lg)] bg-[var(--cream-warm)] border-2 border-[var(--cream-shadow)] overflow-hidden">
            <Splat.Specks color={skill} size={80} seed={9} className="absolute bottom-1 right-2 opacity-30 pointer-events-none"/>
            <div className="text-[11px] font-extrabold uppercase tracking-[.12em]" style={{ color: skill }}>Section #{activeStep + 1}</div>
            <h4 className="drip-text text-[22px] text-[var(--ink)] mt-1">{subSteps[activeStep]?.title}</h4>
            <p className="mt-2 text-[13px] text-[var(--ink-soft)] font-medium leading-relaxed">
              {SECTION_TIPS[activeStep] || "Hit the changes cleanly. Eyes off the fretboard once you trust the shape."}
            </p>
          </div>
          
          {/* Hint */}
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--cream)] border-2 border-dashed border-[var(--ink-faint)]">
            <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--ink-mid)]">Need a hint?</div>
            <p className="mt-1.5 text-[13px] text-[var(--ink-mid)] font-medium leading-relaxed">
              Use the slow-mo + loop buttons in AlphaTab to drill any sloppy section. Each completed section earns +30 XP toward the recipe's {exercise.xp || 150}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
