'use client'

import { usePracticeTimer } from '@/context/PracticeTimerContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Trophy, Sparkles, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ActiveTimerWidget() {
  const { isTimerRunning, subject, elapsedSeconds, globalElapsedSeconds, globalTargetMinutes, stopTimer, triggerAnimation, isPhaseTwo, enterPhaseTwo } = usePracticeTimer()
  const router = useRouter()

  if (!isTimerRunning) return null

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleComplete = () => {
    triggerAnimation('explosion')
    stopTimer()
    // In a real app, this might automatically push data to the API or open a pre-filled log form modal.
    // For now, we redirect them to the dashboard so they can hit the log form.
    router.push('/student/dashboard')
  }

  const globalProgress = Math.min((globalElapsedSeconds / (globalTargetMinutes * 60)) * 100, 100)
  const circumference = 2 * Math.PI * 18 // r=18

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <div className={`bg-navy/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-6 ${isPhaseTwo ? 'shadow-pink-500/20 border-pink-500/30' : ''}`}>
          
          {/* Global Session Wheel */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" className="stroke-white/10" strokeWidth="3" />
              <motion.circle 
                cx="20" cy="20" r="18" fill="none" 
                className="stroke-amber" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (globalProgress / 100) * circumference}
                animate={{ strokeDashoffset: circumference - (globalProgress / 100) * circumference }}
                transition={{ duration: 1 }}
              />
            </svg>
            <Target className="absolute w-4 h-4 text-amber/80" />
          </div>

          <div className="flex flex-col border-l border-white/10 pl-4">
            <span className={`font-bold text-xs uppercase tracking-widest ${isPhaseTwo ? 'text-pink-400' : 'text-amber'}`}>
              {isPhaseTwo ? 'Music Phase' : 'Active Focus'}
            </span>
            <span className="text-white font-medium text-sm truncate max-w-[150px]">{subject}</span>
          </div>

          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-paint text-xl tracking-widest">{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isPhaseTwo && (
              <button 
                onClick={() => {
                  enterPhaseTwo()
                  triggerAnimation('splash')
                }}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Turn into music
              </button>
            )}
            <button 
              onClick={() => stopTimer()}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Cancel Timer"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={handleComplete}
              className="px-4 py-2 bg-amber hover:bg-amber-500 text-navy font-bold rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              Complete
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
