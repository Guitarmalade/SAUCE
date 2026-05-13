'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { CheckCircle2, Circle, Lock, Unlock, Medal } from 'lucide-react'

type Skill = {
  id: string
  title: string
  description: string
  completed: boolean
}

type Unit = {
  id: string
  title: string
  description: string
  skills: Skill[]
  isCompleted: boolean
  isUnlocked: boolean
}

export default function CurriculumMap({ initialUnits }: { initialUnits: Unit[] }) {
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)
  const [recentlyCompletedUnit, setRecentlyCompletedUnit] = useState<string | null>(null)

  // In a real flow, checking off a skill might happen in real-time or be done by the teacher.
  // The prompt says "checklist of skills (teacher marks complete)".
  // So for the student view, it's read-only.

  // We can trigger confetti if we notice a new unit is completed compared to last visit, 
  // but for simplicity, let's just render the map.

  return (
    <div className="max-w-3xl mx-auto py-12 relative">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
        </div>
      )}

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[2.25rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-amber before:via-amber/50 before:to-gray-200">
        
        {initialUnits.map((unit, index) => {
          const allSkillsCompleted = unit.skills.every(s => s.completed)
          
          return (
            <motion.div 
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-offwhite shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                unit.isCompleted ? 'bg-amber text-white' : 
                unit.isUnlocked ? 'bg-white border-amber text-amber' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {unit.isCompleted ? <Medal className="w-5 h-5" /> : 
                 unit.isUnlocked ? <Unlock className="w-4 h-4" /> : 
                 <Lock className="w-4 h-4" />}
              </div>

              {/* Card */}
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl shadow-sm border transition-all ${
                unit.isUnlocked 
                  ? 'bg-white border-amber/30 hover:shadow-md' 
                  : 'bg-gray-50 border-gray-100 opacity-70'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${unit.isUnlocked ? 'text-navy' : 'text-navy/50'}`}>
                    {unit.title}
                  </h3>
                  {unit.isCompleted && (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-amber/10 text-amber">
                      Mastered
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mb-6 ${unit.isUnlocked ? 'text-navy/70' : 'text-navy/40'}`}>
                  {unit.description}
                </p>

                <div className="space-y-3">
                  {unit.skills.map(skill => (
                    <div key={skill.id} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {skill.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-amber" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${skill.completed ? 'text-navy line-through opacity-70' : 'text-navy'}`}>
                          {skill.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {!unit.isUnlocked && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Complete previous unit to unlock
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
