'use client'

import React, { useState } from 'react'
import { logPractice } from './actions'
import { Flame, Send, Check } from 'lucide-react'
import { usePracticeTimer } from '@/context/PracticeTimerContext'
import { Splat } from '@/components/ui/Splats'

export default function LogKitchen() {
  const { elapsedSeconds, subject, stopTimer } = usePracticeTimer()
  
  const [duration, setDuration] = useState(Math.max(1, Math.floor(elapsedSeconds / 60)))
  const [focus, setFocus] = useState(subject || "")
  const [feel, setFeel] = useState(4)
  const [stage, setStage] = useState("S2")
  const [saved, setSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stages = ["S", "A", "U", "C", "E"]
  const stageMap: Record<string, string> = { "S": "Study (Steal)", "A": "Assimilate", "U": "Utilize", "C": "Compose", "E": "Elevate" }
  const feelEmoji = ["😤","😐","🙂","😎","🔥"]
  const feelLabel = ["Rough","OK","Good","Great","On fire"]

  const submit = async () => {
    if (!focus) return
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append('date', new Date().toISOString().split('T')[0] || '')
    formData.append('duration_minutes', duration.toString())
    formData.append('what_practiced', focus)
    formData.append('sauce_stage', stageMap[stage] || stage)
    formData.append('feel_rating', feel.toString())

    const result = await logPractice(formData)
    
    setIsSubmitting(false)
    if (!result?.error) {
      setSaved(true)
      stopTimer()
      setTimeout(() => {
        setSaved(false)
        setFocus('')
        setDuration(1)
      }, 3000)
    }
  }

  return (
    <div className="relative p-7 rounded-[28px] border-2 border-[#d8e2ef] bg-white/95 shadow-[0_24px_60px_rgba(32,51,89,0.08)]">
      <div className="absolute -top-8 -right-5 opacity-25 pointer-events-none">
        <Splat.Drip color="var(--marmalade)" size={140} rotate={180} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-[var(--marmalade)] flex items-center justify-center text-[var(--ink)] shadow-[3px_3px_0_var(--punch)]">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <div className="label-eyebrow">Just finished?</div>
          <h3 className="drip-text text-[28px] leading-none text-[var(--ink)] mt-1">Log Your Kitchen</h3>
        </div>
      </div>

      {/* duration big slider */}
      <div className="mt-6">
        <div className="flex justify-between items-baseline">
          <div className="label-eyebrow">Time in the kitchen</div>
          <div>
            <span className="drip-text text-[38px] text-[var(--punch)]">{duration}</span>
            <span className="text-[13px] font-bold text-[var(--ink-mid)] ml-1">min</span>
          </div>
        </div>
        <input 
          type="range" min="1" max="120" 
          value={duration} 
          onChange={e => setDuration(+e.target.value)}
          className="w-full mt-2 accent-[var(--marmalade)]"
        />
      </div>

      {/* what'd you cook */}
      <div className="mt-4">
        <div className="label-eyebrow mb-2">What'd you cook?</div>
        <input 
          value={focus} 
          onChange={e => setFocus(e.target.value)} 
          placeholder="12-bar blues, hammer-ons, ear training..."
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--cream-shadow)] bg-[var(--cream)] text-[14px] font-bold text-[var(--ink)] outline-none focus:border-[var(--marmalade)] transition-colors"
        />
      </div>

      {/* sauce stage */}
      <div className="mt-4">
        <div className="label-eyebrow mb-2">S.A.U.C.E. stage</div>
        <div className="grid grid-cols-5 gap-1.5">
          {stages.map(s => (
            <button 
              key={s} 
              onClick={() => setStage(s)} 
              className={`
                py-2.5 rounded-xl font-paint text-[22px] transition-all
                ${stage === s 
                  ? 'border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--marmalade)] shadow-[3px_3px_0_var(--marmalade)] -translate-y-0.5' 
                  : 'border-2 border-[var(--cream-shadow)] bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--cream-warm)]'
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* feel */}
      <div className="mt-4">
        <div className="label-eyebrow mb-2">How'd it feel?</div>
        <div className="flex gap-1.5 justify-between">
          {feelEmoji.map((e, i) => (
            <button 
              key={i} 
              onClick={() => setFeel(i+1)} 
              className={`
                flex-1 py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all
                ${feel === i + 1 
                  ? 'border-2 border-[var(--punch)] bg-[rgba(230,54,120,.12)] -translate-y-0.5' 
                  : 'border-2 border-[var(--cream-shadow)] bg-[var(--cream)] hover:bg-[var(--cream-warm)]'
                }
              `}
            >
              <div className="text-[22px]">{e}</div>
              <div className={`text-[9px] font-extrabold tracking-[.06em] uppercase ${feel === i + 1 ? 'text-[var(--punch)]' : 'text-[var(--ink-mid)]'}`}>
                {feelLabel[i]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={submit}
          disabled={isSubmitting || !focus}
          className={`
            w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold tracking-wider uppercase transition-all
            ${saved 
              ? 'bg-[var(--marmalade)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]' 
              : 'bg-gradient-to-b from-[#4e86ff] to-[var(--blue)] text-white border-2 border-[var(--blue)] shadow-[0_18px_34px_rgba(63,116,248,0.2)] hover:-translate-y-0.5'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {saved ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          {saved ? "Saved! +50 XP" : isSubmitting ? "Plating..." : "Plate it up"}
        </button>
      </div>
    </div>
  )
}
