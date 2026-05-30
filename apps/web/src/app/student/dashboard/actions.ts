'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../lib/supabase/server'

export async function logPractice(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const durationStr = formData.get('duration_minutes') as string
  const whatPracticed = formData.get('what_practiced') as string
  const feelRatingStr = formData.get('feel_rating') as string
  const sauceStage = formData.get('sauce_stage') as string
  const date = formData.get('date') as string || new Date().toISOString().split('T')[0]

  if (!durationStr || !whatPracticed || !feelRatingStr) {
    return { error: 'Missing required fields' }
  }

  const duration = parseInt(durationStr, 10)
  const feelRating = parseInt(feelRatingStr, 10)

  const { error } = await supabase.from('practice_logs').insert({
    student_id: user.id,
    date: date,
    duration_minutes: duration,
    what_practiced: whatPracticed,
    feel_rating: feelRating,
    sauce_stage: sauceStage || null,
  })

  if (error) {
    console.error('Error logging practice:', error)
    return { error: 'Failed to save practice log' }
  }

  revalidatePath('/student/dashboard')
  return { success: true }
}
