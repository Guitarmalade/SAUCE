
// sauce-notation.jsx — TAB / Chord Diagram / Notation / Video viewer

const NOTATION_VIEWS = [
  { id: 'tab',      label: 'TAB' },
  { id: 'diagram',  label: 'DIAGRAM' },
  { id: 'notation', label: 'NOTATION' },
  { id: 'video',    label: 'VIDEO' },
];

// Sample chord library
const CHORDS = {
  'Am': { frets: [null,0,2,2,1,0] },  // E A D G B e  (null = muted, 0 = open)
  'G':  { frets: [3,2,0,0,0,3] },
  'D':  { frets: [null,null,0,2,3,2] },
  'C':  { frets: [null,3,2,0,1,0] },
  'Em': { frets: [0,2,2,0,0,0] },
  'E7': { frets: [0,2,0,1,0,0] },
  'Dm': { frets: [null,null,0,2,3,1] },
};

// Example TAB: A minor pentatonic lick
// Each beat: { stringName: fretNum }
const TAB_DATA = {
  title: 'A Minor Pentatonic Lick',
  key: 'Am',
  tempo: 100,
  measures: [
    { beats: [{D:7},{G:5},{G:7},{B:5}] },
    { beats: [{B:8},{e:5},{e:8},{e:5}] },
    { beats: [{e:8},{e:5},{B:8},{B:5}] },
    { beats: [{B:7},{B:5},{G:7},{G:5}] },
  ]
};

// ── TAB Viewer ────────────────────────────────────────────────────────────────
function TabViewer({ theme, playhead }) {
  const STRS = ['e','B','G','D','A','E'];
  const CW = 44, SH = 22, L = 28, T = 16;
  const totalBeats = TAB_DATA.measures.reduce((a,m) => a + m.beats.length, 0);
  const W = L + totalBeats * CW + 40;
  const H = STRS.length * SH + T + 20;

  const els = [];
  // string lines + labels
  STRS.forEach((s, si) => {
    els.push(<text key={`l${s}`} x={L-6} y={T+si*SH} textAnchor="end" dominantBaseline="middle"
      fontSize="9" fill={theme.textSub} fontFamily="'Space Grotesk',sans-serif" fontWeight="700">{s}</text>);
    els.push(<line key={`sl${s}`} x1={L-2} y1={T+si*SH} x2={W-8} y2={T+si*SH}
      stroke={si===0||si===5 ? theme.textSub+'BB' : theme.border} strokeWidth={si===0||si===5?1.5:1} />);
  });

  let bx = L;
  TAB_DATA.measures.forEach((measure, mi) => {
    if (mi > 0) {
      els.push(<line key={`bar${mi}`} x1={bx-2} y1={T-7} x2={bx-2} y2={T+(STRS.length-1)*SH+7}
        stroke={theme.textSub} strokeWidth="1.5" />);
    }
    // Measure number
    els.push(<text key={`m${mi}`} x={bx+2} y={T-9} fontSize="8" fill={theme.textMuted}
      fontFamily="'Space Grotesk',sans-serif">{mi+1}</text>);

    measure.beats.forEach((beat, bi) => {
      const cx = bx + CW/2;
      Object.entries(beat).forEach(([str, fret]) => {
        const si = STRS.indexOf(str);
        if (si < 0) return;
        const cy = T + si * SH;
        els.push(<rect key={`bg${mi}${bi}${str}`} x={cx-10} y={cy-8} width={20} height={16} rx={3} fill={theme.bg} />);
        els.push(<text key={`n${mi}${bi}${str}`} x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill={theme.accent} fontFamily="'Space Grotesk',sans-serif" fontWeight="700">{fret}</text>);
      });
      bx += CW;
    });
  });
  // Double bar end
  els.push(<line key="eb1" x1={bx-2} y1={T-7} x2={bx-2} y2={T+(STRS.length-1)*SH+7} stroke={theme.textSub} strokeWidth="2"/>);
  els.push(<line key="eb2" x1={bx+3} y1={T-7} x2={bx+3} y2={T+(STRS.length-1)*SH+7} stroke={theme.textSub} strokeWidth="4"/>);

  // Playhead cursor
  if (playhead > 0) {
    const px = L + playhead * (W - L - 40);
    els.push(<line key="ph" x1={px} y1={T-7} x2={px} y2={T+(STRS.length-1)*SH+7}
      stroke={theme.accent} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.8" />);
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4 }}>
      <svg width={W+10} height={H} style={{ display: 'block', minWidth: W+10 }}>{els}</svg>
    </div>
  );
}

// ── Chord Diagram ─────────────────────────────────────────────────────────────
function ChordDiagram({ chord, name, orientation, theme }) {
  const frets = chord.frets; // [E A D G B e]
  if (orientation === 'vertical') {
    const FRETS = 5, STRS = 6, cw = 26, ch = 24, lp = 20, tp = 38;
    const W = lp + (STRS-1)*cw + 20, H = tp + FRETS*ch + 28;
    const strlabels = ['E','A','D','G','B','e'];
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* nut */}
        <rect x={lp} y={tp-4} width={(STRS-1)*cw} height={6} rx={2} fill={theme.text} />
        {/* fret lines */}
        {Array.from({length:FRETS}).map((_,fi) =>
          <line key={fi} x1={lp} y1={tp+fi*ch+ch} x2={lp+(STRS-1)*cw} y2={tp+fi*ch+ch} stroke={theme.border} strokeWidth="1" />
        )}
        {/* string lines */}
        {Array.from({length:STRS}).map((_,si) =>
          <line key={si} x1={lp+si*cw} y1={tp} x2={lp+si*cw} y2={tp+FRETS*ch} stroke={theme.textSub} strokeWidth="1" />
        )}
        {/* string names */}
        {strlabels.map((s,si) =>
          <text key={si} x={lp+si*cw} y={H-6} textAnchor="middle" fontSize="9" fill={theme.textSub} fontFamily="'Space Grotesk',sans-serif">{s}</text>
        )}
        {/* dots/open/muted */}
        {frets.map((f, rawIdx) => {
          const si = rawIdx; // 0=E low ... 5=e high
          const x = lp + si * cw;
          if (f === null) return (
            <React.Fragment key={si}>
              <line x1={x-5} y1={tp-22} x2={x+5} y2={tp-12} stroke={theme.textSub} strokeWidth="1.5"/>
              <line x1={x+5} y1={tp-22} x2={x-5} y2={tp-12} stroke={theme.textSub} strokeWidth="1.5"/>
            </React.Fragment>
          );
          if (f === 0) return <circle key={si} cx={x} cy={tp-17} r={5} fill="none" stroke={theme.textSub} strokeWidth="1.5"/>;
          const cy = tp + (f-0.5)*ch;
          return <circle key={si} cx={x} cy={cy} r={9} fill={theme.accent}/>;
        })}
        {/* chord name */}
        <text x={W/2} y={tp-28} textAnchor="middle" fontSize="16" fill={theme.text}
          fontFamily="'Bebas Neue',cursive" letterSpacing="2">{name}</text>
      </svg>
    );
  }

  // Horizontal fretboard view
  const FRETS=5, STRS=6, cw=36, ch=22, lp=36, tp=18;
  const W = lp + FRETS*cw + 24, H = tp + (STRS-1)*ch + 32;
  const strNamesH = ['E','A','D','G','B','e'];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect x={lp-5} y={tp} width={6} height={(STRS-1)*ch} rx={2} fill={theme.text} />
      {Array.from({length:STRS}).map((_,si) =>
        <line key={si} x1={lp} y1={tp+si*ch} x2={lp+FRETS*cw} y2={tp+si*ch}
          stroke={theme.textSub} strokeWidth={si===0||si===STRS-1?1.5:1} />
      )}
      {Array.from({length:FRETS}).map((_,fi) =>
        <line key={fi} x1={lp+(fi+1)*cw} y1={tp} x2={lp+(fi+1)*cw} y2={tp+(STRS-1)*ch} stroke={theme.border} strokeWidth="1" />
      )}
      {strNamesH.map((s,si) =>
        <text key={si} x={lp-10} y={tp+si*ch} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill={theme.textSub} fontFamily="'Space Grotesk',sans-serif">{s}</text>
      )}
      {Array.from({length:FRETS}).map((_,fi) =>
        <text key={fi} x={lp+fi*cw+cw/2} y={H-4} textAnchor="middle" fontSize="8"
          fill={theme.textMuted} fontFamily="'Space Grotesk',sans-serif">{fi+1}</text>
      )}
      {frets.map((f, rawIdx) => {
        const si = rawIdx; // 0=E ...
        if (f===null) return (
          <React.Fragment key={rawIdx}>
            <line x1={lp-20} y1={tp+si*ch-5} x2={lp-11} y2={tp+si*ch+5} stroke={theme.textSub} strokeWidth="1.5"/>
            <line x1={lp-11} y1={tp+si*ch-5} x2={lp-20} y2={tp+si*ch+5} stroke={theme.textSub} strokeWidth="1.5"/>
          </React.Fragment>
        );
        if (f===0) return <circle key={rawIdx} cx={lp-22} cy={tp+si*ch} r={5} fill="none" stroke={theme.textSub} strokeWidth="1.5"/>;
        const cx = lp + (f-0.5)*cw;
        const cy = tp + si*ch;
        return <circle key={rawIdx} cx={cx} cy={cy} r={8} fill={theme.accent}/>;
      })}
      <text x={W/2} y={tp-6} textAnchor="middle" fontSize="14" fill={theme.text}
        fontFamily="'Bebas Neue',cursive" letterSpacing="2">{name}</text>
    </svg>
  );
}

// ── Standard Notation (Staff placeholder) ────────────────────────────────────
function NotationViewer({ theme }) {
  const W = 360, H = 90;
  // Draw a staff with treble clef and some notes
  const staffY = [20, 30, 40, 50, 60];
  const noteXs = [80, 110, 140, 170, 200, 230, 260, 290, 320];
  const noteYs = [40, 35, 45, 30, 40, 50, 35, 45, 40];
  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <svg width={W} height={H} style={{ display: 'block', minWidth: W }}>
        {/* Staff lines */}
        {staffY.map((y, i) =>
          <line key={i} x1={50} y1={y} x2={W-10} y2={y} stroke={theme.textSub} strokeWidth="0.8" />
        )}
        {/* Treble clef placeholder */}
        <text x={54} y={62} fontSize="52" fill={theme.textSub} fontFamily="serif" opacity="0.7">𝄞</text>
        {/* Bar line */}
        <line x1={190} y1={20} x2={190} y2={60} stroke={theme.textSub} strokeWidth="1"/>
        {/* Notes */}
        {noteXs.map((x, i) => (
          <React.Fragment key={i}>
            <ellipse cx={x} cy={noteYs[i]} rx={5} ry={3.5} fill={theme.accent} transform={`rotate(-15,${x},${noteYs[i]})`} />
            <line x1={x+4} y1={noteYs[i]} x2={x+4} y2={noteYs[i]-22} stroke={theme.accent} strokeWidth="1.2"/>
          </React.Fragment>
        ))}
        {/* Label */}
        <text x={W/2} y={H-4} textAnchor="middle" fontSize="8" fill={theme.textMuted} fontFamily="'Space Grotesk',sans-serif">Standard Notation — A Minor Pentatonic</text>
      </svg>
    </div>
  );
}

// ── Video Viewer ──────────────────────────────────────────────────────────────
function VideoViewer({ theme }) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {/* Video placeholder */}
      <div style={{ background: theme.surface2, borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, border: `1px solid ${theme.border}`, cursor: 'pointer' }} onClick={() => setPlaying(!playing)}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: playing ? theme.accentDim : `${theme.accent}33`, border: `2px solid ${playing ? theme.accent+'88' : theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <span style={{ color: theme.accent, fontSize: 22, marginLeft: playing ? 0 : 4 }}>{playing ? '⏸' : '▶'}</span>
        </div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: theme.textSub, textAlign: 'center', lineHeight: 1.4 }}>
          {playing ? 'Playing…' : 'Tap to play'}<br />
          <span style={{ fontSize: 10, color: theme.textMuted }}>A Minor Pentatonic Lick Demo</span>
        </div>
      </div>
      {/* Video controls */}
      <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 3, background: theme.border, borderRadius: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: playing ? '35%' : '0%', background: theme.accent, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: theme.textMuted }}>0:34</span>
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        {['0.75×','1×','1.25×','1.5×'].map(s => (
          <div key={s} style={{ padding: '4px 10px', borderRadius: 6, background: s==='1×' ? theme.accentDim : theme.surface, border: `1px solid ${s==='1×' ? theme.accent+'55' : theme.border}`, fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: s==='1×' ? theme.accent : theme.textSub, cursor: 'pointer' }}>{s}</div>
        ))}
        <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, background: theme.surface, border: `1px solid ${theme.border}`, fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: theme.textSub, cursor: 'pointer' }}>LOOP</div>
      </div>
    </div>
  );
}

// ── Main Notation Screen ──────────────────────────────────────────────────────
function NotationScreen({ theme, onBack }) {
  const [view, setView] = React.useState('tab');
  const [chordName, setChordName] = React.useState('Am');
  const [diagOrientation, setDiagOrientation] = React.useState('vertical');
  const [playing, setPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setPlayhead(p => {
          if (p >= 1) { setPlaying(false); return 0; }
          return p + 0.005;
        });
      }, 50);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${theme.border}` }}>
        <div onClick={onBack} style={{ width: 32, height: 32, borderRadius: 8, background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${theme.border}`, flexShrink: 0 }}>
          <span style={{ color: theme.textSub, fontSize: 14 }}>←</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: theme.text, letterSpacing: 1, lineHeight: 1 }}>{TAB_DATA.title}</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: theme.textSub, marginTop: 2 }}>
            Key: <span style={{ color: theme.accent }}>{TAB_DATA.key}</span> · Tempo: {TAB_DATA.tempo} BPM
          </div>
        </div>
        {/* File type badge */}
        <div style={{ padding: '4px 10px', background: theme.accentDim, borderRadius: 6, border: `1px solid ${theme.accent}44` }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: theme.accent, fontWeight: 700, letterSpacing: 1 }}>GP5</span>
        </div>
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}`, background: theme.surface }}>
        {NOTATION_VIEWS.map(v => (
          <div key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer',
            borderBottom: `2px solid ${view === v.id ? theme.accent : 'transparent'}`,
            transition: 'all 0.2s',
          }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: view === v.id ? theme.accent : theme.textSub }}>
              {v.label}
            </span>
          </div>
        ))}
      </div>

      {/* Transport bar */}
      <div style={{ padding: '8px 16px', background: theme.surface2, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={() => setPlaying(!playing)} style={{ width: 30, height: 30, borderRadius: 8, background: playing ? theme.accent : theme.surface, border: `1px solid ${playing ? theme.accent : theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ color: playing ? '#000' : theme.textSub, fontSize: 12, marginLeft: playing ? 0 : 2 }}>{playing ? '⏸' : '▶'}</span>
        </div>
        <div style={{ flex: 1, height: 3, background: theme.border, borderRadius: 2, position: 'relative', cursor: 'pointer' }}>
          <div style={{ height: '100%', width: `${playhead * 100}%`, background: theme.accent, borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: theme.textMuted, minWidth: 36 }}>
          {String(Math.floor(playhead * 16)).padStart(2,'0')}:{String(Math.floor((playhead * 16 % 1) * 4 + 1))}
        </span>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {view === 'tab' && (
          <div>
            <TabViewer theme={theme} playhead={playhead} />
            <div style={{ marginTop: 16, background: theme.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${theme.border}` }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, color: theme.textSub, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Technique Notes</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: theme.textSub, lineHeight: 1.6 }}>
                Bend the D string on fret 7 a full step. Keep wrist relaxed on the pentatonic runs. Aim for consistent vibrato on sustained notes.
              </div>
            </div>
          </div>
        )}

        {view === 'diagram' && (
          <div>
            {/* Chord selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {Object.keys(CHORDS).map(n => (
                <div key={n} onClick={() => setChordName(n)} style={{
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                  background: chordName === n ? theme.accentDim : theme.surface,
                  border: `1.5px solid ${chordName === n ? theme.accent : theme.border}`,
                  fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: chordName === n ? theme.accent : theme.textSub,
                  transition: 'all 0.15s',
                }}>{n}</div>
              ))}
            </div>
            {/* Orientation toggle */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['vertical','horizontal'].map(o => (
                <div key={o} onClick={() => setDiagOrientation(o)} style={{
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 10,
                  background: diagOrientation === o ? theme.surface2 : theme.surface,
                  border: `1px solid ${diagOrientation === o ? theme.accent : theme.border}`,
                  fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, letterSpacing: 1,
                  color: diagOrientation === o ? theme.accent : theme.textSub, textTransform: 'uppercase',
                }}>{o === 'vertical' ? '⬛ Chord Box' : '▬ Fretboard'}</div>
              ))}
            </div>
            {/* Diagram */}
            <div style={{ display: 'flex', justifyContent: 'center', background: theme.surface, borderRadius: 14, padding: '20px', border: `1px solid ${theme.border}` }}>
              <ChordDiagram chord={CHORDS[chordName]} name={chordName} orientation={diagOrientation} theme={theme} />
            </div>
            <div style={{ marginTop: 14, background: theme.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${theme.border}` }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, color: theme.textSub, lineHeight: 1.5 }}>
                Transpose this chord to all CAGED keys. Try adding non-chord tones for color — major 7th, 9th, or suspended 4th.
              </div>
            </div>
          </div>
        )}

        {view === 'notation' && (
          <div>
            <div style={{ background: theme.surface, borderRadius: 12, padding: '16px 14px', border: `1px solid ${theme.border}` }}>
              <NotationViewer theme={theme} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {['Concert Pitch','Transposed','Bass Clef'].map(opt => (
                <div key={opt} style={{ flex: 1, padding: '8px 6px', borderRadius: 8, background: opt==='Concert Pitch' ? theme.accentDim : theme.surface, border: `1px solid ${opt==='Concert Pitch' ? theme.accent+'55' : theme.border}`, textAlign: 'center', cursor: 'pointer' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: opt==='Concert Pitch' ? theme.accent : theme.textSub, fontWeight: 700 }}>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'video' && (
          <VideoViewer theme={theme} />
        )}
      </div>
    </div>
  );
}

Object.assign(window, { NotationScreen, TabViewer, ChordDiagram, NotationViewer, VideoViewer, CHORDS, TAB_DATA });
