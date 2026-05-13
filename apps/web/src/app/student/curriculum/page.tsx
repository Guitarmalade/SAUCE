import { createClient } from '@/utils/supabase/server'
import CurriculumMap from './CurriculumMap'

export default async function StudentCurriculumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all units
  const { data: units } = await supabase
    .from('curriculum_units')
    .select('*')
    .order('order_index', { ascending: true })

  // Fetch all skills
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('*')
    .order('order_index', { ascending: true })

  // Fetch student's skill progress
  const { data: progress } = await supabase
    .from('student_skill_progress')
    .select('*')
    .eq('student_id', user?.id)

  // Fetch student's milestones (completed units)
  const { data: milestones } = await supabase
    .from('student_milestones')
    .select('unit_id')
    .eq('student_id', user?.id)

  const completedSkillIds = new Set(progress?.filter(p => p.completed).map(p => p.skill_id))
  const completedUnitIds = new Set(milestones?.map(m => m.unit_id))

  // Shape data for the client component
  let previousUnitCompleted = true // The first unit is always unlocked
  
  const mappedUnits = (units || []).map(unit => {
    const unitSkills = (skills || []).filter(s => s.unit_id === unit.id).map(skill => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      completed: completedSkillIds.has(skill.id)
    }))

    const isCompleted = completedUnitIds.has(unit.id)
    const isUnlocked = previousUnitCompleted || isCompleted

    // Update the flag for the next unit in the loop
    previousUnitCompleted = isCompleted

    return {
      id: unit.id,
      title: unit.title,
      description: unit.description,
      skills: unitSkills,
      isCompleted,
      isUnlocked
    }
  })

  // If there are no units yet, handle empty state
  if (!units || units.length === 0) {
    return (
      <div className="min-h-screen bg-offwhite px-6 py-12">
        <div className="max-w-6xl mx-auto text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-navy mb-2">Curriculum Map</h2>
          <p className="text-navy/60">Your teacher hasn't set up the curriculum yet. Check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-offwhite px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-3">Your Journey</h1>
          <p className="text-lg text-navy/70 max-w-2xl mx-auto">
            Master skills to unlock new units. Your teacher will mark skills as complete when you're ready to move forward.
          </p>
        </header>

        <CurriculumMap initialUnits={mappedUnits} />
      </div>
    </div>
  )
}
