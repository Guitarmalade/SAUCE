import { createClient } from '@/utils/supabase/server'
import { Splat, SplatBackdrop } from '@/components/ui/Splats'
import { parseISO, subDays, format } from 'date-fns'
import Link from 'next/link'

// Helpers
function getHeatmapData(logs: any[]) {
  const today = new Date()
  const daysMap = new Map<string, { date: string, count: number, level: number }>()
  for (let i = 0; i <= 365; i++) {
    const d = subDays(today, i)
    const dateStr = format(d, 'yyyy-MM-dd')
    daysMap.set(dateStr, { date: dateStr, count: 0, level: 0 })
  }
  logs.forEach(log => {
    const dateStr = log.date
    if (daysMap.has(dateStr)) {
      const current = daysMap.get(dateStr)!
      const newCount = current.count + log.duration_minutes
      let newLevel = 0
      if (newCount >= 60) newLevel = 4
      else if (newCount >= 30) newLevel = 3
      else if (newCount >= 15) newLevel = 2
      else if (newCount > 0) newLevel = 1
      daysMap.set(dateStr, { date: dateStr, count: newCount, level: newLevel })
    }
  })
  return Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function calculateStreak(logs: any[]) {
  if (!logs || logs.length === 0) return 0
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  const firstLogDate = parseISO(sortedLogs[0].date)
  firstLogDate.setHours(0,0,0,0)
  const diffTime = Math.abs(currentDate.getTime() - firstLogDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays > 1) return 0
  let checkDate = new Date(firstLogDate)
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = parseISO(sortedLogs[i].date)
    logDate.setHours(0,0,0,0)
    if (logDate.getTime() === checkDate.getTime()) {
      if (i === 0 || sortedLogs[i-1].date !== sortedLogs[i].date) {
        streak++
        checkDate = subDays(checkDate, 1)
      }
    } else if (logDate.getTime() < checkDate.getTime()) {
      break
    }
  }
  return streak
}

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('users').select('name').eq('id', user?.id).single()
  
  const { data: logs } = await supabase
    .from('practice_logs')
    .select('*')
    .eq('student_id', user?.id)
    .gte('date', format(subDays(new Date(), 365), 'yyyy-MM-dd'))
    .order('date', { ascending: false })

  const heatmapData = getHeatmapData(logs || [])
  const streak = calculateStreak(logs || [])
  const minsThisWeek = (logs || []).filter(l => new Date(l.date) > subDays(new Date(), 7)).reduce((acc, l) => acc + l.duration_minutes, 0)
  
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Student'

  const weeks = 28;
  const recentData = heatmapData.slice(- (weeks * 7));
  const cols = [];
  for (let w = 0; w < weeks; w++) {
    cols.push(recentData.slice(w * 7, (w + 1) * 7));
  }
  const heatmapColors = ["var(--cream-shadow)", "#FFE0A0", "var(--marmalade)", "#e09115", "var(--punch)"];
  const dayLabels = ["M", "", "W", "", "F", "", "S"];
  const months = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY"]; 

  return (
    <>
      <SplatBackdrop intensity="subtle" palette="warm" />
      <main className="shell workspace relative z-10">
        
        <section className="hero-bar">
          <div className="hero-title">
            <div className="back-pill bg-[var(--ink)] text-[var(--marmalade)] font-paint border-none shadow-[4px_4px_0_var(--punch)]">{firstName.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="drip-text text-[var(--ink)]">Dashboard</h1>
              <p>Keep the streak alive and move the method forward.</p>
            </div>
          </div>

          <div className="chip-row">
            <span className="chip">Level 1</span>
            <span className="chip text-[var(--punch)]">{streak} day streak</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="column">
            
            <article className="panel featured">
              <Splat.Burst color="var(--marmalade)" size={260} rotate={45} className="absolute -top-24 -right-20 opacity-25 pointer-events-none" />
              
              <div className="panel-heading">
                <span className="panel-icon bg-[var(--punch)] text-[var(--cream-warm)] border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">⌂</span>
                <h2 className="drip-text text-[var(--ink)]">Today's Recipe</h2>
              </div>
              <p className="panel-copy">Master the classic 12-bar turnaround. Strict alternate picking, eyes <em>off</em> the fretboard.</p>
              
              <div className="stack-list mt-6">
                <div className="stack-line"><strong>A major note map</strong><span>Assimilate · 80 BPM</span></div>
                <div className="stack-line"><strong>Quarter-note grid</strong><span>Utilize · 76 BPM</span></div>
                <div className="stack-line"><strong>Major scale formula</strong><span>Assimilate · 72 BPM</span></div>
              </div>
              
              <div className="action-row">
                <Link className="button button-primary" href="/student/practice/123">Enter the Kitchen</Link>
                <Link className="button button-secondary" href="/student/roadmap">View Roadmap</Link>
              </div>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <span className="panel-icon border-2 border-[var(--ink)]">◎</span>
                <h2 className="drip-text text-[var(--ink)]">Practice Journey</h2>
              </div>
              
              <div className="flex gap-2 relative z-10 overflow-x-auto pb-2">
                <div className="flex flex-col gap-[3px] pt-[22px] text-[11px] font-bold text-[var(--muted)]">
                  {dayLabels.map((d, i) => <div key={i} className="h-[14px] leading-[14px]">{d}</div>)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-extrabold text-[var(--muted)] tracking-[.12em] mb-1 min-w-[600px]">
                    {months.map((m, i) => <div key={i}>{m}</div>)}
                  </div>
                  <div className="grid gap-[3px] min-w-[600px]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
                    {cols.map((col, ci) => (
                      <div key={ci} className="flex flex-col gap-[3px]">
                        {col.map((day, ri) => (
                          <div key={ri} title={`${day?.date || ''}: ${day?.count || 0} min`}
                            className="w-full aspect-square rounded-[4px] transition-transform hover:scale-110 cursor-pointer"
                            style={{ background: heatmapColors[day?.level || 0] }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            
          </div>

          <aside className="column">
            <article className="panel">
              <Splat.Specks color="var(--cyan)" size={140} seed={7} className="absolute top-5 right-8 opacity-25 pointer-events-none" />
              
              <div className="section-label">Profile Snapshot</div>
              <div className="mini-stat-grid">
                <div className="mini-stat"><strong className="num-display">{firstName}</strong><span>student</span></div>
                <div className="mini-stat"><strong className="num-display">1</strong><span>highest unlocked</span></div>
                <div className="mini-stat"><strong className="num-display">{minsThisWeek}</strong><span>weekly minutes</span></div>
                <div className="mini-stat"><strong className="num-display">{logs?.length || 0}</strong><span>sessions logged</span></div>
              </div>
            </article>

            <article className="tip-panel cool">
              <h2 className="drip-text text-[var(--punch)]">Current Focus</h2>
              <p>Complete every level 1 area at least once with confidence 4 or higher.</p>
            </article>

            <article className="panel">
              <div className="section-label">Access</div>
              <p className="panel-copy">Full curriculum access is available.</p>
              <div className="section-label mt-6">Next Checkpoint</div>
              <p className="panel-copy">Reach level 2 in rhythm and theory to unlock the intermediate tricks library.</p>
            </article>
          </aside>
        </section>
      </main>
    </>
  )
}
