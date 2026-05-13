'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Plus, CheckCircle, Crosshair, Activity } from 'lucide-react'

type Trick = {
  id: string
  category: 'Lead' | 'Rhythm'
  title: string
  status: 'Learning' | 'Assimilated'
}

export default function BagOTricks() {
  const [tricks, setTricks] = useState<Trick[]>([])
  const [newTrickTitle, setNewTrickTitle] = useState('')
  const [newTrickCategory, setNewTrickCategory] = useState<'Lead'|'Rhythm'>('Lead')
  
  useEffect(() => {
    // In a real app, fetch from Supabase `bag_o_tricks`
    // For now, let's load the ones they selected in the Quiz!
    const saved = localStorage.getItem('avatar_data')
    if (saved) {
      const { selectedTricks } = JSON.parse(saved)
      if (selectedTricks && Array.isArray(selectedTricks)) {
        const initialTricks = selectedTricks.map((t, i) => ({
          id: `quiz-trick-${i}`,
          category: 'Lead',
          title: t,
          status: 'Learning'
        }))
        setTricks(initialTricks)
      }
    }
  }, [])

  const handleAddTrick = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTrickTitle.trim()) return
    
    const newTrick: Trick = {
      id: `manual-trick-${Date.now()}`,
      category: newTrickCategory,
      title: newTrickTitle,
      status: 'Learning'
    }
    setTricks([newTrick, ...tricks])
    setNewTrickTitle('')
  }

  const toggleStatus = (id: string) => {
    setTricks(tricks.map(t => 
      t.id === id ? { ...t, status: t.status === 'Learning' ? 'Assimilated' : 'Learning' } : t
    ))
  }

  const leadTricks = tricks.filter(t => t.category === 'Lead')
  const rhythmTricks = tricks.filter(t => t.category === 'Rhythm')

  return (
    <div className="min-h-screen bg-offwhite p-6 md:p-10 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-amber/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 text-amber mx-auto" />
          <h1 className="text-5xl font-paint text-navy">Your Bag O' Tricks</h1>
          <p className="text-xl font-medium text-navy/70 max-w-2xl mx-auto">
            The collection of vocabulary you are currently stealing, assimilating, and utilizing.
          </p>
        </div>

        {/* Add New Trick */}
        <form onSubmit={handleAddTrick} className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center max-w-3xl mx-auto border-2 border-amber/20">
          <select 
            value={newTrickCategory}
            onChange={(e) => setNewTrickCategory(e.target.value as 'Lead'|'Rhythm')}
            className="w-full md:w-auto px-4 py-3 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber text-navy font-bold"
          >
            <option value="Lead">Lead</option>
            <option value="Rhythm">Rhythm</option>
          </select>
          <input 
            type="text" 
            placeholder="e.g. SRV Texas Flood Turnaround"
            value={newTrickTitle}
            onChange={(e) => setNewTrickTitle(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber text-navy font-medium w-full"
          />
          <button type="submit" className="w-full md:w-auto btn-primary whitespace-nowrap flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add to Bag
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEAD BAG */}
          <div className="space-y-6">
            <h2 className="text-3xl font-paint text-navy flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-pink-500" /> Lead Bag
            </h2>
            <div className="space-y-3">
              {leadTricks.length === 0 ? (
                <p className="text-navy/50 italic">Your lead bag is empty. Start stealing!</p>
              ) : (
                leadTricks.map(trick => (
                  <div key={trick.id} className="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-amber/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(trick.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${trick.status === 'Assimilated' ? 'bg-amber border-amber' : 'border-navy/30'}`}
                      >
                        {trick.status === 'Assimilated' && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <span className={`font-bold ${trick.status === 'Assimilated' ? 'text-navy/50 line-through' : 'text-navy'}`}>
                        {trick.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-500/10 px-3 py-1 rounded-full">
                      {trick.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RHYTHM BAG */}
          <div className="space-y-6">
            <h2 className="text-3xl font-paint text-navy flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" /> Rhythm Bag
            </h2>
            <div className="space-y-3">
              {rhythmTricks.length === 0 ? (
                <p className="text-navy/50 italic">Your rhythm bag is empty. Find some groove!</p>
              ) : (
                rhythmTricks.map(trick => (
                  <div key={trick.id} className="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(trick.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${trick.status === 'Assimilated' ? 'bg-blue-500 border-blue-500' : 'border-navy/30'}`}
                      >
                        {trick.status === 'Assimilated' && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <span className={`font-bold ${trick.status === 'Assimilated' ? 'text-navy/50 line-through' : 'text-navy'}`}>
                        {trick.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                      {trick.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
