'use client'

import { useEffect, useState } from 'react'
import { Plus, Check, Target, Music } from 'lucide-react'
import { SplatBackdrop, Splat } from '@/components/ui/Splats'

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
        const initialTricks: Trick[] = selectedTricks.map((t: string, i: number) => ({
          id: `quiz-trick-${i}`,
          category: 'Lead' as const,
          title: t,
          status: 'Learning' as const
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
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden pb-24">
      <SplatBackdrop intensity="medium" palette="warm" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-14 pt-16">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16 relative">
          <Splat.Specks color="var(--punch)" size={140} seed={5} className="absolute -top-10 left-[40%] opacity-20 pointer-events-none" />
          <h1 className="drip-text text-[64px] text-[var(--ink)] leading-[0.9]">
            Bag O' <span className="text-[var(--marmalade)]">Tricks</span>
          </h1>
          <p className="text-[16px] font-medium text-[var(--ink-mid)] max-w-2xl mx-auto">
            The collection of vocabulary you are currently stealing, assimilating, and utilizing.
          </p>
        </div>

        {/* Add New Trick */}
        <form onSubmit={handleAddTrick} className="relative bg-[var(--cream-warm)] rounded-[var(--r-lg)] p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center max-w-3xl mx-auto border-[3px] border-[var(--ink)] shadow-[var(--shadow-pop)] mb-16">
          <Splat.Streak color="var(--marmalade)" size={120} className="absolute -top-6 -right-6 -z-10 opacity-40 transform rotate-12" />
          
          <div className="relative w-full md:w-auto">
            <select 
              value={newTrickCategory}
              onChange={(e) => setNewTrickCategory(e.target.value as 'Lead'|'Rhythm')}
              className="w-full appearance-none px-5 py-4 bg-white border-2 border-[var(--cream-shadow)] rounded-xl focus:outline-none focus:border-[var(--ink)] text-[var(--ink)] font-extrabold cursor-pointer"
            >
              <option value="Lead">🎸 Lead</option>
              <option value="Rhythm">🥁 Rhythm</option>
            </select>
          </div>
          
          <input 
            type="text" 
            placeholder="e.g. SRV Texas Flood Turnaround"
            value={newTrickTitle}
            onChange={(e) => setNewTrickTitle(e.target.value)}
            className="flex-1 px-5 py-4 bg-white border-2 border-[var(--cream-shadow)] rounded-xl focus:outline-none focus:border-[var(--ink)] text-[var(--ink)] font-bold w-full placeholder:text-[var(--ink-faint)]"
          />
          
          <button type="submit" className="w-full md:w-auto px-8 py-4 rounded-xl bg-[var(--punch)] text-[var(--cream-warm)] font-black uppercase tracking-wider text-sm border-none shadow-[4px_4px_0_var(--ink)] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer">
            <Plus className="w-5 h-5" /> Add
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LEAD BAG */}
          <div className="space-y-6">
            <h2 className="drip-text text-[38px] text-[var(--ink)] flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-[var(--marmalade)] text-white flex items-center justify-center shadow-[4px_4px_0_var(--ink)] border-2 border-[var(--ink)]">
                <Target className="w-7 h-7" />
              </span>
              Lead Bag
            </h2>
            
            <div className="space-y-4">
              {leadTricks.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-[var(--ink-faint)] rounded-2xl text-center">
                  <p className="text-[var(--ink-mid)] font-bold">Your lead bag is empty. Start stealing!</p>
                </div>
              ) : (
                leadTricks.map(trick => (
                  <div key={trick.id} className="group relative bg-[var(--cream-warm)] p-5 rounded-[var(--r-md)] border-2 border-[var(--cream-shadow)] hover:border-[var(--marmalade)] transition-colors flex items-center justify-between shadow-sm hover:shadow-[4px_4px_0_var(--ink)]">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(trick.id)}
                        className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all ${trick.status === 'Assimilated' ? 'bg-[var(--marmalade)] border-[var(--marmalade)]' : 'border-[var(--ink-faint)] hover:border-[var(--marmalade)]'}`}
                      >
                        {trick.status === 'Assimilated' && <Check className="w-4 h-4 text-[var(--cream-warm)] stroke-[4]" />}
                      </button>
                      <span className={`font-extrabold text-[15px] transition-all ${trick.status === 'Assimilated' ? 'text-[var(--ink-faint)] line-through' : 'text-[var(--ink)]'}`}>
                        {trick.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[.1em] px-3 py-1.5 rounded-lg ${trick.status === 'Assimilated' ? 'bg-[var(--marmalade)] text-white' : 'bg-[var(--cream-shadow)] text-[var(--ink-mid)]'}`}>
                      {trick.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RHYTHM BAG */}
          <div className="space-y-6">
            <h2 className="drip-text text-[38px] text-[var(--ink)] flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-[var(--cyan)] text-white flex items-center justify-center shadow-[4px_4px_0_var(--ink)] border-2 border-[var(--ink)]">
                <Music className="w-7 h-7" />
              </span>
              Rhythm Bag
            </h2>
            
            <div className="space-y-4">
              {rhythmTricks.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-[var(--ink-faint)] rounded-2xl text-center">
                  <p className="text-[var(--ink-mid)] font-bold">Your rhythm bag is empty. Find some groove!</p>
                </div>
              ) : (
                rhythmTricks.map(trick => (
                  <div key={trick.id} className="group relative bg-[var(--cream-warm)] p-5 rounded-[var(--r-md)] border-2 border-[var(--cream-shadow)] hover:border-[var(--cyan)] transition-colors flex items-center justify-between shadow-sm hover:shadow-[4px_4px_0_var(--ink)]">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(trick.id)}
                        className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all ${trick.status === 'Assimilated' ? 'bg-[var(--cyan)] border-[var(--cyan)]' : 'border-[var(--ink-faint)] hover:border-[var(--cyan)]'}`}
                      >
                        {trick.status === 'Assimilated' && <Check className="w-4 h-4 text-[var(--cream-warm)] stroke-[4]" />}
                      </button>
                      <span className={`font-extrabold text-[15px] transition-all ${trick.status === 'Assimilated' ? 'text-[var(--ink-faint)] line-through' : 'text-[var(--ink)]'}`}>
                        {trick.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[.1em] px-3 py-1.5 rounded-lg ${trick.status === 'Assimilated' ? 'bg-[var(--cyan)] text-white' : 'bg-[var(--cream-shadow)] text-[var(--ink-mid)]'}`}>
                      {trick.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
