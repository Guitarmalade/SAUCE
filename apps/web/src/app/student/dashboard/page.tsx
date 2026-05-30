import { createClient } from '../../../utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { LogOut, Target, Clock, Music, Trophy, Sparkles, Map as MapIcon, Edit, Flame, Briefcase, Activity } from 'lucide-react'
import Link from 'next/link'
import LogKitchen from './LogKitchen'
import PracticeHistoryTable from './PracticeHistoryTable'
import { Splat, SplatBackdrop } from '@/components/ui/Splats'
import { parseISO, subDays, format } from 'date-fns'

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

// Components
const StreakHero = ({ days = 1 }) => {
  return (
    <div className="relative rounded-[var(--r-xl)] bg-gradient-to-br from-[#14182E] to-[#1E2447] text-[var(--cream-warm)] p-7 overflow-hidden min-h-[340px] shadow-[var(--shadow-pop)] border-4 border-[var(--ink)]">
      <div className="absolute -top-20 -right-16 opacity-35"><Splat.Burst color="#E63678" size={280} rotate={20}/></div>
      <div className="absolute -bottom-10 -left-5 opacity-25"><Splat.Drip color="#F5A623" size={200} rotate={180}/></div>
      <div className="absolute top-16 right-20 opacity-40"><Splat.Specks color="#FCF6E8" size={180} seed={9}/></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="text-[11px] uppercase tracking-[.22em] font-extrabold text-[var(--marmalade)]">
          🔥 Current streak
        </div>
        <div className="px-3 py-1 bg-[rgba(245,166,35,.15)] text-[var(--marmalade)] rounded-full text-[11px] font-extrabold tracking-[.08em]">
          PERSONAL BEST: 14 DAYS
        </div>
      </div>

      <div className="relative mt-5 z-10">
        <div className="drip-text text-[220px] leading-[.82] text-[var(--marmalade)] tracking-[-0.02em] relative">
          {String(days).padStart(2, "0")}
        </div>
        <div className="absolute top-[165px] left-[30px] opacity-55 -z-10"><Splat.Drip color="#F5A623" size={110} /></div>
      </div>

      <div className="flex items-baseline justify-between mt-1 z-10 relative">
        <div className="drip-text text-[44px] text-[var(--cream-warm)]">
          day<span className="text-[var(--punch)]">s</span> hot
        </div>
        <div className="text-[13px] text-white/60 font-semibold leading-tight text-right">
          Practice today<br/>to keep it cookin'
        </div>
      </div>

      <div className="mt-5 flex gap-2 items-center relative z-10">
        {["M","T","W","T","F","S","S"].map((d, i) => {
          const done = i < days;
          const today = i === days;
          return (
            <div key={i} className={`flex-1 py-2 text-center rounded-xl font-extrabold text-[13px] border-2 ${
              done ? "bg-[var(--marmalade)] text-[var(--ink)] border-transparent" : 
              today ? "bg-[rgba(245,166,35,.15)] text-[var(--cream-warm)] border-dashed border-[var(--marmalade)]" : 
              "bg-white/5 text-[var(--cream-warm)] border-transparent"
            }`}>
              <div className="text-[10px] opacity-70">{d}</div>
              <div className="mt-0.5">{done ? "✓" : today ? "•" : "—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FocusCard = ({ title }: { title: string }) => {
  return (
    <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8 min-h-[340px] flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none">
        <Splat.Burst color="var(--marmalade)" size={260} rotate={45} className="absolute -top-24 -right-20 opacity-25" />
        <Splat.Specks color="var(--punch)" size={120} seed={4} className="absolute top-40 right-10 opacity-45" />
      </div>

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--marmalade)] flex items-center justify-center text-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="label-eyebrow">Today's recipe</div>
              <h3 className="drip-text text-[40px] leading-none mt-1 text-[var(--ink)]">{title}</h3>
            </div>
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(20,26,54,.06)] border-2 border-[rgba(20,26,54,.1)] rounded-full text-[13px] font-bold text-[var(--ink)]"><Clock className="w-4 h-4"/> 15 min</div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(20,26,54,.06)] border-2 border-[rgba(20,26,54,.1)] rounded-full text-[13px] font-bold text-[var(--ink)]"><Activity className="w-4 h-4"/> 90 BPM</div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(20,26,54,.06)] border-2 border-[rgba(20,26,54,.1)] rounded-full text-[13px] font-bold text-[var(--ink)]"><Music className="w-4 h-4"/> E minor pentatonic</div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--punch)] text-[var(--cream-warm)] rounded-full text-[13px] font-bold"><Trophy className="w-4 h-4"/> +150 XP</div>
          </div>

          <p className="mt-4 text-[15px] text-[var(--ink-mid)] leading-relaxed max-w-xl font-medium">
            Master the classic 12-bar turnaround. Strict alternate picking, eyes <em>off</em> the fretboard. We'll loop the tricky changes at 75%.
          </p>
        </div>

        <div className="relative shrink-0 text-right">
          <div className="drip-text text-[72px] text-[var(--punch)] leading-[.9]">
            S<span className="text-[var(--marmalade)]">2</span>
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--ink-mid)] mt-1">
            SAUCE STAGE
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6 relative z-10">
        <Link href="/student/practice/123" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--ink)] text-[var(--cream-warm)] font-bold uppercase tracking-wider text-sm shadow-[0_8px_20px_rgba(20,24,46,.2)] hover:-translate-y-1 transition-all">
          <Flame className="w-4 h-4" /> Enter the Kitchen
        </Link>
        <Link href="/student/roadmap" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--ink)] text-[var(--ink)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--ink)] hover:text-white transition-all">
          <MapIcon className="w-4 h-4" /> View Roadmap
        </Link>
        <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--line)] text-[var(--ink-mid)] font-bold uppercase tracking-wider text-sm hover:bg-black/5 transition-all">
          <Edit className="w-4 h-4" /> Update Guitar DNA
        </Link>
        <Link href="/student/core" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--marmalade)] text-[var(--marmalade)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--marmalade)] hover:text-[var(--ink)] transition-all ml-auto">
          C.O.R.E. Specs
        </Link>
      </div>
    </div>
  );
};

const StatsMarquee = ({ logs }: { logs: any[] }) => {
  const minsThisWeek = logs.filter(l => new Date(l.date) > subDays(new Date(), 7)).reduce((acc, l) => acc + l.duration_minutes, 0)
  const xp = 2350 + (minsThisWeek * 10)
  
  const stats = [
    { label: "TOTAL XP", value: xp.toLocaleString(), accent: "var(--marmalade)", icon: Sparkles },
    { label: "MINUTES THIS WEEK", value: minsThisWeek.toString(), accent: "var(--punch)", icon: Clock },
    { label: "TRICKS LEARNED", value: "23", accent: "var(--cyan)", icon: Briefcase },
    { label: "S.A.U.C.E. STAGE", value: "S2", accent: "var(--acid)", icon: Flame },
    { label: "NEXT BADGE IN", value: "150 XP", accent: "var(--grape)", icon: Trophy },
  ];

  return (
    <div className="bg-[var(--ink)] rounded-[var(--r-lg)] p-5 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-0 relative overflow-hidden shadow-[var(--shadow-pop)]">
      <div className="absolute -top-5 left-[30%] opacity-15"><Splat.Streak color="var(--marmalade)" size={400} rotate={-8}/></div>
      {stats.map((s, i) => (
        <div key={i} className={`py-2 px-4 md:px-6 relative z-10 flex flex-col gap-1 ${i !== 0 ? 'md:border-l-[1.5px] border-white/10' : ''}`}>
          <div className="flex items-center gap-2">
            <s.icon className="w-3.5 h-3.5" style={{ color: s.accent }} />
            <span className="text-[10px] font-extrabold tracking-[.14em] text-white/55">{s.label}</span>
          </div>
          <div className="font-paint text-4xl text-[var(--cream-warm)] leading-none">{s.value}</div>
        </div>
      ))}
    </div>
  );
};

const PracticeJourney = ({ heatmapData }: { heatmapData: any[] }) => {
  const weeks = 28;
  const recentData = heatmapData.slice(- (weeks * 7));
  
  // Reshape into cols of 7 days
  const cols = [];
  for (let w = 0; w < weeks; w++) {
    cols.push(recentData.slice(w * 7, (w + 1) * 7));
  }

  const colors = ["var(--cream-shadow)", "#FFE0A0", "var(--marmalade)", "#e09115", "var(--punch)"];
  const dayLabels = ["M", "", "W", "", "F", "", "S"];
  const months = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY"]; // hardcoded for mockup aesthetic
  
  const totalMins = heatmapData.reduce((acc, d) => acc + d.count, 0)

  return (
    <div className="relative rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8">
      <div className="absolute top-5 right-8 opacity-25 pointer-events-none">
        <Splat.Specks color="var(--marmalade)" size={140} seed={7} />
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <h2 className="drip-text text-[34px] text-[var(--punch)]">Your Practice Journey</h2>
        <div className="text-right">
          <div className="num-display text-[38px] text-[var(--ink)] leading-none">{cols[weeks-1]?.reduce((a:any,b:any)=>a+b.count,0) || 0}</div>
          <div className="text-[11px] font-extrabold tracking-[.16em] uppercase text-[var(--ink-mid)] mt-1 leading-tight">
            minutes this week<br/>+42% vs last
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2 relative z-10">
        <div className="flex flex-col gap-1.5 pt-[22px] text-[11px] font-bold text-[var(--ink-mid)]">
          {dayLabels.map((d, i) => <div key={i} className="h-[18px] leading-[18px]">{d}</div>)}
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex justify-between text-[10px] font-extrabold text-[var(--ink-mid)] tracking-[.12em] mb-1.5 min-w-[600px]">
            {months.map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <div className="grid gap-1 min-w-[600px]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-1">
                {col.map((day, ri) => (
                  <div key={ri} title={`${day?.date || ''}: ${day?.count || 0} min`}
                    className="w-full aspect-square rounded-[6px] transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      background: colors[day?.level || 0],
                      transform: (day?.level || 0) > 2 ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 relative z-10">
        <div className="text-[13px] text-[var(--ink-mid)] font-semibold">
          <span className="drip-text text-[22px] text-[var(--ink)] mr-2">{Math.floor(totalMins/60)} hrs</span> practiced this year
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--ink-mid)]">
          <span>LESS</span>
          <div className="flex gap-1">
            {colors.map((c, i) => <div key={i} className="w-3.5 h-3.5 rounded-[4px]" style={{ background: c }}/>)}
          </div>
          <span>MORE</span>
        </div>
      </div>
    </div>
  );
};


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
  
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Student'

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      <SplatBackdrop intensity="subtle" palette="warm" />

      <header className="relative z-20 backdrop-blur-md bg-white/80 border-b border-[var(--line)] sticky top-0">
        <div className="max-w-[1320px] mx-auto px-10 md:px-14 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--ink)] text-[var(--marmalade)] rounded-2xl flex items-center justify-center font-paint text-2xl shadow-[3px_3px_0_var(--punch)]">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[var(--blue)]">
                {format(new Date(), 'EEEE, MMMM do')}
              </div>
              <h1 className="text-3xl font-paint text-[var(--ink)] leading-none mt-0.5">Hey, <span className="text-[var(--marmalade)]">{firstName}</span>.</h1>
            </div>
          </div>
          <form action={logout}>
            <button title="Sign Out" className="p-3 text-[var(--ink-mid)] hover:text-[var(--punch)] hover:bg-[rgba(230,54,120,.1)] rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-14 py-8 space-y-7">
        
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(420px,1.1fr)_2fr] gap-6">
          <StreakHero days={streak} />
          <FocusCard title="12-Bar Blues in E" />
        </div>

        <StatsMarquee logs={logs || []} />

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6">
          <PracticeJourney heatmapData={heatmapData} />
          <LogKitchen />
        </div>

        <div className="mt-8 rounded-[var(--r-xl)] bg-white/95 border-2 border-[var(--line)] shadow-[var(--shadow-pop)] p-8">
          <h2 className="drip-text text-[34px] text-[var(--ink)] mb-6">Recent Sessions</h2>
          <PracticeHistoryTable logs={logs || []} />
        </div>
      </main>
    </div>
  )
}
