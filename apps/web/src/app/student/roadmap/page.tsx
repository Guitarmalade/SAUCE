import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle } from 'lucide-react'
import { Splat, SplatBackdrop } from '@/components/ui/Splats'

export default async function PersonalizedRoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const SKILL = {
    blues: "#F5A623", rock: "#E63678", theory: "#8B5BD6",
    ear: "#B6E94B", songwriting: "#2BC9E6", rhythm: "#FF5A3C",
  };

  const waypoints = [
    { id: "1", title: "Listen: B.B. King Live", stage: "S", skill: "blues", state: "done", x: 280, y: 220 },
    { id: "2", title: "Transcribe opening lick", stage: "S", skill: "blues", state: "done", x: 540, y: 320 },
    { id: "3", title: "Analyze blues scale shapes", stage: "S", skill: "theory", state: "done", x: 720, y: 470 },

    { id: "gateS", title: "S · Steal", stage: "S", isGate: true, state: "done", x: 500, y: 620 },

    { id: "4", title: "Spider warmup", stage: "A", skill: "rhythm", state: "done", x: 260, y: 760 },
    { id: "5", title: "12-Bar Blues in E", stage: "A", skill: "blues", state: "current", x: 500, y: 900 },
    { id: "6", title: "String bending fundamentals", stage: "A", skill: "rock", state: "next", x: 740, y: 980 },
    { id: "7", title: "Em pentatonic shapes", stage: "A", skill: "theory", state: "locked", x: 540, y: 1110 },

    { id: "gateA", title: "A · Assimilate", stage: "A", isGate: true, state: "locked", x: 280, y: 1250 },

    { id: "8", title: "2-5-1 progressions", stage: "U", skill: "theory", state: "locked", x: 500, y: 1380 },
    { id: "9", title: "Record over backing track", stage: "U", skill: "songwriting", state: "locked", x: 760, y: 1470 },
    { id: "10", title: "Ear: minor pentatonic intervals", stage: "U", skill: "ear", state: "locked", x: 520, y: 1620 },

    { id: "gateU", title: "U · Utilize", stage: "U", isGate: true, state: "locked", x: 260, y: 1740 },

    { id: "11", title: "Write a 12-bar in your voice", stage: "C", skill: "songwriting", state: "locked", x: 500, y: 1860 },
    { id: "12", title: "Craft a solo over Em", stage: "C", skill: "songwriting", state: "locked", x: 740, y: 1940 },

    { id: "gateC", title: "C · Compose", stage: "C", isGate: true, state: "locked", x: 500, y: 2060 },

    { id: "13", title: "Open mic night", stage: "E", skill: "rock", state: "locked", x: 280, y: 2190 },
    { id: "14", title: "Record & release a track", stage: "E", skill: "songwriting", state: "locked", x: 520, y: 2280 },
    { id: "15", title: "Book your first gig", stage: "E", skill: "rock", state: "locked", x: 500, y: 2400, isFinal: true },
  ];

  const path = waypoints.reduce((acc, w, i) => {
    if (i === 0) return `M ${w.x} ${w.y}`;
    const prev = waypoints[i - 1];
    if (!prev) return acc;
    const cx1 = prev.x;
    const cy1 = (prev.y + w.y) / 2;
    const cx2 = w.x;
    const cy2 = (prev.y + w.y) / 2;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${w.x} ${w.y}`;
  }, "");

  const currentIdx = waypoints.findIndex(w => w.state === "current");
  const donePath = waypoints.slice(0, currentIdx + 1).reduce((acc, w, i) => {
    if (i === 0) return `M ${w.x} ${w.y}`;
    const prev = waypoints[i - 1];
    if (!prev) return acc;
    const cx1 = prev.x;
    const cy1 = (prev.y + w.y) / 2;
    const cx2 = w.x;
    const cy2 = (prev.y + w.y) / 2;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${w.x} ${w.y}`;
  }, "");

  const VBW = 1000, VBH = 2500;

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden pb-20">
      <SplatBackdrop intensity="subtle" palette="warm" />

      {/* Header */}
      <header className="relative z-20 backdrop-blur-md bg-white/80 border-b border-[var(--line)] sticky top-0">
        <div className="max-w-[1320px] mx-auto px-6 md:px-14 h-24 flex items-center gap-6">
          <Link href="/student/dashboard" className="p-3 text-[var(--ink-mid)] hover:text-[var(--punch)] hover:bg-[rgba(230,54,120,.1)] rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[var(--marmalade)]">
              Personalized Path
            </div>
            <h1 className="text-3xl font-paint text-[var(--ink)] leading-none mt-0.5">
              Your <span className="text-[var(--punch)]">Roadmap</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-14 py-12">
        <div className="mb-10 text-center">
          <h1 className="drip-text text-[56px] text-[var(--ink)] leading-none">
            The <span className="text-[var(--marmalade)]">Journey</span>
          </h1>
          <p className="mt-3 text-[16px] text-[var(--ink-mid)] max-w-2xl mx-auto font-medium leading-relaxed">
            Every node is a recipe. Cook them in order — earn the next one by completing the last.
          </p>
        </div>

        {/* Progress summary card */}
        <div className="relative mb-12 p-6 bg-[var(--cream-warm)] rounded-[var(--r-lg)] border-2 border-[var(--cream-shadow)] grid grid-cols-2 md:grid-cols-5 gap-3 overflow-hidden shadow-sm">
          <Splat.Specks color="var(--marmalade)" size={140} seed={4} className="absolute top-0 right-0 opacity-30 pointer-events-none"/>
          
          {[
            { code: "S", name: "Steal", done: 3, total: 3, color: SKILL.songwriting },
            { code: "A", name: "Assimilate", done: 1, total: 4, color: SKILL.blues, current: true },
            { code: "U", name: "Utilize", done: 0, total: 3, color: SKILL.ear },
            { code: "C", name: "Compose", done: 0, total: 2, color: SKILL.theory },
            { code: "E", name: "Experience", done: 0, total: 3, color: SKILL.rock },
          ].map((s, i) => (
            <div key={i} className="p-3 md:p-4 rounded-2xl relative z-10 transition-all" style={{
              background: s.current ? "var(--ink)" : "transparent",
              color: s.current ? "var(--cream-warm)" : "var(--ink)",
              border: s.current ? `2.5px solid ${s.color}` : "1.5px solid var(--cream-shadow)",
            }}>
              <div className="flex items-center gap-2">
                <div className="drip-text text-[28px] leading-none" style={{ color: s.color }}>{s.code}</div>
                <div className="text-[12px] font-extrabold tracking-[.06em]">{s.name}</div>
              </div>
              <div className="mt-2 text-[11px] font-bold opacity-70">
                {s.done} / {s.total} recipes
              </div>
              <div className="h-1.5 mt-1 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${(s.done / s.total) * 100}%`, background: s.color }}/>
              </div>
            </div>
          ))}
        </div>

        {/* THE PATH SVG */}
        <div className="relative w-full max-w-[900px] mx-auto overflow-hidden sm:overflow-visible">
          <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-[150%] sm:w-full h-auto block -ml-[25%] sm:ml-0">
            {/* dashed underlay path (full) */}
            <path d={path} fill="none" stroke="var(--cream-shadow)" strokeWidth="22" strokeLinecap="round" strokeDasharray="6 18" />
            
            {/* solid done path overlay */}
            <path d={donePath} fill="none" stroke="var(--marmalade)" strokeWidth="22" strokeLinecap="round" />

            {/* Drip from end of done path */}
            {waypoints[currentIdx] && (
              <>
                <circle cx={waypoints[currentIdx].x} cy={waypoints[currentIdx].y + 22} r="8" fill="var(--marmalade)" opacity=".6"/>
                <circle cx={waypoints[currentIdx].x - 18} cy={waypoints[currentIdx].y + 38} r="5" fill="var(--marmalade)" opacity=".4"/>
              </>
            )}

            {/* Decorative paint splatters across map */}
            <g opacity=".22" transform="translate(80, 100)">
              <circle r="40" fill={SKILL.blues}/>
            </g>
            <g opacity=".18" transform="translate(880, 1500)">
              <circle r="55" fill={SKILL.rock}/>
            </g>

            {/* Waypoints as SVG circles + foreign labels */}
            {waypoints.map((w) => {
              const c = w.skill ? (SKILL as any)[w.skill] : "var(--marmalade)";
              const r =
                w.isFinal ? 60 :
                w.isGate ? 50 :
                w.state === "current" ? 44 :
                36;
              const fill =
                w.state === "done" ? c :
                w.state === "current" ? c :
                w.state === "next" ? "var(--cream-warm)" :
                "var(--cream-shadow)";
              const stroke =
                w.state === "done" ? "var(--ink)" :
                w.state === "current" ? "var(--ink)" :
                w.state === "next" ? c :
                "var(--ink-faint)";
                
              return (
                <g key={w.id}>
                  {/* halo for current */}
                  {w.state === "current" && (
                    <>
                      <circle cx={w.x} cy={w.y} r={r + 22} fill="none" stroke={c} strokeWidth="3" opacity=".5">
                        <animate attributeName="r" from={r + 8} to={r + 38} dur="1.8s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from=".7" to="0" dur="1.8s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx={w.x} cy={w.y} r={r + 12} fill={c} opacity=".25"/>
                    </>
                  )}

                  <Link href={w.state !== "locked" ? "/student/practice/123" : "#"}>
                    <circle cx={w.x} cy={w.y} r={r} fill={fill} stroke={stroke}
                      strokeWidth={w.state === "current" ? 5 : w.state === "next" ? 4 : 3.5}
                      strokeDasharray={w.state === "locked" ? "4 5" : "none"}
                      className={w.state !== "locked" ? "cursor-pointer transition-transform hover:scale-105" : "cursor-not-allowed"}
                      style={{ transformOrigin: `${w.x}px ${w.y}px` }}
                    />
                  </Link>

                  {/* icon/check/lock inside */}
                  <g transform={`translate(${w.x}, ${w.y})`} pointerEvents="none">
                    {w.state === "done" && !w.isGate && !w.isFinal && (
                      <path d="M -10 0 L -3 8 L 12 -8" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {w.state === "locked" && !w.isGate && !w.isFinal && (
                      <g>
                        <rect x="-8" y="-2" width="16" height="13" rx="2" fill="var(--ink-faint)"/>
                        <path d="M -5 -2 V -7 a 5 5 0 0 1 10 0 V -2" fill="none" stroke="var(--ink-faint)" strokeWidth="2.5"/>
                      </g>
                    )}
                    {w.state === "current" && (
                      <text textAnchor="middle" dominantBaseline="central"
                        style={{ fontFamily: "var(--font-paint)", fontSize: 38, fill: "var(--ink)" }}>
                        ▶
                      </text>
                    )}
                    {w.isGate && (
                      <text textAnchor="middle" dominantBaseline="central"
                        style={{ fontFamily: "var(--font-paint)", fontSize: 44, fill: w.state === "done" ? "var(--cream-warm)" : "var(--ink-faint)" }}>
                        {w.stage}
                      </text>
                    )}
                    {w.isFinal && (
                      <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 60 }}>
                        🏆
                      </text>
                    )}
                  </g>

                  {/* Waypoint label */}
                  {!w.isGate && (
                    <g className={w.state !== "locked" ? "cursor-pointer" : "cursor-not-allowed"}>
                      <rect
                        x={w.x + r + 16}
                        y={w.y - 22}
                        width="240" height="44" rx="12"
                        fill={w.state === "current" ? "var(--ink)" : "var(--cream-warm)"}
                        stroke={w.state === "current" ? c : "var(--cream-shadow)"}
                        strokeWidth={w.state === "current" ? 3 : 2}
                        opacity={w.state === "locked" ? .6 : 1}
                      />
                      <text
                        x={w.x + r + 30}
                        y={w.y - 4}
                        style={{
                          fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 11, letterSpacing: ".12em",
                          fill: w.state === "current" ? c : "var(--ink-mid)",
                        }}>
                        {w.state === "current" ? "▶ NOW PLAYING" : w.state === "next" ? "UP NEXT" : w.stage + " · " + (w.state === "done" ? "DONE" : "LOCKED")}
                      </text>
                      <text
                        x={w.x + r + 30}
                        y={w.y + 14}
                        style={{
                          fontFamily: "var(--font-paint)", fontSize: 18,
                          fill: w.state === "current" ? "var(--cream-warm)" : "var(--ink)",
                          opacity: w.state === "locked" ? .55 : 1,
                        }}>
                        {w.title.length > 24 ? w.title.slice(0, 22) + "…" : w.title}
                      </text>
                    </g>
                  )}
                  {/* Gate label */}
                  {w.isGate && (
                    <g pointerEvents="none">
                      <text x={w.x} y={w.y + r + 26} textAnchor="middle" style={{
                        fontFamily: "var(--font-paint)", fontSize: 24,
                        fill: w.state === "done" ? "var(--ink)" : "var(--ink-faint)",
                      }}>{w.title}</text>
                      <text x={w.x} y={w.y + r + 46} textAnchor="middle" style={{
                        fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 10, letterSpacing: ".18em",
                        fill: w.state === "done" ? "var(--marmalade-deep)" : "var(--ink-faint)",
                      }}>{w.state === "done" ? "✓ STAGE CLEARED" : "STAGE LOCKED"}</text>
                    </g>
                  )}

                  {/* "YOU ARE HERE" tag for current */}
                  {w.state === "current" && (
                    <g transform={`translate(${w.x - 100}, ${w.y - 80})`} pointerEvents="none">
                      <path d="M 0 0 L 80 0 L 75 16 L 0 16 Z" fill={c} stroke="var(--ink)" strokeWidth="2.5"/>
                      <text x="40" y="11" textAnchor="middle" style={{
                        fontFamily: "var(--font-sans)", fontWeight: 900, fontSize: 10, letterSpacing: ".14em",
                        fill: "var(--ink)",
                      }}>YOU ARE HERE</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Start marker at top */}
            <g transform="translate(280, 100)">
              <rect x="-50" y="-22" width="100" height="32" rx="8" fill="var(--ink)" stroke="var(--marmalade)" strokeWidth="3"/>
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" style={{
                fontFamily: "var(--font-paint)", fontSize: 20, fill: "var(--marmalade)",
              }}>START</text>
            </g>
          </svg>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <Link href="/student/practice/123" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-br from-[#4e86ff] to-[var(--blue)] text-white font-bold uppercase tracking-wider text-sm shadow-[0_18px_34px_rgba(63,116,248,0.2)] hover:-translate-y-1 transition-all border-2 border-[var(--blue)]">
            <PlayCircle className="w-5 h-5" /> Cook your current recipe
          </Link>
        </div>
      </main>
    </div>
  )
}
