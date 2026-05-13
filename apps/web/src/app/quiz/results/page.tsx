'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Activity, Target } from 'lucide-react'

const ELEMENTS = [
  { id: 'fretboard', label: 'Fretboard Awareness' },
  { id: 'rhythm', label: 'Rhythm' },
  { id: 'technique', label: 'Technique' },
  { id: 'theory', label: 'Music Theory' },
  { id: 'repertoire', label: 'Repertoire' },
]

export default function QuizResults() {
  const router = useRouter()
  const [data, setData] = useState<{
    archetype: string, 
    currentStats: Record<string, number>, 
    idealStats: Record<string, number>
  } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('avatar_data')
    if (saved) {
      setData(JSON.parse(saved))
    } else {
      router.push('/quiz')
    }
  }, [router])

  if (!data) return null

  return (
    <div className="min-h-screen bg-offwhite p-6 md:p-12 relative overflow-hidden">
      
      {/* Decorative Splatter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 text-pink-500 mx-auto" />
          <h1 className="text-5xl font-paint text-navy">Your Guitar DNA</h1>
          <p className="text-xl font-medium text-navy/70">
            Path to becoming: <strong className="text-pink-600">{data.archetype}</strong>
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-2xl font-bold text-navy mb-8 border-b border-navy/10 pb-4">Gap Analysis</h2>
          
          <div className="space-y-8">
            {ELEMENTS.map(el => {
              const current = data.currentStats[el.id]
              const ideal = data.idealStats[el.id]
              
              return (
                <div key={el.id} className="space-y-2">
                  <div className="flex justify-between font-bold text-navy">
                    <span>{el.label}</span>
                    <span className="text-sm opacity-70">Gap: {ideal - current > 0 ? `+${ideal - current}` : 'Maxed'}</span>
                  </div>
                  
                  <div className="relative h-6 bg-navy/10 rounded-full overflow-hidden">
                    {/* Ideal Bar (Background) */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-pink-200"
                      style={{ width: `${(ideal / 10) * 100}%` }}
                    />
                    {/* Current Bar (Foreground) */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-r-full shadow-lg"
                      style={{ width: `${(current / 10) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-blue-600 flex items-center gap-1"><Activity className="w-3 h-3"/> Current: {current}/10</span>
                    <span className="text-pink-600 flex items-center gap-1"><Target className="w-3 h-3"/> Ideal: {ideal}/10</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 bg-pink-50 rounded-2xl p-6 border border-pink-100">
            <h3 className="font-bold text-pink-800 text-lg mb-2">AI Analysis</h3>
            <p className="text-pink-900/80 font-medium leading-relaxed">
              Based on your DNA, you already have a solid foundation, but to truly become <strong>{data.archetype}</strong>, we need to bridge the gap in your lowest scoring areas. We will build your personalized roadmap focusing heavily on Assimilating and Utilizing concepts in those exact spaces.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/student/roadmap" className="btn-primary py-4 px-12 text-xl flex items-center justify-center gap-3 bg-gradient-to-r from-amber to-orange-500 border-none shadow-orange-500/30 hover:scale-105 transition-transform">
            View My Personalized Roadmap <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

      </div>
    </div>
  )
}
