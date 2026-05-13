import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Award, Lock, PlayCircle, CheckCircle2 } from 'lucide-react'

export default async function PersonalizedRoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Mock data for the personalized roadmap
  // In a real app, this would be fetched from `personalized_roadmaps` and `roadmap_steps`
  const mockGoal = {
    title: "Master the 12-Bar Blues",
    target_date: "2026-07-01",
  }

  const mockSteps = [
    {
      id: 1,
      title: "Blues Shuffle Rhythm",
      description: "Learn the classic 'Texas Shuffle' rhythm pattern.",
      is_completed: true,
      xp_reward: 50,
      locked: false,
    },
    {
      id: 2,
      title: "Minor Pentatonic Pos. 1",
      description: "Memorize the first position of the E minor pentatonic scale.",
      is_completed: true,
      xp_reward: 50,
      locked: false,
    },
    {
      id: 3,
      title: "12-Bar Blues in E (Turnaround)",
      description: "Nail the turnaround and put it all together.",
      is_completed: false,
      xp_reward: 150,
      locked: false,
    },
    {
      id: 4,
      title: "Improvisation & Phrasing",
      description: "Use the pentatonic scale to create your own licks.",
      is_completed: false,
      xp_reward: 200,
      locked: true,
    }
  ]

  return (
    <div className="min-h-screen bg-offwhite p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="p-2 hover:bg-navy/5 rounded-full transition-colors text-navy">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-paint text-navy">Your Roadmap</h1>
            <p className="text-navy/70 font-bold tracking-wide uppercase text-sm mt-1">Personalized Path</p>
          </div>
        </div>

        {/* Goal Card */}
        <div className="bg-gradient-to-br from-amber to-amber-500 rounded-3xl p-8 text-white shadow-xl shadow-amber/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-1">Current Goal</p>
              <h2 className="text-3xl font-paint">{mockGoal.title}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-1">Target</p>
            <p className="text-xl font-bold">{new Date(mockGoal.target_date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Roadmap Path */}
        <div className="py-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-10 bottom-10 w-1 bg-navy/10 -translate-x-1/2 rounded-full" />

          <div className="space-y-12 relative z-10">
            {mockSteps.map((step, index) => {
              const isEven = index % 2 === 0
              
              return (
                <div key={step.id} className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                    <div className={`w-full max-w-sm glass-card rounded-2xl p-6 relative ${step.locked ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                      
                      {step.is_completed && (
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-lg">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-navy pr-4">{step.title}</h3>
                        {step.locked ? (
                          <Lock className="w-5 h-5 text-navy/30 shrink-0" />
                        ) : (
                          <div className="flex items-center gap-1 text-amber font-bold text-sm bg-amber/10 px-2 py-1 rounded-lg shrink-0">
                            <Award className="w-4 h-4" />
                            {step.xp_reward}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-navy/70 font-medium mb-4 text-sm">{step.description}</p>
                      
                      {!step.locked && !step.is_completed && (
                        <Link 
                          href="/student/practice/123" 
                          className="w-full btn-primary py-2 px-4 flex items-center justify-center gap-2 text-sm"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Hit the Kitchen
                        </Link>
                      )}
                      {step.is_completed && (
                        <button disabled className="w-full bg-navy/5 text-navy/40 font-bold py-2 px-4 rounded-xl text-sm border-2 border-navy/5">
                          Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:static md:left-auto md:w-16 flex justify-center -translate-x-1/2 md:translate-x-0">
                    <div className={`w-8 h-8 rounded-full border-4 border-offwhite shadow-sm flex items-center justify-center
                      ${step.is_completed ? 'bg-green-500' : step.locked ? 'bg-gray-300' : 'bg-amber animate-pulse'}
                    `}>
                      {!step.locked && !step.is_completed && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  {/* Spacer for the other side */}
                  <div className="hidden md:block w-1/2" />

                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
