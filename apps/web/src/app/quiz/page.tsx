'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Guitar, Activity, Target, ArrowRight, Sparkles } from 'lucide-react'
import { SplatBackdrop, Splat } from '@/components/ui/Splats'

const ARCHETYPES = [
  "The Modern Improviser",
  "The Blues Architect",
  "The Fretboard Ninja",
  "The Groove Master",
  "The Songwriter",
  "The Technical Virtuoso"
]

const GENRES = [
  "Rock",
  "Blues/Rock",
  "Jam Band",
  "Shred",
  "Jazz Rock",
  "Blues"
]

const ELEMENTS = [
  { id: 'fretboard', label: 'Fretboard Awareness' },
  { id: 'rhythm', label: 'Rhythm' },
  { id: 'technique', label: 'Technique' },
  { id: 'theory', label: 'Music Theory' },
  { id: 'repertoire', label: 'Repertoire' },
]

const TRICKS = [
  "Double Stops",
  "Pedal Tone",
  "Sweep Arpeggios",
  "Tapping",
  "Target Notes / Chord Tone Soloing",
  "String Skipping",
  "Country 6ths",
  "Melodic Motif (ABAC vs AAAB)",
  "Hemiola",
  "Odd Note Groupings"
]

const ARCHETYPE_PRESETS: Record<string, Record<string, number>> = {
  "The Modern Improviser": { fretboard: 9, rhythm: 8, technique: 8, theory: 9, repertoire: 6 },
  "The Blues Architect": { fretboard: 7, rhythm: 9, technique: 7, theory: 6, repertoire: 8 },
  "The Fretboard Ninja": { fretboard: 10, rhythm: 7, technique: 10, theory: 8, repertoire: 5 },
  "The Groove Master": { fretboard: 6, rhythm: 10, technique: 7, theory: 6, repertoire: 9 },
  "The Songwriter": { fretboard: 5, rhythm: 8, technique: 5, theory: 7, repertoire: 10 },
  "The Technical Virtuoso": { fretboard: 10, rhythm: 8, technique: 10, theory: 9, repertoire: 7 },
}

const GENRE_TRICK_PRESETS: Record<string, string[]> = {
  "Rock": ["Double Stops", "Pedal Tone", "String Skipping"],
  "Blues/Rock": ["Double Stops", "Target Notes / Chord Tone Soloing", "Melodic Motif (ABAC vs AAAB)"],
  "Jam Band": ["Target Notes / Chord Tone Soloing", "Hemiola", "Odd Note Groupings"],
  "Shred": ["Sweep Arpeggios", "Tapping", "String Skipping"],
  "Jazz Rock": ["Target Notes / Chord Tone Soloing", "Hemiola", "Odd Note Groupings", "Sweep Arpeggios"],
  "Blues": ["Double Stops", "Pedal Tone", "Melodic Motif (ABAC vs AAAB)"],
}

export default function AvatarQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [archetype, setArchetype] = useState('')
  const [genre, setGenre] = useState('')
  const [currentStats, setCurrentStats] = useState<Record<string, number>>({
    fretboard: 5, rhythm: 5, technique: 5, theory: 5, repertoire: 5
  })
  const [idealStats, setIdealStats] = useState<Record<string, number>>({
    fretboard: 10, rhythm: 10, technique: 10, theory: 10, repertoire: 10
  })
  const [selectedTricks, setSelectedTricks] = useState<string[]>([])

  const handleNext = () => {
    if (step === 1 && archetype && ARCHETYPE_PRESETS[archetype]) {
      setIdealStats(ARCHETYPE_PRESETS[archetype])
    }
    if (step === 2 && genre && GENRE_TRICK_PRESETS[genre]) {
      setSelectedTricks(GENRE_TRICK_PRESETS[genre].slice(0, 5))
    }
    setStep(prev => prev + 1)
  }
  
  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('avatar_data', JSON.stringify({ archetype, genre, currentStats, idealStats, selectedTricks }))
    }
    router.push('/quiz/results')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 relative overflow-hidden">
      
      <SplatBackdrop intensity="medium" palette="warm" />

      <div className="w-full max-w-2xl relative z-10 pt-10 pb-20">
        
        {/* Progress */}
        <div className="mb-10 flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'w-16 bg-[var(--marmalade)] shadow-[0_0_10px_var(--marmalade)]' : 'w-4 bg-[var(--ink-faint)]'}`} />
          ))}
        </div>

        <div className="relative bg-[var(--cream-warm)] border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] rounded-[var(--r-lg)] p-8 md:p-12">
          
          {step === 1 && <Splat.Specks color="var(--marmalade)" size={120} seed={1} className="absolute -top-6 -right-6 opacity-30 pointer-events-none" />}
          {step === 2 && <Splat.Specks color="var(--cyan)" size={120} seed={2} className="absolute top-10 -left-6 opacity-30 pointer-events-none" />}
          {step === 3 && <Splat.Specks color="var(--acid)" size={120} seed={3} className="absolute bottom-10 -right-6 opacity-30 pointer-events-none" />}
          {step === 4 && <Splat.Specks color="var(--punch)" size={120} seed={4} className="absolute -top-10 -left-6 opacity-30 pointer-events-none" />}
          {step === 5 && <Splat.Burst color="var(--marmalade)" size={180} seed={5} className="absolute -top-16 -right-10 opacity-20 pointer-events-none" rotate={45} />}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: ARCHETYPE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="text-center space-y-4">
                  <Guitar className="w-16 h-16 text-[var(--marmalade)] mx-auto drop-shadow-md" />
                  <h1 className="drip-text text-[44px] text-[var(--ink)] leading-none">Design Your <span className="text-[var(--marmalade)]">Avatar</span></h1>
                  <p className="text-[var(--ink-mid)] text-lg font-bold">What kind of guitarist do you want to become?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ARCHETYPES.map(arch => (
                    <button
                      key={arch}
                      onClick={() => setArchetype(arch)}
                      className={`p-4 rounded-2xl border-2 text-left font-extrabold transition-all duration-200 cursor-pointer ${
                        archetype === arch 
                          ? 'border-[var(--marmalade)] bg-[var(--marmalade)] text-[var(--cream-warm)] shadow-[4px_4px_0_var(--ink)] -translate-y-1' 
                          : 'border-[var(--cream-shadow)] bg-white text-[var(--ink)] hover:border-[var(--marmalade)] hover:-translate-y-0.5'
                      }`}
                    >
                      {arch}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!archetype}
                  onClick={handleNext}
                  className="w-full py-5 rounded-2xl bg-[var(--punch)] text-[var(--cream-warm)] font-black text-xl flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer border-none"
                >
                  Next Step <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: GENRE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="text-center space-y-4">
                  <Guitar className="w-16 h-16 text-[var(--cyan)] mx-auto drop-shadow-md" />
                  <h1 className="drip-text text-[44px] text-[var(--ink)] leading-none">Set Your <span className="text-[var(--cyan)]">Style</span></h1>
                  <p className="text-[var(--ink-mid)] text-lg font-bold">What is your primary genre of focus?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`p-4 rounded-2xl border-2 text-left font-extrabold transition-all duration-200 cursor-pointer ${
                        genre === g 
                          ? 'border-[var(--cyan)] bg-[var(--cyan)] text-[var(--ink)] shadow-[4px_4px_0_var(--ink)] -translate-y-1' 
                          : 'border-[var(--cream-shadow)] bg-white text-[var(--ink)] hover:border-[var(--cyan)] hover:-translate-y-0.5'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!genre}
                  onClick={handleNext}
                  className="w-full py-5 rounded-2xl bg-[var(--cyan)] text-[var(--ink)] font-black text-xl flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer border-none"
                >
                  Next Step <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </motion.div>
            )}

            {/* STEP 3: CURRENT ABILITIES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="text-center space-y-4">
                  <Activity className="w-16 h-16 text-[var(--acid)] mx-auto drop-shadow-md" />
                  <h1 className="drip-text text-[44px] text-[var(--ink)] leading-none">Where are <span className="text-[var(--acid)]">You?</span></h1>
                  <p className="text-[var(--ink-mid)] text-lg font-bold">Be honest. Rate your current abilities from 1-10.</p>
                </div>

                <div className="space-y-8 bg-white p-6 rounded-2xl border-2 border-[var(--cream-shadow)]">
                  {ELEMENTS.map(el => (
                    <div key={el.id} className="space-y-3">
                      <div className="flex justify-between text-sm font-black text-[var(--ink)] uppercase tracking-wide">
                        <span>{el.label}</span>
                        <span className="text-[var(--acid)] text-lg leading-none">{currentStats[el.id]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={currentStats[el.id]}
                        onChange={(e) => setCurrentStats({...currentStats, [el.id]: parseInt(e.target.value)})}
                        className="w-full h-3 bg-[var(--cream-shadow)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: "var(--acid)" }}
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-5 rounded-2xl bg-[var(--acid)] text-[var(--ink)] font-black text-xl flex items-center justify-center gap-3 mt-8 shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer border-none"
                >
                  Next Step <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </motion.div>
            )}

            {/* STEP 4: IDEAL ABILITIES */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="text-center space-y-4">
                  <Target className="w-16 h-16 text-[var(--punch)] mx-auto drop-shadow-md" />
                  <h1 className="drip-text text-[44px] text-[var(--ink)] leading-none">Your <span className="text-[var(--punch)]">Ideal Self</span></h1>
                  <p className="text-[var(--ink-mid)] text-lg font-bold">To be <strong>{archetype}</strong>, what do these stats need to be?</p>
                </div>

                <div className="space-y-8 bg-white p-6 rounded-2xl border-2 border-[var(--cream-shadow)]">
                  {ELEMENTS.map(el => (
                    <div key={el.id} className="space-y-3">
                      <div className="flex justify-between text-sm font-black text-[var(--ink)] uppercase tracking-wide">
                        <span>{el.label}</span>
                        <span className="text-[var(--punch)] text-lg leading-none">{idealStats[el.id]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={idealStats[el.id]}
                        onChange={(e) => setIdealStats({...idealStats, [el.id]: parseInt(e.target.value)})}
                        className="w-full h-3 bg-[var(--cream-shadow)] rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: "var(--punch)" }}
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-5 rounded-2xl bg-[var(--punch)] text-[var(--cream-warm)] font-black text-xl flex items-center justify-center gap-3 mt-8 shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer border-none"
                >
                  Next Step <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </motion.div>
            )}

            {/* STEP 5: BAG O' TRICKS */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-[var(--marmalade)] mx-auto drop-shadow-md" />
                  <h1 className="drip-text text-[44px] text-[var(--ink)] leading-none">Fill Your <span className="text-[var(--marmalade)]">Bag</span></h1>
                  <p className="text-[var(--ink-mid)] text-lg font-bold">What lead guitar licks and tricks do you want to learn? (Choose exactly 5)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto p-3 bg-white rounded-2xl border-2 border-[var(--cream-shadow)]">
                  {TRICKS.map(trick => {
                    const isSelected = selectedTricks.includes(trick)
                    const isMaxed = selectedTricks.length >= 5 && !isSelected
                    return (
                      <button
                        key={trick}
                        disabled={isMaxed}
                        onClick={() => {
                          if (isSelected) setSelectedTricks(prev => prev.filter(t => t !== trick))
                          else setSelectedTricks(prev => [...prev, trick])
                        }}
                        className={`p-4 rounded-xl border-2 text-left font-extrabold transition-all text-sm cursor-pointer ${
                          isSelected 
                            ? 'border-[var(--marmalade)] bg-[var(--marmalade)] text-[var(--cream-warm)] shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' 
                            : isMaxed 
                              ? 'border-[var(--ink-faint)] bg-gray-50 text-[var(--ink-faint)] cursor-not-allowed opacity-50'
                              : 'border-[var(--cream-shadow)] bg-white text-[var(--ink)] hover:border-[var(--marmalade)] hover:-translate-y-0.5'
                        }`}
                      >
                        {trick}
                      </button>
                    )
                  })}
                </div>

                <div className="text-center text-sm font-black uppercase tracking-widest text-[var(--ink-mid)]">
                  <span className={selectedTricks.length === 5 ? "text-[var(--marmalade)]" : ""}>{selectedTricks.length}</span> / 5 Selected
                </div>

                <button 
                  disabled={selectedTricks.length !== 5}
                  onClick={handleComplete}
                  className="w-full py-5 rounded-2xl bg-[var(--ink)] text-[var(--cream-warm)] font-black text-xl flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-[4px_4px_0_var(--marmalade)] hover:-translate-y-1 transition-transform active:translate-y-0 cursor-pointer border-none"
                >
                  Generate My DNA <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
