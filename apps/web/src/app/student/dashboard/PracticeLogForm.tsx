'use client'

import { useState, useEffect } from 'react'
import { logPractice } from './actions'
import { Flame, Clock, Music, Smile } from 'lucide-react'
import { usePracticeTimer } from '@/context/PracticeTimerContext'

export default function PracticeLogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const { elapsedSeconds, subject, stopTimer } = usePracticeTimer()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage('')
    
    const result = await logPractice(formData)
    
    setIsSubmitting(false)
    if (result?.error) {
      setMessage(`❌ ${result.error}`)
    } else {
      setMessage('✅ Practice logged successfully! Keep the streak alive.')
      stopTimer()
      // Reset form fields
      const form = document.getElementById('practice-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Flame className="w-32 h-32 text-amber" />
      </div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="bg-gradient-to-br from-amber to-amber-600 p-3 rounded-2xl shadow-lg shadow-amber/30">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-paint text-navy">Log Your Kitchen</h2>
      </div>

      <form id="practice-form" action={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-navy" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-white/60 border-2 border-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all text-navy font-medium shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-navy" htmlFor="duration_minutes">
              <Clock className="w-4 h-4 text-amber" />
              Duration (minutes)
            </label>
            <input
              id="duration_minutes"
              name="duration_minutes"
              type="number"
              min="1"
              required
              defaultValue={Math.max(1, Math.floor(elapsedSeconds / 60))}
              placeholder="e.g. 30"
              className="w-full px-4 py-3 bg-white/60 border-2 border-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all text-navy font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-navy" htmlFor="what_practiced">
            <Music className="w-4 h-4 text-amber" />
            What did you focus on today?
          </label>
          <input
            id="what_practiced"
            name="what_practiced"
            type="text"
            required
            defaultValue={subject || ''}
            placeholder="e.g. Minor pentatonic positions, Alternate picking..."
            className="w-full px-4 py-3 bg-white/60 border-2 border-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all text-navy font-medium shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-navy" htmlFor="sauce_stage">
            <Flame className="w-4 h-4 text-amber" />
            S.A.U.C.E. Stage
          </label>
          <select
            id="sauce_stage"
            name="sauce_stage"
            required
            className="w-full px-4 py-3 bg-white/60 border-2 border-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all text-navy font-medium shadow-sm cursor-pointer"
          >
            <option value="">Select a stage...</option>
            <option value="Study (Steal)">Study (Steal) - Analyze, transcribe, and understand vocabulary.</option>
            <option value="Assimilate">Assimilate - Internalize through warmups and repetition.</option>
            <option value="Utilize">Utilize - Play over progressions, transpose, and record.</option>
            <option value="Compose">Compose - Write solos, develop your voice intentionally.</option>
            <option value="Elevate">Elevate - Push limits, seek mentors, level up identity.</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-navy">
            <Smile className="w-4 h-4 text-amber" />
            How did it feel? (1-5)
          </label>
          <div className="flex justify-between gap-2 bg-white/40 p-1.5 rounded-2xl shadow-inner border border-white/40">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="feel_rating"
                  value={rating}
                  required
                  className="peer sr-only"
                />
                <div className="py-2.5 text-center rounded-xl font-bold text-navy/50 peer-checked:bg-amber peer-checked:text-white peer-checked:shadow-md transition-all">
                  {rating}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex justify-center text-lg mt-4"
        >
          {isSubmitting ? 'Logging...' : 'Save Practice Session'}
        </button>

        {message && (
          <div className={`p-4 rounded-xl backdrop-blur-sm border ${message.includes('✅') ? 'bg-green-50/80 border-green-200' : 'bg-red-50/80 border-red-200'}`}>
            <p className={`text-sm font-bold text-center ${message.includes('✅') ? 'text-green-700' : 'text-red-600'}`}>{message}</p>
          </div>
        )}
      </form>
    </div>
  )
}
