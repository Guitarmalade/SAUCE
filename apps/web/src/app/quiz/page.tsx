'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Guitar, Activity, Target, ArrowRight, Sparkles } from 'lucide-react'

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
    // Apply presets when moving to respective steps
    if (step === 1 && archetype && ARCHETYPE_PRESETS[archetype]) {
      setIdealStats(ARCHETYPE_PRESETS[archetype])
    }
    if (step === 2 && genre && GENRE_TRICK_PRESETS[genre]) {
      // Start them with up to 5 suggested tricks
      setSelectedTricks(GENRE_TRICK_PRESETS[genre].slice(0, 5))
    }
    setStep(prev => prev + 1)
  }
  
  const handleComplete = () => {
    // In a real app, this would push to Supabase via Server Action
    // For now, we store in localStorage to pass to results page
    if (typeof window !== 'undefined') {
      localStorage.setItem('avatar_data', JSON.stringify({ archetype, genre, currentStats, idealStats, selectedTricks }))
    }
    router.push('/quiz/results')
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Splatter */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-amber/20 to-orange-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-amber' : 'w-4 bg-navy/10'}`} />
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ARCHETYPE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <Guitar className="w-16 h-16 text-amber mx-auto" />
                  <h1 className="text-4xl font-paint text-navy">Design Your Goal Guitar Avatar</h1>
                  <p className="text-navy/70 text-lg font-medium">What kind of guitarist do you want to become?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ARCHETYPES.map(arch => (
                    <button
                      key={arch}
                      onClick={() => setArchetype(arch)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all duration-200 ${
                        archetype === arch 
                          ? 'border-amber bg-amber/10 text-amber shadow-lg scale-105' 
                          : 'border-white/50 bg-white/30 text-navy hover:border-amber/50 hover:bg-white/50'
                      }`}
                    >
                      {arch}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!archetype}
                  onClick={handleNext}
                  className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step <ArrowRight className="w-6 h-6" />
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
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <Guitar className="w-16 h-16 text-blue-500 mx-auto" />
                  <h1 className="text-4xl font-paint text-navy">Set Your Style</h1>
                  <p className="text-navy/70 text-lg font-medium">What is your primary genre of focus?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all duration-200 ${
                        genre === g 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 shadow-lg scale-105' 
                          : 'border-white/50 bg-white/30 text-navy hover:border-blue-500/50 hover:bg-white/50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!genre}
                  onClick={handleNext}
                  className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 border-none"
                >
                  Next Step <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 3: CURRENT ABILITIES */}
            {step === 3 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <Activity className="w-16 h-16 text-blue-500 mx-auto" />
                  <h1 className="text-4xl font-paint text-navy">Where are you now?</h1>
                  <p className="text-navy/70 text-lg font-medium">Be honest. Rate your current abilities from 1-10.</p>
                </div>

                <div className="space-y-6">
                  {ELEMENTS.map(el => (
                    <div key={el.id} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold text-navy">
                        <span>{el.label}</span>
                        <span className="text-blue-600">{currentStats[el.id]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={currentStats[el.id]}
                        onChange={(e) => setCurrentStats({...currentStats, [el.id]: parseInt(e.target.value)})}
                        className="w-full accent-blue-500 h-2 bg-navy/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2 mt-8 bg-blue-500 hover:bg-blue-600"
                >
                  Next Step <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 4: IDEAL ABILITIES */}
            {step === 4 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <Target className="w-16 h-16 text-pink-500 mx-auto" />
                  <h1 className="text-4xl font-paint text-navy">Design Your Ideal Self</h1>
                  <p className="text-navy/70 text-lg font-medium">To be <strong>{archetype}</strong>, what do these stats need to be?</p>
                </div>

                <div className="space-y-6">
                  {ELEMENTS.map(el => (
                    <div key={el.id} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold text-navy">
                        <span>{el.label}</span>
                        <span className="text-pink-600">{idealStats[el.id]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={idealStats[el.id]}
                        onChange={(e) => setIdealStats({...idealStats, [el.id]: parseInt(e.target.value)})}
                        className="w-full accent-pink-500 h-2 bg-navy/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2 mt-8 bg-pink-500 hover:bg-pink-600 border-none shadow-pink-500/30"
                >
                  Next Step <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

            {/* STEP 5: BAG O' TRICKS */}
            {step === 5 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-amber mx-auto" />
                  <h1 className="text-4xl font-paint text-navy">Fill Your Bag</h1>
                  <p className="text-navy/70 text-lg font-medium">What lead guitar licks and tricks do you want to learn? (Choose exactly 5)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2">
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
                        className={`p-3 rounded-xl border-2 text-left font-bold transition-all text-sm ${
                          isSelected 
                            ? 'border-amber bg-amber/10 text-amber shadow-md' 
                            : isMaxed 
                              ? 'border-navy/5 bg-navy/5 text-navy/30 cursor-not-allowed'
                              : 'border-white/50 bg-white/30 text-navy hover:border-amber/50 hover:bg-white/50'
                        }`}
                      >
                        {trick}
                      </button>
                    )
                  })}
                </div>

                <div className="text-center text-sm font-bold text-navy/50">
                  {selectedTricks.length} / 5 Selected
                </div>

                <button 
                  disabled={selectedTricks.length !== 5}
                  onClick={handleComplete}
                  className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-2 mt-8 bg-gradient-to-r from-amber to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate My DNA <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
