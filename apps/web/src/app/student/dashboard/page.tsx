import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import PracticeLogForm from './PracticeLogForm'
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { format, subDays, isSameDay, parseISO } from 'date-fns'
import { LogOut, Target, BookOpen } from 'lucide-react'
import Link from 'next/link'
import PracticeHistoryTable from './PracticeHistoryTable'

// Map database logs to ActivityCalendar data format
function getHeatmapData(logs: any[]) {
  // Calendar expects an array of { date: 'YYYY-MM-DD', count: number, level: 0-4 }
  const today = new Date()
  const oneYearAgo = subDays(today, 365)
  
  // Initialize with empty days so the calendar fills out a whole year
  const daysMap = new Map<string, { date: string, count: number, level: number }>()
  
  for (let i = 0; i <= 365; i++) {
    const d = subDays(today, i)
    const dateStr = format(d, 'yyyy-MM-dd')
    daysMap.set(dateStr, { date: dateStr, count: 0, level: 0 })
  }

  logs.forEach(log => {
    const dateStr = log.date // YYYY-MM-DD
    if (daysMap.has(dateStr)) {
      const current = daysMap.get(dateStr)!
      const newCount = current.count + log.duration_minutes
      // Simple leveling logic: 0 min = 0, < 15 min = 1, < 30 min = 2, < 60 min = 3, >= 60 min = 4
      let newLevel = 0
      if (newCount >= 60) newLevel = 4
      else if (newCount >= 30) newLevel = 3
      else if (newCount >= 15) newLevel = 2
      else if (newCount > 0) newLevel = 1
      
      daysMap.set(dateStr, { date: dateStr, count: newCount, level: newLevel })
    }
  })

  // Calendar requires data sorted by date ascending
  return Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function calculateStreak(logs: any[]) {
  if (!logs || logs.length === 0) return 0
  
  // Sort logs descending by date
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  
  let streak = 0
  let currentDate = new Date()
  
  // Ensure we are working with just the date part for comparison
  currentDate.setHours(0, 0, 0, 0)
  
  // Check if they practiced today or yesterday to see if streak is currently active
  const firstLogDate = parseISO(sortedLogs[0].date)
  firstLogDate.setHours(0,0,0,0)
  
  const diffTime = Math.abs(currentDate.getTime() - firstLogDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 1) {
    return 0 // Streak lost, no practice today or yesterday
  }

  // Count backwards
  let checkDate = new Date(firstLogDate)
  
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = parseISO(sortedLogs[i].date)
    logDate.setHours(0,0,0,0)
    
    // If the log is for the day we are checking
    if (logDate.getTime() === checkDate.getTime()) {
      // It might have multiple logs per day, only increment streak if we haven't counted this day
      if (i === 0 || sortedLogs[i-1].date !== sortedLogs[i].date) {
        streak++
        checkDate = subDays(checkDate, 1)
      }
    } else if (logDate.getTime() < checkDate.getTime()) {
      // Gap in dates, streak over
      break
    }
  }
  
  return streak
}

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase.from('users').select('name').eq('id', user?.id).single()
  
  // Fetch practice logs
  const { data: logs } = await supabase
    .from('practice_logs')
    .select('*')
    .eq('student_id', user?.id)
    .gte('date', format(subDays(new Date(), 365), 'yyyy-MM-dd')) // get last year
    .order('date', { ascending: false })

  const heatmapData = getHeatmapData(logs || [])
  const streak = calculateStreak(logs || [])
  
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Student'

  const customTheme: ThemeInput = {
    light: ['#faf8f5', '#fde68a', '#f59e0b', '#d97706', '#b45309'],
    dark: ['#faf8f5', '#fde68a', '#f59e0b', '#d97706', '#b45309'],
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy leading-tight">Hey, {firstName}</h1>
              <p className="text-sm text-navy/60 font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
            </div>
          </div>
          <form action={logout}>
            <button title="Sign Out" className="p-2 text-navy/50 hover:text-navy hover:bg-gray-50 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Top Row: Streak and Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-gradient-to-br from-navy to-navy-700 rounded-3xl p-8 text-white shadow-xl shadow-navy/20 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-4">Current Streak</p>
              <div className="flex items-baseline gap-3">
                <span className="text-8xl font-paint tracking-tighter text-amber drop-shadow-md group-hover:scale-105 transition-transform origin-left">{streak}</span>
                <span className="text-2xl font-paint text-white/90 pb-2">days</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.276 0-3-2.204-3-4a1 1 0 0 1 2-0s1.5 2.5 4 2.5c2.5 0 3-1.8 3-4a1 1 0 0 0-2 0s-1 1.5-2.5 1.5c-1.5 0-3-2.5-3-2.5s-2.5 1.5-2.5 4a3.5 3.5 0 0 0 3.5 3.5z"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
            </div>
          </div>

          <div className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber/10 p-2.5 rounded-xl">
                <Target className="w-6 h-6 text-amber" />
              </div>
              <h3 className="text-2xl font-paint text-navy">Today's Focus</h3>
            </div>
            <p className="text-navy/80 font-medium text-lg leading-relaxed mb-6 max-w-xl">
              Your teacher hasn't pinned a specific exercise for today. Keep working through your current curriculum unit!
            </p>
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-navy/10">
              <Link href="/student/practice/123" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold bg-navy text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Enter The Kitchen
              </Link>
              <Link href="/student/roadmap" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold border-2 border-navy/10 text-navy hover:bg-navy/5 transition-all">
                View Roadmap
              </Link>
              <Link href="/quiz" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Update Guitar DNA
              </Link>
              <Link href="/student/tricks" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold border-2 border-amber text-amber hover:bg-amber/10 transition-all">
                Bag O' Tricks
              </Link>
              <Link href="/student/core" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold border-2 border-amber text-amber hover:bg-amber/10 transition-all ml-auto">
                <BookOpen className="w-4 h-4 mr-2" />
                C.O.R.E. Specs
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: Heatmap and Log Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-3xl p-6 sm:p-8 overflow-x-auto">
              <h2 className="text-2xl font-paint text-navy mb-8">Your Practice Journey</h2>
              <div className="min-w-[700px] pb-4">
                <ActivityCalendar 
                  data={heatmapData} 
                  theme={customTheme}
                  labels={{
                    totalCount: `{{count}} minutes logged in the last year`,
                  }}
                  showWeekdayLabels
                  colorScheme="light"
                  blockRadius={6}
                  blockSize={16}
                  blockMargin={6}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PracticeLogForm />
          </div>

        </div>

        {/* Practice History Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-paint text-navy mb-6">Recent Sessions</h2>
          <PracticeHistoryTable logs={logs || []} />
        </div>
      </main>
    </div>
  )
}
