'use client'

import { usePracticeTimer } from '@/context/PracticeTimerContext'
import { CheckCircle, Play, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function KitchenControls({ exerciseTitle }: { exerciseTitle: string }) {
  const { startTimer, stopTimer, triggerAnimation, isTimerRunning, isPhaseTwo, enterPhaseTwo } = usePracticeTimer()
  const router = useRouter()

  const handleStart = () => {
    startTimer(exerciseTitle)
    triggerAnimation('splash')
  }

  const handlePhaseTwo = () => {
    enterPhaseTwo()
    triggerAnimation('splash')
  }

  const handleComplete = () => {
    stopTimer()
    triggerAnimation('explosion')
    setTimeout(() => {
      router.push('/student/dashboard')
    }, 1000)
  }

  if (isTimerRunning) {
    if (!isPhaseTwo) {
      return (
        <button 
          onClick={handlePhaseTwo}
          className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/20 hover:-translate-y-1 active:scale-95 group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Turn it into music!
          </span>
        </button>
      )
    }

    return (
      <button 
        onClick={handleComplete}
        className="w-full relative overflow-hidden bg-white text-navy font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Mark as Completed
        </span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleStart}
      className="w-full relative overflow-hidden bg-amber hover:bg-amber-500 text-navy font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
    >
      <Play className="w-5 h-5" />
      Start Timer & Practice
    </button>
  )
}
