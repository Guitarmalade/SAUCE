import { createClient } from '../../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import KitchenClient from './KitchenClient'
import { SplatBackdrop } from '@/components/ui/Splats'

export default async function InteractiveKitchen(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // In a real flow, this would fetch from `roadmap_steps` or `assignments` based on params.id
  // For now, we mock the data to show the UI
  const mockExercise = {
    title: "12-Bar Blues in E",
    skill: "blues",
    stage: "A",
    stageName: "Assimilate",
    minutes: 15,
    bpm: 90,
    xp: 150,
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tab_url: "https://www.alphatab.net/files/canon.gp"
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden pb-20 pt-10 px-6">
      <SplatBackdrop intensity="medium" palette="warm" />
      <div className="relative z-10">
        <KitchenClient exercise={mockExercise} />
      </div>
    </div>
  )
}
