
// sauce-v2-screens.jsx — All app screens for Guitarmalade SAUCE App v2

const { useState, useEffect, useRef } = React;

// ── Constants ──────────────────────────────────────────────────────────────────
const SAUCE = [
  { key:'S', label:'Study',     tag:'Steal',   color:'#FF3D00' },
  { key:'A', label:'Assimilate',tag:'',         color:'#FF6200' },
  { key:'U', label:'Utilize',   tag:'',         color:'#FF8C00' },
  { key:'C', label:'Compose',   tag:'',         color:'#FFAA00' },
  { key:'E', label:'Elevate',   tag:'',         color:'#FFD600' },
];

const PLAYER_LEVELS = [
  { min:0,    max:500,      rank:'Apprentice Chef' },
  { min:500,  max:1500,     rank:'Line Cook'       },
  { min:1500, max:3500,     rank:'Sous Chef'       },
  { min:3500, max:7000,     rank:'Head Chef'       },
  { min:7000, max:Infinity, rank:'SAUCE Master'    },
];

const PRACTICE_PATH = [
  { id:'fretboard', label:'Fretboard', sublabel:'Notes & scale positions',  mins:5,  color:'#FF3D00' },
  { id:'theory',    label:'Theory',    sublabel:'Intervals & harmony',       mins:8,  color:'#FF6200' },
  { id:'technique', label:'Technique', sublabel:'Legato, bends, vibrato',    mins:7,  color:'#FF8C00' },
  { id:'rhythm',    label:'Rhythm',    sublabel:'Groove & chord voicings',   mins:5,  color:'#FFAA00' },
  { id:'blastoff',  label:'BLAST OFF', sublabel:'Improvise & record!',       mins:10, color:'#FFD600' },
];

const BAG_OF_TRICKS = [
  { id:'cycling',      name:'Cycling Lick',          desc:'Repetitive, high-energy patterns',      level:1, file:'cycling_lick.gp5' },
  { id:'abac',         name:'ABAC Motif',             desc:'Statement with melodic development',    level:1, file:'abac_motif.pdf'    },
  { id:'callresponse', name:'Call & Response',        desc:'Question and answer phrasing',          level:1, file:'call_response.pdf' },
  { id:'cascade',      name:'Cascading Pent Run',     desc:'Flowing pentatonic waterfall',          level:2, file:'cascade.gp5'       },
  { id:'doublestop',   name:'Double Stop Slides',     desc:'Soulful sliding intervals',             level:2, file:'dbl_stop.pdf'      },
  { id:'turnaround',   name:'Turnaround Licks',       desc:'Nailing the landing of the form',       level:2, file:'turnaround.gp5'    },
  { id:'unison',       name:'Unison Bends',           desc:'Classic blues screaming sustain',       level:2, file:'unison_bend.gp5'   },
  { id:'neosoul',      name:'Neo-Soul Hammer-ons',    desc:'Mayer/Fujita style tapping',            level:3, file:'neosoul.pdf'       },
  { id:'slidearps',    name:'2nps Sliding Arps',      desc:'2-note-per-string sweep arpeggios',     level:3, file:'slide_arps.gp5'    },
  { id:'diminished',   name:'Dim over Dom7',          desc:'Diminished lick over dominant 7',       level:4, file:'dim_dom7.pdf'      },
];

const CHORD_PROGRESSIONS = [
  { id:'blues12', label:'12-bar Blues',  desc:'I – IV – V blues shuffle'  },
  { id:'iivi',    label:'ii – V – I',    desc:'Jazz cadence'               },
  { id:'ivi',     label:'I – IV – V',    desc:'Classic rock/pop'           },
  { id:'mindes',  label:'i – VII – VI',  desc:'Natural minor descent'      },
  { id:'neo',     label:'Imaj7 – vi – ii – V', desc:'Neo-soul groove'     },
];

const KEYS = ['C','G','D','A','E','F','Bb','Eb'];

const SKILL_AREAS = [
  { id:'fretboard', label:'Fretboard', color:'#FF3D00' },
  { id:'theory',    label:'Theory',    color:'#FF6200' },
  { id:'technique', label:'Technique', color:'#FF8C00' },
  { id:'rhythm',    label:'Rhythm',    color:'#FFAA00' },
  { id:'ear',       label:'Ear',       color:'#FFD600' },
];

const PRO_TIPS = [
  "A chord is spelled 1-3-5-b7. Isolate 3-5-b7 and you have a diminished triad — use it for 'outside' sounds.",
  "Don't rush the turnaround. The landing is the most musical moment in the form.",
  "Vibrato is your voice. Develop it on every sustained note — width, speed, and timing are all yours to own.",
  "Record everything. The take you think is bad often has the best moments.",
  "Transcribe just 2 bars. Then play what you transcribed over every key.",
];

const THEMES = {
  kitchen: { bg:'#0D0800', surface:'#1A1200', surface2:'#221800', border:'#2E2000', accent:'#FF6200', accentDim:'#FF620020', text:'#FFF', textSub:'#997755', textMuted:'#3A2A10', radius:16, name:'The Kitchen', tag:'Warm & Encouraging' },
  stage:   { bg:'#040410', surface:'#08081A', surface2:'#0D0D22', border:'#16163A', accent:'#FF4500', accentDim:'#FF450020', text:'#FFF', textSub:'#7777BB', textMuted:'#222244', radius:10, name:'The Stage',   tag:'Electric & Bold'    },
  monk:    { bg:'#080808', surface:'#101010', surface2:'#141414', border:'#1E1E1E', accent:'#FF6200', accentDim:'#FF620015', text:'#FFF', textSub:'#666',    textMuted:'#222',    radius:8,  name:'Monk Mode',  tag:'One Thing. Now.'    },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getLevel(xp) {
  for (let i = PLAYER_LEVELS.length-1; i >= 0; i--)
    if (xp >= PLAYER_LEVELS[i].min) return { ...PLAYER_LEVELS[i], index: i };
  return { ...PLAYER_LEVELS[0], index:0 };
}
function projDate(skillAvg, hpw) {
  const hrs = Math.max(1,(10-skillAvg)*12);
  const wks = hrs / Math.max(0.5, hpw);
  const d = new Date('2026-04-24');
  d.setDate(d.getDate() + Math.round(wks*7));
  return d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
}
function fmt(s) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }

// ── Shared ─────────────────────────────────────────────────────────────────────
function SW({ children, theme, style }) {
  return <div style={{ height:'100%', display:'flex', flexDirection:'column', background:theme.bg, overflowY:'auto', ...style }}>{children}</div>;
}
function XPBar({ xp, theme }) {
  const lv = getLevel(xp);
  const next = PLAYER_LEVELS[Math.min(lv.index+1, PLAYER_LEVELS.length-1)];
  const pct = lv.index===PLAYER_LEVELS.length-1 ? 100 : (xp-lv.min)/(lv.max-lv.min)*100;
  return (
    <div style={{ padding:'10px 20px 0', display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:34,height:34,borderRadius:9,background:theme.accent,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
        <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:15,color:'#000' }}>{lv.index+1}</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.accent,fontWeight:700,letterSpacing:0.8 }}>{lv.rank}</span>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub }}>{xp.toLocaleString()} XP</span>
        </div>
        <div style={{ height:4,background:theme.surface2,borderRadius:2 }}>
          <div style={{ height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${theme.accent},#FFD600)`,borderRadius:2,transition:'width 0.8s ease' }} />
        </div>
      </div>
    </div>
  );
}

// ── Splash ─────────────────────────────────────────────────────────────────────
function SplashV2({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); },[]);
  return (
    <div onClick={onDone} style={{ height:'100%', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:20 }}>
      <div style={{ position:'relative' }}>
        <div style={{ width:88,height:88,borderRadius:22,background:'linear-gradient(135deg,#FF5500,#FF9900)', display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 48px #FF550066' }}>
          <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:36,color:'#000',letterSpacing:1 }}>GM</span>
        </div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:44,color:'#FFF',letterSpacing:4 }}>GUITARMALADE</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:'#FF6200',letterSpacing:6,marginTop:2 }}>S.A.U.C.E. METHOD</div>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:16 }}>
        {SAUCE.map((s,i) => (
          <div key={s.key} style={{ width:8,height:8,borderRadius:4,background:s.color,animation:`gmpulse 1.6s ease-in-out ${i*0.18}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes gmpulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}

// ── Assessment ─────────────────────────────────────────────────────────────────
function AssessmentScreen({ onDone, theme }) {
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState({fretboard:5,theory:4,technique:6,rhythm:5,ear:4});
  const [iam, setIam] = useState('');
  const [hpw, setHpw] = useState(5);
  const avg = Object.values(skills).reduce((a,b)=>a+b,0)/5;

  const steps = [
    () => (
      <div style={{ padding:'28px 20px', display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:46,color:theme.text,lineHeight:1 }}>
          SKILL<br /><span style={{ color:theme.accent }}>ASSESSMENT</span>
        </div>
        <p style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.textSub,lineHeight:1.5,marginBottom:8 }}>Be honest with yourself. This builds your personalized pathway and projected goal date.</p>
        {SKILL_AREAS.map(area => (
          <div key={area.id}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.text,fontWeight:600 }}>{area.label}</span>
              <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:18,color:area.color }}>{skills[area.id]}/10</span>
            </div>
            <div style={{ position:'relative',height:28,display:'flex',alignItems:'center' }}>
              <div style={{ width:'100%',height:5,background:theme.surface2,borderRadius:3 }}>
                <div style={{ height:'100%',width:`${skills[area.id]*10}%`,background:area.color,borderRadius:3,transition:'width .15s' }} />
              </div>
              <input type="range" min="0" max="10" value={skills[area.id]}
                onChange={e=>setSkills(s=>({...s,[area.id]:+e.target.value}))}
                style={{ position:'absolute',width:'100%',opacity:0,height:28,cursor:'pointer' }} />
            </div>
          </div>
        ))}
      </div>
    ),
    () => (
      <div style={{ padding:'28px 20px', display:'flex', flexDirection:'column', gap:18 }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:46,color:theme.text,lineHeight:1 }}>
          YOUR<br /><span style={{ color:theme.accent }}>DECLARATION</span>
        </div>
        <p style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.textSub,lineHeight:1.5 }}>
          Speak it as if it's already true. You'll read this before every single practice session.
        </p>
        <div style={{ background:theme.surface,borderRadius:theme.radius,padding:'16px 18px',border:`1px solid ${theme.border}`,borderLeft:`3px solid ${theme.accent}` }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.accent,letterSpacing:2,marginBottom:10,textTransform:'uppercase' }}>I Am So Thankful That I…</div>
          <textarea value={iam} onChange={e=>setIam(e.target.value)}
            placeholder="…play with confidence, deep musicality, and my own unmistakable voice."
            rows={4} style={{ width:'100%',background:'transparent',border:'none',outline:'none',fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:theme.text,resize:'none',lineHeight:1.6,caretColor:theme.accent }} />
        </div>
      </div>
    ),
    () => (
      <div style={{ padding:'28px 20px', display:'flex', flexDirection:'column', gap:18 }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:46,color:theme.text,lineHeight:1 }}>
          PRACTICE<br /><span style={{ color:theme.accent }}>COMMITMENT</span>
        </div>
        <div style={{ background:theme.surface,borderRadius:theme.radius,padding:'22px',border:`1px solid ${theme.border}`,textAlign:'center' }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:72,color:theme.accent,lineHeight:1 }}>{hpw}</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:theme.textSub,marginBottom:20 }}>hours / week</div>
          <input type="range" min="1" max="20" value={hpw} onChange={e=>setHpw(+e.target.value)} style={{ width:'100%',accentColor:theme.accent }} />
        </div>
        <div style={{ background:theme.surface,borderRadius:theme.radius,padding:'18px',border:`1px solid ${theme.border}` }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,marginBottom:8,textTransform:'uppercase' }}>Projected Goal Date</div>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:36,color:theme.accent,lineHeight:1 }}>{projDate(avg,hpw)}</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.textSub,marginTop:6 }}>Practice more — move it up ↑</div>
        </div>
      </div>
    ),
  ];

  return (
    <SW theme={theme}>
      <div style={{ padding:'14px 20px 8px', display:'flex', gap:6 }}>
        {steps.map((_,i)=>(
          <div key={i} style={{ flex:i<=step?2:1,height:3,borderRadius:2,background:i<=step?theme.accent:theme.surface2,transition:'all .3s' }} />
        ))}
      </div>
      <div style={{ flex:1,overflowY:'auto' }}>{steps[step]()}</div>
      <div style={{ padding:'14px 20px 24px',borderTop:`1px solid ${theme.border}` }}>
        <button onClick={()=>step<steps.length-1?setStep(step+1):onDone({skills,iam,hpw})} style={{
          width:'100%',height:52,borderRadius:theme.radius,border:'none',cursor:'pointer',
          background:`linear-gradient(135deg,${theme.accent},#FFD600)`,
          fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:'#000',
          boxShadow:`0 4px 20px ${theme.accent}44`,
        }}>{step<steps.length-1?'NEXT →':"LET'S COOK! →"}</button>
      </div>
    </SW>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function DashboardScreen({ profile, theme, onStartPractice, monkMode, onToggleMonk }) {
  const [checked, setChecked] = useState({});
  const xp = profile.xp||1240, streak = profile.streak||12;
  const tip = PRO_TIPS[Math.floor(Math.random()*PRO_TIPS.length)];

  return (
    <SW theme={theme}>
      <XPBar xp={xp} theme={theme} />
      {/* Header */}
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.textSub,letterSpacing:1,textTransform:'uppercase' }}>Good morning</div>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:30,color:theme.text,letterSpacing:1 }}>Today's Recipe</div>
        </div>
        <div style={{ display:'flex',gap:10,alignItems:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:28,color:theme.accent,lineHeight:1 }}>{streak}</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.textSub,letterSpacing:1 }}>STREAK</div>
          </div>
          <div onClick={onToggleMonk} title="Monk Mode" style={{
            width:38,height:38,borderRadius:10,cursor:'pointer',
            background:monkMode?theme.accent:theme.surface,
            border:`1px solid ${monkMode?theme.accent:theme.border}`,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,transition:'all .2s',
          }}>🎯</div>
        </div>
      </div>

      {/* I AM */}
      <div style={{ margin:'12px 20px 0', background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}`, borderLeft:`3px solid ${theme.accent}` }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.accent,letterSpacing:2,marginBottom:4,textTransform:'uppercase' }}>I AM</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub,lineHeight:1.4,fontStyle:'italic' }}>
          "{profile.iam||'I am so thankful that I play with confidence and my own unique voice.'}"
        </div>
      </div>

      {/* Monk mode highlight */}
      {monkMode && (
        <div style={{ margin:'10px 20px 0', background:theme.accentDim, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.accent}44` }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:14,color:theme.accent,letterSpacing:2,marginBottom:3 }}>🎯 MONK MODE — ONE THING</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.text,fontWeight:600 }}>Major Pentatonic — all 5 positions</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.textSub,marginTop:2 }}>Everything else is off the menu today</div>
        </div>
      )}

      {/* SAUCE strip */}
      <div style={{ margin:'12px 20px 0', background:theme.surface, borderRadius:theme.radius, border:`1px solid ${theme.border}`, display:'flex', overflow:'hidden' }}>
        {SAUCE.map((s,i) => {
          const active = i===(profile.sauceIndex||1), past=i<(profile.sauceIndex||1);
          return (
            <div key={s.key} style={{ flex:1, padding:'10px 0', textAlign:'center', background:active?`${s.color}18`:'transparent', borderRight:i<4?`1px solid ${theme.border}`:'none' }}>
              <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:18,color:active?s.color:past?'#444':theme.textMuted }}>{s.key}</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:7,color:active?s.color:theme.textMuted,letterSpacing:0.5 }}>{s.label}</div>
              {active&&<div style={{ width:4,height:4,borderRadius:2,background:s.color,margin:'3px auto 0' }} />}
            </div>
          );
        })}
      </div>

      {/* Today's path steps */}
      <div style={{ margin:'12px 20px 0' }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase',marginBottom:10 }}>Today's Path</div>
        <div style={{ display:'flex',gap:8 }}>
          {PRACTICE_PATH.map((step,i)=>{
            const done=!!checked[i];
            return (
              <div key={step.id} onClick={()=>setChecked(c=>({...c,[i]:!c[i]}))} style={{
                flex:1,background:done?`${step.color}20`:theme.surface,borderRadius:Math.min(theme.radius,12),
                padding:'10px 4px',textAlign:'center',cursor:'pointer',
                border:`1px solid ${done?step.color+'66':theme.border}`,transition:'all .2s',
              }}>
                <div style={{ fontSize:13,color:done?step.color:theme.textMuted,marginBottom:3 }}>{done?'✓':`${i+1}`}</div>
                <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:9,color:done?step.color:theme.textSub,lineHeight:1.2 }}>
                  {step.label.split(' ')[0]}
                </div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:8,color:theme.textMuted,marginTop:2 }}>{step.mins}m</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro Tip */}
      <div style={{ margin:'12px 20px 0', background:`${theme.accent}18`, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.accent}33` }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.accent,letterSpacing:2,marginBottom:6,textTransform:'uppercase',fontWeight:700 }}>Pro Tip</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub,lineHeight:1.5,fontStyle:'italic' }}>"{tip}"</div>
      </div>

      {/* Weekly challenge */}
      <div style={{ margin:'12px 20px 0', background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}` }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.accent,letterSpacing:2,marginBottom:3,textTransform:'uppercase' }}>Weekly Challenge</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.text,fontWeight:600 }}>Transcribe a 4-bar lick</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.textSub,marginTop:2 }}>+250 XP · 3 days left</div>
          </div>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:36,color:theme.accent }}>3</div>
        </div>
        <div style={{ marginTop:10,height:3,background:theme.surface2,borderRadius:2 }}>
          <div style={{ height:'100%',width:'40%',background:theme.accent,borderRadius:2 }} />
        </div>
      </div>

      {/* Start CTA */}
      <div style={{ padding:'16px 20px 28px' }}>
        <button onClick={onStartPractice} style={{
          width:'100%',height:54,borderRadius:theme.radius,border:'none',cursor:'pointer',
          background:`linear-gradient(135deg,${theme.accent},#FFD600)`,
          fontFamily:"'Bebas Neue',cursive",fontSize:24,letterSpacing:2,color:'#000',
          boxShadow:`0 4px 24px ${theme.accent}55`,
        }}>START COOKING →</button>
      </div>
    </SW>
  );
}

// ── Practice Mode Select ───────────────────────────────────────────────────────
function PracticeModeScreen({ onSelect, theme }) {
  return (
    <SW theme={theme}>
      <div style={{ padding:'22px 20px 14px' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:38,color:theme.text,letterSpacing:1,lineHeight:1 }}>
          CHOOSE YOUR<br /><span style={{ color:theme.accent }}>APPROACH</span>
        </div>
        <p style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.textSub,marginTop:8,lineHeight:1.5 }}>Two paths. Both end at the same destination.</p>
      </div>
      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:14 }}>
        <div onClick={()=>onSelect('review')} style={{ background:theme.surface,borderRadius:theme.radius,padding:'22px 18px',border:`1.5px solid ${theme.border}`,cursor:'pointer' }}>
          <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
            <div style={{ width:46,height:46,borderRadius:12,background:`${PRACTICE_PATH[0].color}25`,border:`1.5px solid ${PRACTICE_PATH[0].color}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <span style={{ fontSize:20 }}>🎸</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:22,color:theme.text,letterSpacing:1 }}>Review First</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub,marginTop:3,lineHeight:1.4 }}>
                Warmup exercises → theory → technique → rhythm → <strong style={{ color:theme.accent }}>BLAST OFF</strong>
              </div>
            </div>
          </div>
          <div style={{ display:'flex',gap:5,marginTop:14 }}>
            {PRACTICE_PATH.map((s,i)=><div key={i} style={{ flex:1,height:3,borderRadius:2,background:s.color,opacity:0.7 }} />)}
          </div>
        </div>

        <div onClick={()=>onSelect('end')} style={{ background:theme.surface,borderRadius:theme.radius,padding:'22px 18px',border:`1.5px solid ${theme.border}`,cursor:'pointer' }}>
          <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
            <div style={{ width:46,height:46,borderRadius:12,background:`${PRACTICE_PATH[4].color}25`,border:`1.5px solid ${PRACTICE_PATH[4].color}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <span style={{ fontSize:20 }}>🚀</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:22,color:theme.text,letterSpacing:1 }}>Begin at the End</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub,marginTop:3,lineHeight:1.4 }}>
                Start with a song or backing track — reverse-engineer only the warmup you actually need
              </div>
            </div>
          </div>
          <div style={{ display:'flex',gap:5,marginTop:14 }}>
            {[...PRACTICE_PATH].reverse().map((s,i)=><div key={i} style={{ flex:1,height:3,borderRadius:2,background:s.color,opacity:0.7 }} />)}
          </div>
        </div>

        <div style={{ background:theme.accentDim,borderRadius:theme.radius,padding:'14px 16px',border:`1px solid ${theme.accent}33`,display:'flex',gap:12,alignItems:'center' }}>
          <span style={{ fontSize:22,flexShrink:0 }}>🎯</span>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:15,color:theme.accent,letterSpacing:1 }}>MONK MODE ACTIVE?</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.textSub }}>Toggle from the dashboard to focus on ONE thing until it's mastered.</div>
          </div>
        </div>
      </div>
    </SW>
  );
}

// ── Active Practice ("Now Sizzling") ──────────────────────────────────────────
const MEDIA_TABS = [
  { id:'session',  label:'SESSION'  },
  { id:'tab',      label:'TAB'      },
  { id:'diagram',  label:'DIAGRAM'  },
  { id:'notation', label:'NOTATION' },
  { id:'video',    label:'VIDEO'    },
];

function ActivePracticeScreen({ mode, theme, onBlastOff }) {
  const path = mode==='end'?[...PRACTICE_PATH].reverse():PRACTICE_PATH;
  const [stepIdx,  setStepIdx]  = useState(0);
  const [running,  setRunning]  = useState(false);
  const [secs,     setSecs]     = useState(path[0].mins*60);
  const [stepDone, setStepDone] = useState({});
  const [mediaTab, setMediaTab] = useState('session');
  const [tasksDone,setTasksDone]= useState({});
  const [chordSel, setChordSel] = useState('Am');
  const [diagOri,  setDiagOri]  = useState('vertical');
  const [vidPlay,  setVidPlay]  = useState(false);
  const timerRef = useRef(null);

  const cur       = path[stepIdx];
  const totalSecs = cur.mins * 60;
  const pct       = (totalSecs - secs) / totalSecs;
  const isBlast   = cur.id === 'blastoff';

  useEffect(() => { setSecs(cur.mins*60); setRunning(false); setMediaTab('session'); }, [stepIdx]);
  useEffect(() => {
    if (running) timerRef.current = setInterval(() => setSecs(s => Math.max(0, s-1)), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [running]);

  const advance = () => {
    if (isBlast) { onBlastOff(); return; }
    setStepDone(d => ({...d, [stepIdx]: true}));
    setStepIdx(i => Math.min(i+1, path.length-1));
  };

  const sessionTasks = ['Internalize Tempo','Pocket & Feel','Intentional Ending','Melodic Repetition'];

  // Per-step content tips
  const stepTips = {
    fretboard: 'Find every instance of the root note across all 6 strings before playing any scale.',
    theory:    'Spell each chord out loud: root, 3rd, 5th. Connect the theory to sound.',
    technique: 'Isolate the hard part. Play it at 50% speed until it feels automatic.',
    rhythm:    "Lock in with the drums first — melody and harmony serve the groove.",
    blastoff:  'Use space. The notes you don\'t play are as important as the ones you do.',
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:theme.bg }}>

      {/* ── Fixed top: Now Sizzling header ── */}
      <div style={{ background:theme.surface, borderBottom:`1px solid ${theme.border}`, flexShrink:0 }}>
        <div style={{ padding:'12px 18px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:20, color:theme.accent, letterSpacing:1, lineHeight:1 }}>Now Sizzling…</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, marginTop:1 }}>{cur.label}{cur.sublabel ? ' · ' + cur.sublabel : ''}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ background:'#000', borderRadius:9, padding:'5px 11px', border:`1px solid ${theme.border}` }}>
              <span style={{ fontFamily:"'Bebas Neue',cursive", fontSize:17, color:running?cur.color:'#FFF', letterSpacing:2, transition:'color .3s' }}>{fmt(secs)}</span>
            </div>
            <button onClick={() => setRunning(r => !r)} style={{
              height:32, padding:'0 13px', borderRadius:8, border:'none', cursor:'pointer',
              background:running ? theme.surface2 : cur.color,
              color:running ? cur.color : '#000',
              fontFamily:"'Bebas Neue',cursive", fontSize:14, letterSpacing:1,
              boxShadow:running ? 'none' : `0 2px 10px ${cur.color}55`,
            }}>{running ? 'PAUSE' : 'START'}</button>
          </div>
        </div>

        {/* Step progress bar */}
        <div style={{ padding:'0 18px 10px', display:'flex', gap:4 }}>
          {path.map((s,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2,
              background: i < stepIdx ? s.color : i === stepIdx ? s.color : theme.surface2,
              opacity: i === stepIdx ? 1 : i < stepIdx ? 0.6 : 1, transition:'all .3s' }} />
          ))}
        </div>

        {/* Media sub-tabs */}
        <div style={{ display:'flex', borderTop:`1px solid ${theme.border}` }}>
          {MEDIA_TABS.map(t => (
            <div key={t.id} onClick={() => setMediaTab(t.id)} style={{
              flex:1, padding:'8px 0', textAlign:'center', cursor:'pointer',
              borderBottom:`2px solid ${mediaTab===t.id ? cur.color : 'transparent'}`,
              background: mediaTab===t.id ? `${cur.color}10` : 'transparent',
              transition:'all .2s',
            }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, fontWeight:700,
                letterSpacing:1, color: mediaTab===t.id ? cur.color : theme.textMuted }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* SESSION view */}
        {mediaTab === 'session' && (
          <div>
            {/* Step hero */}
            <div style={{ margin:'12px 18px 0', background:theme.surface, borderRadius:theme.radius, padding:'14px 16px', border:`1.5px solid ${cur.color}44`, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-24, right:-16, width:80, height:80, borderRadius:'50%', background:`${cur.color}08` }} />
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:11,background:cur.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 4px 14px ${cur.color}55` }}>
                  <span style={{ fontFamily:"'Bebas Neue',cursive", fontSize:20, color:'#000' }}>{stepIdx+1}</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:22, color:cur.color, letterSpacing:1 }}>{cur.label}</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub }}>{cur.sublabel}</div>
                </div>
              </div>
              <div style={{ marginTop:10, height:3, background:theme.surface2, borderRadius:2 }}>
                <div style={{ height:'100%', width:`${pct*100}%`, background:`linear-gradient(90deg,${cur.color},#FFD600)`, borderRadius:2, transition:'width .5s' }} />
              </div>
            </div>

            {/* Pro tip for this step */}
            <div style={{ margin:'10px 18px 0', background:`${cur.color}12`, borderRadius:theme.radius, padding:'10px 14px', border:`1px solid ${cur.color}33` }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:cur.color, letterSpacing:2, marginBottom:5, textTransform:'uppercase', fontWeight:700 }}>Pro Tip</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub, lineHeight:1.5, fontStyle:'italic' }}>"{stepTips[cur.id]}"</div>
            </div>

            {/* Practice checklist */}
            <div style={{ margin:'10px 18px 0', background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}` }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, marginBottom:8, textTransform:'uppercase' }}>Practice Checklist</div>
              {sessionTasks.map((task,i) => (
                <div key={i} onClick={() => setTasksDone(d => ({...d,[i]:!d[i]}))} style={{ display:'flex', gap:10, alignItems:'center', padding:'7px 0', borderBottom:i<sessionTasks.length-1?`1px solid ${theme.border}`:'none', cursor:'pointer' }}>
                  <div style={{ width:18,height:18,borderRadius:5,flexShrink:0,background:tasksDone[i]?cur.color:'transparent',border:`1.5px solid ${tasksDone[i]?cur.color:theme.border}`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    {tasksDone[i] && <span style={{ color:'#000', fontSize:10 }}>✓</span>}
                  </div>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:tasksDone[i]?theme.textSub:theme.text, textDecoration:tasksDone[i]?'line-through':'none' }}>{task}</span>
                </div>
              ))}
            </div>

            {/* Advance button */}
            <div style={{ padding:'12px 18px 24px' }}>
              <button onClick={advance} style={{
                width:'100%', height:isBlast?58:48, borderRadius:theme.radius, border:'none', cursor:'pointer',
                background: isBlast ? `linear-gradient(135deg,${theme.accent},#FFD600)` : theme.surface,
                color: isBlast ? '#000' : theme.textSub,
                fontFamily:"'Bebas Neue',cursive", fontSize:isBlast?24:17, letterSpacing:2,
                border: isBlast ? 'none' : `1px solid ${theme.border}`,
                boxShadow: isBlast ? `0 4px 24px ${theme.accent}55` : 'none',
              }}>
                {isBlast ? '🚀 BLAST OFF!' : stepDone[stepIdx] ? 'NEXT STEP →' : 'COMPLETE & CONTINUE →'}
              </button>
            </div>
          </div>
        )}

        {/* TAB view */}
        {mediaTab === 'tab' && (
          <div style={{ padding:'14px 18px' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Guitar TAB — {TAB_DATA.title}</div>
            <div style={{ background:theme.surface, borderRadius:theme.radius, padding:'14px 10px', border:`1px solid ${theme.border}` }}>
              <TabViewer theme={theme} playhead={running ? (1 - secs/totalSecs) : 0} />
            </div>
            <div style={{ marginTop:10, background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}` }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, marginBottom:6, textTransform:'uppercase' }}>Technique Notes</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub, lineHeight:1.6 }}>
                Bend the D string fret 7 a full step. Keep wrist relaxed on pentatonic runs. Consistent vibrato on every sustained note.
              </div>
            </div>
            <div style={{ marginTop:10, display:'flex', gap:8 }}>
              {['GP5','PDF','TuxGuitar'].map(fmt => (
                <div key={fmt} style={{ flex:1, padding:'9px 0', borderRadius:9, background:theme.surface, border:`1px solid ${theme.border}`, textAlign:'center', cursor:'pointer' }}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.accent, fontWeight:700, letterSpacing:1 }}>↓ {fmt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIAGRAM view */}
        {mediaTab === 'diagram' && (
          <div style={{ padding:'14px 18px' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Chord Diagrams</div>
            {/* Chord selector */}
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:12 }}>
              {Object.keys(window.CHORDS || {Am:1,G:1,D:1,C:1,Em:1,E7:1,Dm:1}).map(n => (
                <div key={n} onClick={() => setChordSel(n)} style={{
                  padding:'5px 13px', borderRadius:8, cursor:'pointer',
                  background: chordSel===n ? theme.accentDim : theme.surface,
                  border:`1.5px solid ${chordSel===n ? theme.accent : theme.border}`,
                  fontFamily:"'Bebas Neue',cursive", fontSize:15,
                  color: chordSel===n ? theme.accent : theme.textSub,
                }}>{n}</div>
              ))}
            </div>
            {/* Orientation toggle */}
            <div style={{ display:'flex', gap:6, marginBottom:14 }}>
              {['vertical','horizontal'].map(o => (
                <div key={o} onClick={() => setDiagOri(o)} style={{ padding:'6px 14px', borderRadius:8, cursor:'pointer', border:`1px solid ${diagOri===o?theme.accent:theme.border}`, background:diagOri===o?theme.surface2:theme.surface, fontFamily:"'Space Grotesk',sans-serif", fontSize:9, fontWeight:700, letterSpacing:1, color:diagOri===o?theme.accent:theme.textSub, textTransform:'uppercase' }}>
                  {o==='vertical' ? '⬛ Chord Box' : '▬ Fretboard'}
                </div>
              ))}
            </div>
            <div style={{ background:theme.surface, borderRadius:theme.radius, padding:'20px', border:`1px solid ${theme.border}`, display:'flex', justifyContent:'center' }}>
              {window.ChordDiagram && window.CHORDS && window.CHORDS[chordSel] &&
                <ChordDiagram chord={window.CHORDS[chordSel]} name={chordSel} orientation={diagOri} theme={theme} />
              }
            </div>
            <div style={{ marginTop:10, background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}` }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub, lineHeight:1.5 }}>
                Transpose to all CAGED keys. Try adding color tones: maj7, 9th, or sus4.
              </div>
            </div>
          </div>
        )}

        {/* NOTATION view */}
        {mediaTab === 'notation' && (
          <div style={{ padding:'14px 18px' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Standard Notation</div>
            <div style={{ background:theme.surface, borderRadius:theme.radius, padding:'16px 12px', border:`1px solid ${theme.border}` }}>
              {window.NotationViewer && <NotationViewer theme={theme} />}
            </div>
            <div style={{ marginTop:10, display:'flex', gap:8 }}>
              {['Concert Pitch','Transposed','Bass Clef'].map((opt,i) => (
                <div key={opt} style={{ flex:1, padding:'8px 4px', borderRadius:8, background:i===0?theme.accentDim:theme.surface, border:`1px solid ${i===0?theme.accent+'55':theme.border}`, textAlign:'center', cursor:'pointer' }}>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:8, color:i===0?theme.accent:theme.textSub, fontWeight:700 }}>{opt}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, display:'flex', gap:8 }}>
              {['PDF','MusicXML','MIDI'].map(f => (
                <div key={f} style={{ flex:1, padding:'9px 0', borderRadius:9, background:theme.surface, border:`1px solid ${theme.border}`, textAlign:'center', cursor:'pointer' }}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.accent, fontWeight:700, letterSpacing:1 }}>↓ {f}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO view */}
        {mediaTab === 'video' && (
          <div style={{ padding:'14px 18px' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Example Video</div>
            {/* Video player */}
            <div onClick={() => setVidPlay(v => !v)} style={{ background:theme.surface2, borderRadius:theme.radius, aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, border:`1px solid ${theme.border}`, cursor:'pointer' }}>
              <div style={{ width:54,height:54,borderRadius:'50%',background:vidPlay?theme.accentDim:`${theme.accent}28`,border:`2px solid ${vidPlay?theme.accent+'88':theme.accent}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s' }}>
                <span style={{ color:theme.accent, fontSize:20, marginLeft:vidPlay?0:4 }}>{vidPlay?'⏸':'▶'}</span>
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub, textAlign:'center', lineHeight:1.4 }}>
                {vidPlay ? 'Playing…' : 'Tap to play'}<br />
                <span style={{ fontSize:10, color:theme.textMuted }}>{cur.label} — Example Demo</span>
              </div>
            </div>
            {/* Playback controls */}
            <div style={{ marginTop:10, display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ flex:1, height:3, background:theme.border, borderRadius:2 }}>
                <div style={{ height:'100%', width:vidPlay?'35%':'0%', background:cur.color, borderRadius:2, transition:'width .3s' }} />
              </div>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textMuted }}>0:34</span>
            </div>
            <div style={{ marginTop:8, display:'flex', gap:7, alignItems:'center' }}>
              {['0.5×','0.75×','1×','1.25×','1.5×'].map(s => (
                <div key={s} onClick={() => {}} style={{ padding:'5px 9px', borderRadius:6, background:s==='1×'?theme.accentDim:theme.surface, border:`1px solid ${s==='1×'?theme.accent+'55':theme.border}`, fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:s==='1×'?theme.accent:theme.textSub, cursor:'pointer' }}>{s}</div>
              ))}
              <div style={{ marginLeft:'auto', padding:'5px 10px', borderRadius:6, background:theme.surface, border:`1px solid ${theme.border}`, fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.textSub, cursor:'pointer' }}>LOOP</div>
            </div>
            {/* Multiple takes */}
            <div style={{ marginTop:14 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>More Examples</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[{title:'Slow Practice — 60 BPM',dur:'1:12'},{title:'Full Speed — 120 BPM',dur:'0:38'},{title:'With Backing Track',dur:'2:05'}].map((v,i) => (
                  <div key={i} style={{ background:theme.surface, borderRadius:10, padding:'10px 14px', border:`1px solid ${theme.border}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                    <div style={{ width:32,height:32,borderRadius:8,background:`${cur.color}22`,border:`1px solid ${cur.color}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <span style={{ color:cur.color, fontSize:12 }}>▶</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.text, fontWeight:600 }}>{v.title}</div>
                    </div>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textMuted }}>{v.dur}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Blast Off ──────────────────────────────────────────────────────────────────
function BlastOffScreen({ theme, onDone }) {
  const [key, setKey] = useState('A');
  const [prog, setProg] = useState('blues12');
  const [tricks, setTricks] = useState(new Set(['cycling','abac','callresponse']));
  const [phase, setPhase] = useState('setup');
  const toggle = id => setTricks(t=>{ const n=new Set(t); n.has(id)?n.delete(id):n.size<5?n.add(id):null; return n; });

  if (phase==='record') {
    const [rated, setRated] = useState(0);
    return (
      <div style={{ height:'100%',background:theme.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:28,gap:18 }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:34,color:theme.text,textAlign:'center',letterSpacing:2 }}>RECORD YOUR TAKE</div>
        <div style={{ width:90,height:90,borderRadius:'50%',background:'#FF000025',border:'3px solid #FF4444',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,cursor:'pointer',animation:'recPulse 1.2s ease-in-out infinite' }}>●</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:theme.textSub,textAlign:'center',lineHeight:1.6 }}>Tap to record. Rate your take, save to your progress log.</div>
        <div style={{ display:'flex',gap:8 }}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} onClick={()=>setRated(n)} style={{ width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontFamily:"'Bebas Neue',cursive",fontSize:20,background:rated>=n?theme.accentDim:theme.surface,border:`1.5px solid ${rated>=n?theme.accent:theme.border}`,color:rated>=n?theme.accent:theme.textSub }}>
              {n}
            </div>
          ))}
        </div>
        <button onClick={onDone} style={{ width:'100%',height:52,borderRadius:theme.radius,border:'none',cursor:'pointer',background:`linear-gradient(135deg,${theme.accent},#FFD600)`,fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:'#000' }}>
          SESSION COMPLETE +200 XP →
        </button>
        <style>{`@keyframes recPulse{0%,100%{box-shadow:0 0 0 0 #FF444466}50%{box-shadow:0 0 0 16px transparent}}`}</style>
      </div>
    );
  }

  if (phase==='launch') {
    return (
      <div style={{ height:'100%',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20 }}>
        <div style={{ fontSize:70,animation:'blastPulse .9s ease-in-out infinite' }}>🚀</div>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:52,color:'#FFF',letterSpacing:4 }}>BLAST OFF!</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:14,color:'#888',textAlign:'center',lineHeight:1.7 }}>
          Key of <strong style={{ color:theme.accent }}>{key}</strong><br />
          {CHORD_PROGRESSIONS.find(p=>p.id===prog)?.label}
        </div>
        <div style={{ display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',padding:'0 32px' }}>
          {[...tricks].map(id=>{ const t=BAG_OF_TRICKS.find(b=>b.id===id); return <div key={id} style={{ background:`${theme.accent}20`,border:`1px solid ${theme.accent}44`,borderRadius:20,padding:'5px 12px',fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:theme.accent }}>{t?.name}</div>; })}
        </div>
        <button onClick={()=>setPhase('record')} style={{ marginTop:12,padding:'14px 36px',borderRadius:theme.radius,border:'none',cursor:'pointer',background:`linear-gradient(135deg,${theme.accent},#FFD600)`,fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:'#000' }}>
          START IMPROVISING →
        </button>
        <style>{`@keyframes blastPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}`}</style>
      </div>
    );
  }

  if (phase==='record') {
    return <RecordAndReviewScreen
      theme={theme}
      tricks={tricks}
      progression={prog}
      songKey={key}
      onDone={({ xpEarned }) => onDone({ xpEarned })}
    />;
  }

  return (
    <SW theme={theme}>
      <div style={{ padding:'18px 20px 10px' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:36,color:theme.accent,letterSpacing:2,lineHeight:1 }}>BLAST OFF</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub,marginTop:3 }}>Set your context, then launch into music.</div>
      </div>
      {/* Key */}
      <div style={{ padding:'0 20px 12px' }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase',marginBottom:8 }}>Key</div>
        <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
          {KEYS.map(k=>(
            <div key={k} onClick={()=>setKey(k)} style={{ width:40,height:40,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:key===k?theme.accent:theme.surface,border:`1px solid ${key===k?theme.accent:theme.border}`,fontFamily:"'Bebas Neue',cursive",fontSize:17,color:key===k?'#000':theme.textSub,cursor:'pointer',transition:'all .15s' }}>{k}</div>
          ))}
        </div>
      </div>
      {/* Progression */}
      <div style={{ padding:'0 20px 12px' }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase',marginBottom:8 }}>Chord Progression</div>
        <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
          {CHORD_PROGRESSIONS.map(p=>(
            <div key={p.id} onClick={()=>setProg(p.id)} style={{ background:prog===p.id?theme.accentDim:theme.surface,border:`1.5px solid ${prog===p.id?theme.accent:theme.border}`,borderRadius:Math.min(theme.radius,10),padding:'9px 12px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .15s' }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:prog===p.id?theme.text:theme.textSub,fontWeight:600 }}>{p.label}</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textMuted }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Bag O' Tricks with improvisation goals */}
      <div style={{ padding:'0 20px 8px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase' }}>Improvisation Goals</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.accent }}>{tricks.size}/5</div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
          {BAG_OF_TRICKS.slice(0,6).map((trick,i)=>{
            const sel = tricks.has(trick.id);
            return (
              <div key={trick.id} style={{ background:sel?theme.accentDim:theme.surface,borderRadius:10,padding:'10px 12px',border:`1px solid ${sel?theme.accent+'55':theme.border}`,transition:'all .15s' }}>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <div style={{ width:26,height:26,borderRadius:'50%',background:sel?theme.accentDim:theme.surface2,border:`1px solid ${theme.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:13,color:theme.textSub }}>{i+1}</span>
                  </div>
                  <div style={{ flex:1 }} onClick={()=>toggle(trick.id)} style={{ flex:1,cursor:'pointer' }}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:sel?theme.text:theme.textSub,fontWeight:700 }}>{trick.name}</div>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textMuted,marginTop:1 }}>{trick.desc}</div>
                  </div>
                  <div style={{ padding:'4px 8px',borderRadius:6,background:theme.surface2,border:`1px solid ${theme.border}`,cursor:'pointer',flexShrink:0 }}>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:8,color:theme.accent,fontWeight:700,letterSpacing:0.5 }}>VIEW FILE</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'12px 20px 28px' }}>
        <button onClick={()=>setPhase('launch')} style={{ width:'100%',height:56,borderRadius:theme.radius,border:'none',cursor:'pointer',background:`linear-gradient(135deg,${theme.accent},#FFD600)`,fontFamily:"'Bebas Neue',cursive",fontSize:26,letterSpacing:2,color:'#000',boxShadow:`0 4px 28px ${theme.accent}66` }}>
          🚀 BLAST OFF!
        </button>
      </div>
    </SW>
  );
}

// ── Progress ───────────────────────────────────────────────────────────────────
function RadarChart({ skills, size=130, theme }) {
  const n=skills.length, c=size/2, r=size*.38;
  const as=(Math.PI*2)/n;
  const pt=(i,v)=>{ const a=as*i-Math.PI/2, d=r*(v/10); return [c+d*Math.cos(a),c+d*Math.sin(a)]; };
  const lpt=(i)=>{ const a=as*i-Math.PI/2, d=r*1.3; return [c+d*Math.cos(a),c+d*Math.sin(a)]; };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[.25,.5,.75,1].map(lv=><polygon key={lv} points={skills.map((_,i)=>pt(i,10*lv).join(',')).join(' ')} fill="none" stroke={theme.border} strokeWidth="1"/>)}
      {skills.map((_,i)=>{ const[x,y]=pt(i,10); return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke={theme.border} strokeWidth="1"/>; })}
      <polygon points={skills.map((s,i)=>pt(i,s.value).join(',')).join(' ')} fill={`${theme.accent}28`} stroke={theme.accent} strokeWidth="1.5"/>
      {skills.map((s,i)=>{ const[x,y]=pt(i,s.value); return <circle key={i} cx={x} cy={y} r="3" fill={theme.accent}/>; })}
      {skills.map((s,i)=>{ const[x,y]=lpt(i); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill={theme.textSub} fontFamily="'Space Grotesk',sans-serif">{s.label}</text>; })}
    </svg>
  );
}

function ProgressScreen({ profile, theme }) {
  const skills = SKILL_AREAS.map((a,i)=>({ label:a.label, value:profile.skills?profile.skills[a.id]||5:[7,4,6,5,3][i] }));
  const avg = skills.reduce((a,s)=>a+s.value,0)/5;
  const xp = profile.xp||1240;
  const lv = getLevel(xp);
  const pd = projDate(avg, profile.hpw||5);
  const badges = [
    {name:'First Cook',  earned:true,  icon:'🔥'},{name:'Week Streak', earned:true,  icon:'⚡'},
    {name:'Blast Off!',  earned:true,  icon:'🚀'},{name:'Monk Focus',  earned:false, icon:'🎯'},
    {name:'Transcriber', earned:false, icon:'📝'},{name:'SAUCE Master',earned:false, icon:'🏆'},
  ];
  return (
    <SW theme={theme}>
      <div style={{ padding:'18px 20px 12px' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:28,color:theme.text,letterSpacing:1 }}>Your Progress</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:theme.textSub }}>Data-driven insights into your musical journey</div>
      </div>
      {/* Projection card */}
      <div style={{ margin:'0 20px 14px', background:theme.surface, borderRadius:theme.radius, padding:'16px 18px', border:`1px solid ${theme.border}`, display:'flex', gap:16, alignItems:'center' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.accent,letterSpacing:2,textTransform:'uppercase',marginBottom:4 }}>Goal Projection</div>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:30,color:theme.text,lineHeight:1 }}>{pd}</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,marginTop:4 }}>Practice more → date moves up ↑</div>
        </div>
        <div style={{ textAlign:'center', flexShrink:0 }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:42,color:theme.accent,lineHeight:1 }}>{xp.toLocaleString()}</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:8,color:theme.textSub }}>XP TOTAL</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.accent,marginTop:2 }}>{lv.rank}</div>
        </div>
      </div>
      {/* Radar + bars */}
      <div style={{ margin:'0 20px 14px', background:theme.surface, borderRadius:theme.radius, padding:'16px', border:`1px solid ${theme.border}`, display:'flex', gap:14, alignItems:'center' }}>
        <RadarChart skills={skills} theme={theme} size={130} />
        <div style={{ flex:1 }}>
          {skills.map(s=>(
            <div key={s.label} style={{ marginBottom:8 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub }}>{s.label}</span>
                <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:13,color:theme.accent }}>{s.value}</span>
              </div>
              <div style={{ height:3,background:theme.surface2,borderRadius:2 }}>
                <div style={{ height:'100%',width:`${s.value*10}%`,background:theme.accent,borderRadius:2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Badges */}
      <div style={{ padding:'0 20px 12px' }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase',marginBottom:10 }}>Achievements</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8 }}>
          {badges.map(b=>(
            <div key={b.name} style={{ background:b.earned?theme.accentDim:theme.surface,borderRadius:Math.min(theme.radius,12),padding:'10px 6px',textAlign:'center',border:`1px solid ${b.earned?theme.accent+'44':theme.border}`,opacity:b.earned?1:0.45 }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{b.icon}</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:b.earned?theme.text:theme.textMuted,fontWeight:700,lineHeight:1.2 }}>{b.name}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Recording log */}
      <div style={{ margin:'0 20px 28px', background:theme.surface, borderRadius:theme.radius, padding:'14px 16px', border:`1px solid ${theme.border}` }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:theme.textSub,letterSpacing:2,textTransform:'uppercase',marginBottom:12 }}>Recent Recordings</div>
        <div style={{ display:'flex',gap:10 }}>
          {['Apr 23','Apr 20','Apr 17'].map((d,i)=>(
            <div key={i} style={{ flex:1,aspectRatio:'1',background:theme.surface2,borderRadius:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',border:`1px solid ${theme.border}`,cursor:'pointer' }}>
              <div style={{ fontSize:18,marginBottom:4,color:theme.textSub }}>▶</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:9,color:theme.textSub }}>{d}</div>
              <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:14,color:theme.accent }}>{[4,3,4][i]}/5</div>
            </div>
          ))}
        </div>
      </div>
    </SW>
  );
}

Object.assign(window, {
  SplashV2, AssessmentScreen, DashboardScreen, PracticeModeScreen,
  ActivePracticeScreen, BlastOffScreen, ProgressScreen,
  THEMES, SAUCE, PRACTICE_PATH, BAG_OF_TRICKS, SKILL_AREAS,
  CHORD_PROGRESSIONS, PRO_TIPS, getLevel,
});
