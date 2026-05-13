import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AlphaTabPlayer from '@/components/AlphaTabPlayer'
import { ArrowLeft, PlayCircle } from 'lucide-react'
import KitchenControls from './KitchenControls'

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
    description: "Master the classic 12-bar turnaround using the E minor pentatonic scale. Focus on strict alternate picking and hitting the changes.",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
    tab_url: "https://www.alphatab.net/files/canon.gp", // Placeholder guitar pro file
    xp_reward: 150
  }

  return (
    <div className="min-h-screen bg-offwhite p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="p-2 hover:bg-navy/5 rounded-full transition-colors text-navy">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-paint text-navy">{mockExercise.title}</h1>
              <p className="text-navy/70 font-bold tracking-wide uppercase text-sm mt-1">Interactive Kitchen</p>
            </div>
          </div>
          
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
            <span className="font-bold text-navy/70">Reward:</span>
            <span className="text-xl font-paint text-amber">+{mockExercise.xp_reward} XP</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Video & Tabs) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player */}
            {mockExercise.video_url && (
              <div className="glass-card rounded-3xl overflow-hidden shadow-lg aspect-video relative group">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  src={mockExercise.video_url}
                  poster="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-navy/20 pointer-events-none group-hover:bg-transparent transition-colors" />
              </div>
            )}

            {/* Notation Player */}
            {mockExercise.tab_url && (
              <div className="space-y-4">
                <h3 className="text-2xl font-paint text-navy flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-amber" />
                  Interactive Notation
                </h3>
                <AlphaTabPlayer fileUrl={mockExercise.tab_url} />
              </div>
            )}

          </div>

          {/* Sidebar Area (Instructions & Actions) */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-br from-navy to-navy-700 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-paint text-amber mb-4">Instructions</h3>
              <p className="text-white/90 leading-relaxed font-medium mb-8">
                {mockExercise.description}
              </p>
              
              <div className="space-y-4">
                <KitchenControls exerciseTitle={mockExercise.title} />
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold text-navy mb-2">Need a hint?</h3>
              <p className="text-navy/70 text-sm font-medium">
                Use the playback controls at the bottom of the notation player to slow down the tempo or loop a specific section.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
