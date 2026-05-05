
// Guitarmalade SAUCE App — Screen Components
// Exported to window for use in main app

const SAUCE = [
  { key: 'S', label: 'Study', tag: 'Steal', color: '#FF3D00',
    desc: 'Study your heroes. STEAL their ideas. Transcribe, analyze, understand their vocabulary.' },
  { key: 'A', label: 'Assimilate', tag: '', color: '#FF6200',
    desc: 'Practice and internalize through warmups, application, and experimentation.' },
  { key: 'U', label: 'Utilize', tag: '', color: '#FF8C00',
    desc: 'Play over chord progressions. Transpose. Record. Rate yourself. Apply your tools.' },
  { key: 'C', label: 'Compose', tag: '', color: '#FFAA00',
    desc: 'Write your own material. Craft solos. Develop your voice with clear intent.' },
  { key: 'E', label: 'Elevate', tag: '', color: '#FFD600',
    desc: 'Push your limits. Seek mentors. Cultivate belief — level up your identity.' },
];

const CORE_LEVELS = [
  { level: 1, tasks: ['Find Notes Up 12 Down 5', 'Major Scale (1 string, 1 octave)', 'Major Pentatonic (1 octave)', 'Root position triad / Open Chord', 'Song Analysis'] },
  { level: 2, tasks: ['Find Notes Up 12 Down 5 (asc/desc)', 'Major Scale in-position (2 oct)', 'Major Pentatonic (2 octaves)', 'Triad inversions across string sets', 'Transpose to new key'] },
  { level: 3, tasks: ['Notes + octave shapes', 'Major Scale 3nps + string shift', 'Major Pent — all patterns', 'Diatonic barre chords & triads', 'Minor pentatonic each pattern'] },
  { level: 4, tasks: ['Pedal tone + 3rds', 'All modes', 'Diatonic 7th chords', 'Major 7 arpeggio inversions', 'Minor 7 arpeggios across/along'] },
  { level: 5, tasks: ['All string sets', 'All diatonic arpeggio inversions', 'Diagonal pentatonic patterns', 'Full solo composition + recording', 'Bag O\'Tricks transcription'] },
];

const { useState, useEffect, useRef } = React;

// ─── Shared primitives ────────────────────────────────────────────────────────
function ScreenWrap({ children, style }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#080808', overflowY: 'auto', ...style }}>
      {children}
    </div>
  );
}

function SauceChip({ step, active, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: active ? step.color : '#1E1E1E',
      border: `2px solid ${active ? step.color : '#333'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Bebas Neue', cursive", fontSize: size * 0.5,
      color: active ? '#000' : '#555', transition: 'all 0.3s',
      boxShadow: active ? `0 0 12px ${step.color}66` : 'none',
    }}>{step.key}</div>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div onClick={onDone} style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#080808', cursor: 'pointer',
    }}>
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <div style={{
          width: 90, height: 90, borderRadius: 22,
          background: 'linear-gradient(135deg, #FF5500 0%, #FF9900 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px #FF550066',
        }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 38, color: '#000', letterSpacing: 1 }}>GM</span>
        </div>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: '#FFF', letterSpacing: 4, textAlign: 'center' }}>
        GUITARMALADE
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: '#FF6200', letterSpacing: 6, marginTop: 4, textTransform: 'uppercase' }}>
        S.A.U.C.E. Method
      </div>
      <div style={{ marginTop: 48, display: 'flex', gap: 8 }}>
        {SAUCE.map((s, i) => (
          <div key={s.key} style={{
            width: 8, height: 8, borderRadius: 4, background: s.color,
            opacity: 0.7, animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
      `}</style>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
function OnboardingScreen({ onDone, tweaks }) {
  const [step, setStep] = useState(0);
  const [iam, setIam] = useState('');
  const [level, setLevel] = useState(1);

  const steps = [
    {
      render: () => (
        <div style={{ padding: '40px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: '#FFF', lineHeight: 1, letterSpacing: 2 }}>
            COOK UP YOUR<br /><span style={{ color: '#FF6200' }}>MUSICAL VOICE</span>
          </div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: '#888', lineHeight: 1.6 }}>
            The S.A.U.C.E. Method turns dedicated practice into a complete musical identity. Study the greats, build your vocabulary, and compose your own voice.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {SAUCE.map(s => (
              <div key={s.key} style={{ flex: 1, background: '#141414', borderRadius: 10, padding: '10px 6px', textAlign: 'center', border: `1px solid #222` }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: s.color }}>{s.key}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: '#666', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      render: () => (
        <div style={{ padding: '40px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 44, color: '#FFF', lineHeight: 1 }}>
            DECLARE YOUR<br /><span style={{ color: '#FF6200' }}>INTENTION</span>
          </div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#888', lineHeight: 1.6 }}>
            The most powerful practice starts with belief. Complete your <strong style={{ color: '#FF6200' }}>I AM</strong> statement — speak it as if it's already true.
          </p>
          <div style={{ background: '#141414', borderRadius: 14, padding: '16px 18px', border: '1px solid #2A2A2A' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#FF6200', marginBottom: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              I Am So Thankful That I...
            </div>
            <textarea
              value={iam}
              onChange={e => setIam(e.target.value)}
              placeholder="...play guitar with confidence, musicality, and my own unique voice."
              rows={4}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: '#FFF',
                resize: 'none', lineHeight: 1.6, caretColor: '#FF6200',
              }}
            />
          </div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#555', fontStyle: 'italic' }}>
            This becomes your daily affirmation. Read it every session.
          </p>
        </div>
      )
    },
    {
      render: () => (
        <div style={{ padding: '40px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 44, color: '#FFF', lineHeight: 1 }}>
            PICK YOUR<br /><span style={{ color: '#FF6200' }}>C.O.R.E. LEVEL</span>
          </div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#888', lineHeight: 1.6 }}>
            C.O.R.E. = Complete, Organized, Real-world Expertise. Be honest — this is your starting kitchen.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CORE_LEVELS.map(cl => (
              <div key={cl.level} onClick={() => setLevel(cl.level)} style={{
                background: level === cl.level ? '#1E1200' : '#141414',
                border: `1.5px solid ${level === cl.level ? '#FF6200' : '#222'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: level === cl.level ? '#FF6200' : '#1E1E1E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Bebas Neue', cursive", fontSize: 20,
                  color: level === cl.level ? '#000' : '#555', flexShrink: 0,
                }}>L{cl.level}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: level === cl.level ? '#FFF' : '#888', fontWeight: 600 }}>
                    {cl.tasks[0]}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#555', marginTop: 2 }}>
                    +{cl.tasks.length - 1} more skills
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <ScreenWrap>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {steps[step].render()}
      </div>
      <div style={{ padding: '16px 28px 28px', background: '#080808', borderTop: '1px solid #141414' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, justifyContent: 'center' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? '#FF6200' : '#222', transition: 'all 0.3s' }} />
          ))}
        </div>
        <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onDone({ iam, level })} style={{
          width: '100%', height: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #FF5500, #FF9900)',
          fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: '#000', letterSpacing: 2,
          boxShadow: '0 4px 20px #FF550044',
        }}>
          {step < steps.length - 1 ? 'CONTINUE →' : "LET'S COOK →"}
        </button>
      </div>
    </ScreenWrap>
  );
}

// ─── Home / Dashboard ─────────────────────────────────────────────────────────
function HomeScreen({ profile, tweaks, onStartPractice }) {
  const [checked, setChecked] = useState({});
  const level = CORE_LEVELS[profile.level - 1];
  const sauceStep = SAUCE[profile.sauceIndex || 0];
  const streak = profile.streak || 7;
  const toggle = key => setChecked(c => ({ ...c, [key]: !c[key] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const totalTasks = level.tasks.length;

  return (
    <ScreenWrap>
      {/* Header */}
      <div style={{ padding: '20px 22px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#666', letterSpacing: 1, textTransform: 'uppercase' }}>Good morning</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: '#FFF', letterSpacing: 1, marginTop: 2 }}>Today's Recipe</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: '#FF6200', lineHeight: 1 }}>{streak}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#666', letterSpacing: 1 }}>DAY STREAK</div>
        </div>
      </div>

      {/* I AM Banner */}
      <div style={{ margin: '0 22px 16px', background: '#141414', borderRadius: 14, padding: '14px 16px', border: '1px solid #222', borderLeft: '3px solid #FF6200' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#FF6200', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>Your I AM</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: '#CCC', lineHeight: 1.5, fontStyle: 'italic' }}>
          "{profile.iam || 'I am so thankful that I play with confidence and my own unique voice.'}"
        </div>
      </div>

      {/* SAUCE Progress */}
      <div style={{ margin: '0 22px 16px' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#666', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>S.A.U.C.E. Journey</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {SAUCE.map((s, i) => {
            const past = i < (profile.sauceIndex || 0);
            const active = i === (profile.sauceIndex || 0);
            return (
              <React.Fragment key={s.key}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <SauceChip step={s} active={active || past} size={36} />
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: active ? s.color : past ? '#444' : '#333', fontWeight: active ? 700 : 400 }}>{s.key}</div>
                </div>
                {i < 4 && <div style={{ flex: 0.5, height: 1.5, background: past ? SAUCE[i].color : '#222', borderRadius: 1 }} />}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 10, background: '#141414', borderRadius: 10, padding: '10px 14px', border: `1px solid ${sauceStep.color}33` }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, color: sauceStep.color, letterSpacing: 1 }}>
            {sauceStep.key} — {sauceStep.label}{sauceStep.tag ? ` (${sauceStep.tag})` : ''}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#777', marginTop: 3, lineHeight: 1.4 }}>
            {sauceStep.desc.slice(0, 80)}…
          </div>
        </div>
      </div>

      {/* Today's CORE Tasks */}
      <div style={{ margin: '0 22px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#666', letterSpacing: 2, textTransform: 'uppercase' }}>CORE Level {profile.level}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: doneCount === totalTasks ? '#00C48C' : '#FF6200' }}>{doneCount}/{totalTasks}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {level.tasks.map((task, i) => (
            <div key={i} onClick={() => toggle(i)} style={{
              background: '#141414', borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              border: `1px solid ${checked[i] ? '#00C48C33' : '#1E1E1E'}`,
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: checked[i] ? '#00C48C' : 'transparent',
                border: `2px solid ${checked[i] ? '#00C48C' : '#333'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {checked[i] && <span style={{ color: '#000', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                color: checked[i] ? '#555' : '#CCC',
                textDecoration: checked[i] ? 'line-through' : 'none',
              }}>{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Practice CTA */}
      <div style={{ padding: '0 22px 28px', marginTop: 'auto' }}>
        <button onClick={onStartPractice} style={{
          width: '100%', height: 54, borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #FF5500 0%, #FF9900 100%)',
          fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: '#000',
          boxShadow: '0 4px 24px #FF550044',
        }}>
          START COOKING →
        </button>
      </div>
    </ScreenWrap>
  );
}

// ─── Practice Session ─────────────────────────────────────────────────────────
function PracticeScreen({ profile, tweaks }) {
  const [sauceIdx, setSauceIdx] = useState(profile.sauceIndex || 0);
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(tweaks.sessionMins * 60 || 1800);
  const [done, setDone] = useState({});
  const timerRef = useRef(null);
  const step = SAUCE[sauceIdx];
  const level = CORE_LEVELS[profile.level - 1];

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const total = tweaks.sessionMins * 60 || 1800;
  const pct = (total - secs) / total;

  return (
    <ScreenWrap>
      <div style={{ padding: '20px 22px 12px' }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: '#FFF', letterSpacing: 1 }}>Practice Session</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#666' }}>C.O.R.E. Level {profile.level}</div>
      </div>

      {/* SAUCE step selector */}
      <div style={{ padding: '0 22px 16px', display: 'flex', gap: 8 }}>
        {SAUCE.map((s, i) => (
          <div key={s.key} onClick={() => setSauceIdx(i)} style={{ flex: 1, cursor: 'pointer' }}>
            <SauceChip step={s} active={i === sauceIdx} size={38} />
          </div>
        ))}
      </div>

      {/* Active step card */}
      <div style={{ margin: '0 22px 16px', borderRadius: 16, background: '#141414', border: `1.5px solid ${step.color}55`, padding: '18px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: step.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: '#000',
            boxShadow: `0 4px 16px ${step.color}55`,
          }}>{step.key}</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: step.color, letterSpacing: 1 }}>
              {step.label}{step.tag ? ` — ${step.tag}` : ''}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#888', lineHeight: 1.5, marginTop: 4 }}>{step.desc}</div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div style={{ margin: '0 22px 16px', textAlign: 'center', background: '#0E0E0E', borderRadius: 16, padding: '20px 0', border: '1px solid #1E1E1E' }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 64, color: running ? step.color : '#FFF', letterSpacing: 4, lineHeight: 1, transition: 'color 0.3s' }}>
          {fmt(secs)}
        </div>
        <div style={{ marginTop: 8, height: 4, background: '#1E1E1E', borderRadius: 2, margin: '12px 24px 16px' }}>
          <div style={{ height: '100%', borderRadius: 2, background: step.color, width: `${pct * 100}%`, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '0 20px' }}>
          <button onClick={() => { setSecs(total); setRunning(false); }} style={{
            flex: 1, height: 40, borderRadius: 10, border: '1px solid #222',
            background: 'transparent', color: '#666', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, cursor: 'pointer',
          }}>Reset</button>
          <button onClick={() => setRunning(!running)} style={{
            flex: 2, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: running ? '#1E1E1E' : step.color,
            color: running ? step.color : '#000', fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 1,
          }}>
            {running ? '⏸ PAUSE' : '▶ START'}
          </button>
        </div>
      </div>

      {/* Tasks for this session */}
      <div style={{ padding: '0 22px 28px' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#666', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Session Tasks</div>
        {level.tasks.slice(0, 3).map((task, i) => (
          <div key={i} onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))} style={{
            display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0',
            borderBottom: '1px solid #141414', cursor: 'pointer',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              background: done[i] ? step.color : 'transparent',
              border: `1.5px solid ${done[i] ? step.color : '#333'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done[i] && <span style={{ color: '#000', fontSize: 10 }}>✓</span>}
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: done[i] ? '#444' : '#BBB', textDecoration: done[i] ? 'line-through' : 'none' }}>{task}</span>
          </div>
        ))}
      </div>
    </ScreenWrap>
  );
}

// ─── CORE Levels ──────────────────────────────────────────────────────────────
function CoreScreen({ profile, tweaks }) {
  const [expanded, setExpanded] = useState(profile.level - 1);
  return (
    <ScreenWrap>
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: '#FFF', letterSpacing: 1 }}>C.O.R.E. Curriculum</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#666' }}>Complete · Organized · Real-world · Expertise</div>
      </div>

      {/* Level progress visual */}
      <div style={{ margin: '0 22px 20px', display: 'flex', gap: 0, height: 6, borderRadius: 4, overflow: 'hidden', background: '#1E1E1E' }}>
        {CORE_LEVELS.map((cl, i) => (
          <div key={i} style={{ flex: 1, background: i < profile.level ? '#FF6200' : 'transparent', transition: 'all 0.3s' }} />
        ))}
      </div>
      <div style={{ padding: '0 22px', fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#666', marginBottom: 16 }}>
        Currently at <strong style={{ color: '#FF6200' }}>Level {profile.level}</strong> — {profile.level * 20}% complete
      </div>

      <div style={{ padding: '0 22px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CORE_LEVELS.map((cl, i) => {
          const unlocked = i <= profile.level;
          const current = i === profile.level - 1;
          const isOpen = expanded === i;
          return (
            <div key={i} onClick={() => setExpanded(isOpen ? -1 : i)} style={{
              background: current ? '#1A0E00' : '#111',
              borderRadius: 14, border: `1.5px solid ${current ? '#FF6200' : isOpen ? '#333' : '#1A1A1A'}`,
              overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: current ? '#FF6200' : unlocked ? '#1E1E1E' : '#0E0E0E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Bebas Neue', cursive", fontSize: 20,
                  color: current ? '#000' : unlocked ? '#FF6200' : '#333',
                  boxShadow: current ? '0 2px 12px #FF620044' : 'none',
                }}>L{cl.level}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, color: unlocked ? '#FFF' : '#444', letterSpacing: 0.5 }}>
                    LEVEL {cl.level}
                    {current && <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#FF6200', letterSpacing: 2, marginLeft: 10 }}>CURRENT</span>}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#555' }}>{cl.tasks.length} skills</div>
                </div>
                <div style={{ color: '#444', fontSize: 14 }}>{isOpen ? '▲' : '▼'}</div>
              </div>
              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #1E1E1E' }}>
                  {cl.tasks.map((t, j) => (
                    <div key={j} style={{ padding: '8px 0', display: 'flex', gap: 10, alignItems: 'flex-start', borderBottom: j < cl.tasks.length - 1 ? '1px solid #141414' : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: current ? '#FF6200' : '#333', marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: '#888', lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScreenWrap>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfileScreen({ profile, tweaks }) {
  const stats = [
    { label: 'Day Streak', value: profile.streak || 7, unit: 'days', color: '#FF6200' },
    { label: 'Sessions', value: 42, unit: 'total', color: '#FFAA00' },
    { label: 'SAUCE Step', value: `${SAUCE[profile.sauceIndex || 0].key}`, unit: SAUCE[profile.sauceIndex || 0].label, color: SAUCE[profile.sauceIndex || 0].color },
    { label: 'Hours', value: 31, unit: 'practiced', color: '#FF8C00' },
  ];
  return (
    <ScreenWrap>
      <div style={{ padding: '20px 22px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #FF5500, #FF9900)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: '#000',
        }}>GM</div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: '#FFF', letterSpacing: 1 }}>YOUR PROFILE</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: '#666' }}>Level {profile.level} Guitarist</div>
        </div>
      </div>

      {/* I AM */}
      <div style={{ margin: '0 22px 20px', background: '#141414', borderRadius: 14, padding: '16px 18px', border: '1px solid #2A2A2A', borderLeft: '3px solid #FF6200' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#FF6200', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>I AM Statement</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#CCC', lineHeight: 1.6, fontStyle: 'italic' }}>
          "{profile.iam || 'I am so thankful that I play guitar with confidence, musicality, and my own unique voice.'}"
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 22px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#141414', borderRadius: 14, padding: '14px 16px', border: '1px solid #1E1E1E' }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: '#666', marginTop: 2 }}>{s.unit}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#888', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SAUCE summary */}
      <div style={{ padding: '0 22px 20px' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#666', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>SAUCE Progress</div>
        {SAUCE.map((s, i) => {
          const past = i < (profile.sauceIndex || 0);
          const active = i === (profile.sauceIndex || 0);
          return (
            <div key={s.key} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: active ? s.color : past ? '#1E1E1E' : '#0E0E0E',
                border: `1.5px solid ${active ? s.color : past ? '#333' : '#1A1A1A'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', cursive", fontSize: 16,
                color: active ? '#000' : past ? '#555' : '#2A2A2A',
              }}>{s.key}</div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: active ? '#FFF' : past ? '#555' : '#333', fontWeight: 600 }}>
                  {s.label}{s.tag ? ` (${s.tag})` : ''}
                  {active && <span style={{ color: '#FF6200', fontSize: 10, marginLeft: 8 }}>← CURRENT</span>}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: '#444', lineHeight: 1.4, marginTop: 2 }}>
                  {active ? s.desc.slice(0, 60) + '…' : past ? 'Completed' : 'Locked'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScreenWrap>
  );
}

// Export all screens
Object.assign(window, {
  SplashScreen, OnboardingScreen, HomeScreen, PracticeScreen, CoreScreen, ProfileScreen, SAUCE, CORE_LEVELS
});
