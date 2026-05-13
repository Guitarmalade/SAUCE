'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type AnimationType = 'splash' | 'explosion' | null

interface PracticeTimerContextType {
  isTimerRunning: boolean
  isPhaseTwo: boolean
  subject: string | null
  elapsedSeconds: number
  globalElapsedSeconds: number
  globalTargetMinutes: number
  activeAnimation: AnimationType
  startTimer: (subject: string) => void
  enterPhaseTwo: () => void
  stopTimer: () => void
  triggerAnimation: (type: AnimationType) => void
  clearAnimation: () => void
}

const PracticeTimerContext = createContext<PracticeTimerContextType | undefined>(undefined)

export function PracticeTimerProvider({ children }: { children: React.ReactNode }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPhaseTwo, setIsPhaseTwo] = useState(false)
  const [subject, setSubject] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [globalElapsedSeconds, setGlobalElapsedSeconds] = useState(0)
  const [globalTargetMinutes] = useState(30) // Default target of 30 mins
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>(null)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
        setGlobalElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  const startTimer = useCallback((newSubject: string) => {
    setSubject(newSubject)
    setElapsedSeconds(0)
    setIsTimerRunning(true)
    setIsPhaseTwo(false)
  }, [])

  const enterPhaseTwo = useCallback(() => {
    setIsPhaseTwo(true)
  }, [])

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false)
    setIsPhaseTwo(false)
    setSubject(null)
    setElapsedSeconds(0)
  }, [])

  const triggerAnimation = useCallback((type: AnimationType) => {
    setActiveAnimation(type)
    // Auto-clear splash after 2s, explosion after 4s
    const duration = type === 'explosion' ? 4000 : 2000
    setTimeout(() => setActiveAnimation(null), duration)
  }, [])

  const clearAnimation = useCallback(() => {
    setActiveAnimation(null)
  }, [])

  return (
    <PracticeTimerContext.Provider 
      value={{
        isTimerRunning,
        isPhaseTwo,
        subject,
        elapsedSeconds,
        globalElapsedSeconds,
        globalTargetMinutes,
        activeAnimation,
        startTimer,
        enterPhaseTwo,
        stopTimer,
        triggerAnimation,
        clearAnimation
      }}
    >
      {children}
    </PracticeTimerContext.Provider>
  )
}

export function usePracticeTimer() {
  const context = useContext(PracticeTimerContext)
  if (context === undefined) {
    throw new Error('usePracticeTimer must be used within a PracticeTimerProvider')
  }
  return context
}
