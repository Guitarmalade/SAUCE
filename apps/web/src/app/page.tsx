import Link from 'next/link'
import { Music, Calendar, Target, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      
      <div className="absolute top-8 left-8 text-2xl font-paint text-navy opacity-50 select-none hidden md:block rotate-12">
        S.A.U.C.E.
      </div>
      <div className="absolute bottom-12 right-12 text-4xl font-paint text-amber opacity-30 select-none hidden md:block -rotate-6">
        C.O.R.E.
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 animate-float">
          <Sparkles className="w-5 h-5 text-amber" />
          <span className="text-sm font-bold text-navy/80 tracking-wide uppercase">The Method Made Digital</span>
        </div>

        <h1 className="text-7xl md:text-8xl font-paint text-navy tracking-tight drop-shadow-sm pb-2">
          Guitarmalade
        </h1>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gradient pb-4">
          Unleash Your S.A.U.C.E.
        </h2>
        
        <p className="text-xl text-navy/80 max-w-2xl mx-auto font-medium leading-relaxed">
          The ultimate student practice and progress tracking tool. Master the C.O.R.E. curriculum, build your streak, and turn practice into music.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <Link href="/signup" className="w-full sm:w-auto btn-primary text-lg">
            Start the Journey
          </Link>
          <Link href="/login" className="w-full sm:w-auto btn-secondary text-lg">
            Access the Kitchen
          </Link>
        </div>

        <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-24 h-24 text-navy" />
            </div>
            <h3 className="text-2xl font-paint text-navy mb-3">Log It</h3>
            <p className="text-navy/70 font-medium relative z-10">Track your daily kitchen time, log your focus, and build an unbreakable streak. The numbers don't lie.</p>
          </div>
          
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Music className="w-24 h-24 text-amber" />
            </div>
            <h3 className="text-2xl font-paint text-navy mb-3">Map It</h3>
            <p className="text-navy/70 font-medium relative z-10">Follow the C.O.R.E. curriculum map. Unlock milestones and master new skills step-by-step.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-24 h-24 text-navy" />
            </div>
            <h3 className="text-2xl font-paint text-navy mb-3">Nail It</h3>
            <p className="text-navy/70 font-medium relative z-10">Receive assignments, internalize the feel, and get direct feedback from your instructor.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
