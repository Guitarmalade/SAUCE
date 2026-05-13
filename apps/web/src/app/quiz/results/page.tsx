'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Guitar, Fingerprint, ArrowRight, Music, Activity } from 'lucide-react'
import { SplatBackdrop, Splat } from '@/components/ui/Splats'

const ELEMENTS = [
  { id: 'fretboard', label: 'Fretboard Awareness' },
  { id: 'rhythm', label: 'Rhythm' },
  { id: 'technique', label: 'Technique' },
  { id: 'theory', label: 'Music Theory' },
  { id: 'repertoire', label: 'Repertoire' },
]

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('avatar_data')
    if (saved) {
      setData(JSON.parse(saved))
    }
  }, [])

  const handleBuildRoadmap = () => {
    router.push('/student/dashboard')
  }

  if (!data) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <SplatBackdrop intensity="medium" palette="warm" />
      <div className="text-center relative z-10">
        <div className="w-16 h-16 border-4 border-[var(--marmalade)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="drip-text text-3xl text-[var(--ink)]">Analyzing DNA...</h2>
      </div>
    </div>
  )

  const { archetype, genre, currentStats, idealStats, selectedTricks } = data

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden pb-20 pt-10">
      
      <SplatBackdrop intensity="heavy" palette="warm" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16 relative">
          <Splat.Burst color="var(--punch)" size={200} seed={1} className="absolute -top-16 left-[50%] -translate-x-[50%] opacity-20 pointer-events-none" />
          
          <div className="inline-block p-4 rounded-[var(--r-md)] bg-[var(--cream-warm)] border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] rotate-3">
            <Fingerprint className="w-12 h-12 text-[var(--ink)]" />
          </div>
          
          <div>
            <h1 className="text-[14px] font-black uppercase tracking-[.25em] text-[var(--marmalade)] mb-2">Your Guitar DNA</h1>
            <h2 className="drip-text text-[64px] text-[var(--ink)] leading-none">
              {archetype}
            </h2>
            <p className="mt-4 text-xl font-bold text-[var(--ink-mid)] max-w-xl mx-auto">
              Your path to mastering <span className="text-[var(--cyan)]">{genre}</span> is clear. Here is your blueprint.
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Stats Column */}
          <div className="bg-[var(--cream-warm)] border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] rounded-[var(--r-lg)] p-8 relative overflow-hidden">
            <Splat.Specks color="var(--acid)" size={140} seed={2} className="absolute -bottom-10 -right-10 opacity-30 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-8 h-8 text-[var(--acid)]" />
              <h3 className="drip-text text-[32px] text-[var(--ink)] leading-none">The Gap</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              {ELEMENTS.map(el => {
                const current = currentStats[el.id] || 0
                const ideal = idealStats[el.id] || 0
                return (
                  <div key={el.id} className="space-y-3">
                    <div className="flex justify-between text-sm font-black text-[var(--ink)] uppercase tracking-wide">
                      <span>{el.label}</span>
                      <span className="text-[var(--acid)]">Gap: {ideal - current > 0 ? `+${ideal - current}` : 'Maxed'}</span>
                    </div>
                    
                    {/* Double Bar UI */}
                    <div className="h-4 bg-[var(--cream-shadow)] rounded-full overflow-hidden relative border-2 border-transparent">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[var(--punch)] transition-all duration-1000"
                        style={{ width: `${(ideal / 10) * 100}%` }}
                      />
                      <div 
                        className="absolute top-0 left-0 h-full bg-[var(--acid)] transition-all duration-1000 delay-500 shadow-[2px_0_0_var(--ink)]"
                        style={{ width: `${(current / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tricks Column */}
          <div className="bg-[var(--cream-warm)] border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] rounded-[var(--r-lg)] p-8 relative overflow-hidden">
            <Splat.Specks color="var(--cyan)" size={140} seed={3} className="absolute -top-10 -right-10 opacity-30 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8">
              <Guitar className="w-8 h-8 text-[var(--cyan)]" />
              <h3 className="drip-text text-[32px] text-[var(--ink)] leading-none">Initial Bag</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              {selectedTricks.map((trick: string, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-[var(--cream-shadow)] hover:border-[var(--cyan)] hover:-translate-y-0.5 transition-all shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-[var(--cyan)] text-[var(--ink)] font-black flex items-center justify-center shrink-0 border-2 border-[var(--ink)]">
                    {i + 1}
                  </span>
                  <span className="font-extrabold text-[var(--ink)] text-sm">{trick}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[var(--ink)] rounded-xl border-2 border-[var(--ink)] text-[var(--cream-warm)] shadow-[4px_4px_0_var(--cyan)]">
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-[var(--cyan)] shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-relaxed">
                  These 5 concepts will be immediately integrated into your daily practice routine.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={handleBuildRoadmap}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[var(--marmalade)] text-[var(--cream-warm)] font-black text-xl border-none shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer w-full md:w-auto"
          >
            Generate My Roadmap <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  )
}
