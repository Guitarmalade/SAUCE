
// sauce-recorder.jsx — Video record → side-by-side review → reflect & rate → complete

const RATE_CRITERIA = [
  { id: 'tempo',    label: 'Tempo & Pocket',     desc: 'Did you stay locked in the groove?' },
  { id: 'space',    label: 'Use of Space',        desc: 'Did you leave room to breathe?' },
  { id: 'intent',   label: 'Melodic Intent',      desc: 'Did your phrases have direction?' },
  { id: 'tricks',   label: 'Bag O\' Tricks',       desc: 'Did you use your chosen licks?' },
  { id: 'feel',     label: 'Feel & Musicality',   desc: 'Did it feel alive and musical?' },
];

const XP_TABLE = { 1:50, 2:80, 3:120, 4:160, 5:200 };

function StarRating({ value, onChange, color }) {
  const [hover, setHover] = React.useState(0);
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[1,2,3,4,5].map(n => (
        <div key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize:22, cursor:'pointer', transition:'transform .1s', transform: n <= (hover||value) ? 'scale(1.15)' : 'scale(1)', color: n <= (hover||value) ? color : '#2A2A2A' }}>
          ★
        </div>
      ))}
    </div>
  );
}

function RecordAndReviewScreen({ theme, tricks, progression, songKey, onDone }) {
  const [phase, setPhase]       = React.useState('camera'); // camera | review | rate | complete
  const [recording, setRecording] = React.useState(false);
  const [recSecs, setRecSecs]   = React.useState(0);
  const [blobUrl, setBlobUrl]   = React.useState(null);
  const [ratings, setRatings]   = React.useState({});
  const [reflection, setReflection] = React.useState('');
  const [flagCoach, setFlagCoach]   = React.useState(false);
  const [camError, setCamError]     = React.useState(false);
  const [syncPlay, setSyncPlay]     = React.useState(false);

  const liveRef    = React.useRef(null);
  const playbackRef= React.useRef(null);
  const refVidRef  = React.useRef(null);
  const mediaRef   = React.useRef(null);
  const chunksRef  = React.useRef([]);
  const timerRef   = React.useRef(null);
  const streamRef  = React.useRef(null);

  const avgRating = Object.values(ratings).length
    ? Math.round(Object.values(ratings).reduce((a,b)=>a+b,0) / Object.values(ratings).length)
    : 3;
  const xpEarned = (XP_TABLE[avgRating] || 120) + (flagCoach ? 20 : 0);

  // Start camera on mount
  React.useEffect(() => {
    startCamera();
    return () => { stopStream(); clearInterval(timerRef.current); };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (liveRef.current) { liveRef.current.srcObject = stream; liveRef.current.play(); }
    } catch (e) {
      console.warn('Camera unavailable:', e.message);
      setCamError(true);
    }
  };

  const stopStream = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const startRecording = () => {
    if (!streamRef.current) { setRecording(true); setRecSecs(0); timerRef.current = setInterval(() => setRecSecs(s => s+1), 1000); return; }
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const mr = new MediaRecorder(streamRef.current, { mimeType });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setBlobUrl(URL.createObjectURL(blob));
    };
    mr.start(100);
    mediaRef.current = mr;
    setRecording(true);
    setRecSecs(0);
    timerRef.current = setInterval(() => setRecSecs(s => s+1), 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop();
    stopStream();
    setTimeout(() => setPhase('review'), 600);
  };

  const handleSyncPlay = () => {
    setSyncPlay(true);
    if (playbackRef.current) { playbackRef.current.currentTime = 0; playbackRef.current.play(); }
    if (refVidRef.current)   { refVidRef.current.currentTime = 0;   refVidRef.current.play();   }
  };

  const saveSession = () => {
    const record = { date: new Date().toISOString(), ratings, reflection, flagCoach, xpEarned, key: songKey, progression, tricks: [...tricks] };
    try {
      const existing = JSON.parse(localStorage.getItem('gm_recordings') || '[]');
      existing.unshift(record);
      localStorage.setItem('gm_recordings', JSON.stringify(existing.slice(0, 20)));
    } catch(e) {}
    onDone({ xpEarned, ratings, flagCoach });
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // ── CAMERA phase ─────────────────────────────────────────────────────────────
  if (phase === 'camera') return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#000' }}>
      {/* Live camera or placeholder */}
      <div style={{ flex:1, position:'relative', background:'#111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {!camError ? (
          <video ref={liveRef} muted playsInline autoPlay style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:48 }}>📹</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:'#666', textAlign:'center', lineHeight:1.5 }}>
              Camera not available in preview.<br/>In the real app, your session records here.
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {recording && (
          <div style={{ position:'absolute', top:16, left:16, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#FF3333', animation:'recBlink .8s ease-in-out infinite' }} />
            <span style={{ fontFamily:"'Bebas Neue',cursive", fontSize:18, color:'#FFF', letterSpacing:2 }}>REC {fmt(recSecs)}</span>
          </div>
        )}

        {/* Context overlay */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,.85))', padding:'32px 20px 16px' }}>
          <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:14, color:theme.accent, letterSpacing:2, marginBottom:4 }}>BLAST OFF — Key of {songKey}</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {[...tricks].slice(0,4).map(id => {
              const t = (window.BAG_OF_TRICKS||[]).find(b=>b.id===id);
              return t ? <div key={id} style={{ background:`${theme.accent}25`, border:`1px solid ${theme.accent}44`, borderRadius:12, padding:'3px 8px', fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.accent }}>{t.name}</div> : null;
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background:'#0A0A0A', padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
        {!recording ? (
          <button onClick={startRecording} style={{
            width:'100%', height:56, borderRadius:theme.radius, border:'none', cursor:'pointer',
            background:`linear-gradient(135deg, #FF3333, #FF6600)`,
            fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:2, color:'#FFF',
            boxShadow:'0 4px 20px #FF333355',
          }}>● START RECORDING</button>
        ) : (
          <button onClick={stopRecording} style={{
            width:'100%', height:56, borderRadius:theme.radius, border:'none', cursor:'pointer',
            background:'#1A1A1A', border:'2px solid #FF3333',
            fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:2, color:'#FF3333',
          }}>■ STOP & REVIEW</button>
        )}
        {!recording && (
          <button onClick={() => setPhase('review')} style={{ width:'100%', height:40, borderRadius:theme.radius, border:`1px solid ${theme.border}`, background:'transparent', fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub, cursor:'pointer' }}>
            Skip recording — go to review →
          </button>
        )}
      </div>
      <style>{`@keyframes recBlink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
    </div>
  );

  // ── REVIEW phase ──────────────────────────────────────────────────────────────
  if (phase === 'review') return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:theme.bg }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`1px solid ${theme.border}` }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:26, color:theme.text, letterSpacing:1 }}>SIDE BY SIDE</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub }}>Compare your take to the reference. Be honest.</div>
      </div>

      {/* Side by side videos */}
      <div style={{ display:'flex', gap:8, padding:'14px 14px 0' }}>
        {/* Your take */}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.accent, letterSpacing:2, fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Your Take</div>
          <div style={{ background:'#111', borderRadius:10, aspectRatio:'9/16', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${theme.border}`, overflow:'hidden' }}>
            {blobUrl ? (
              <video ref={playbackRef} src={blobUrl} playsInline style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <div style={{ textAlign:'center', padding:12 }}>
                <div style={{ fontSize:28, marginBottom:6 }}>📹</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:'#555' }}>Your recording</div>
              </div>
            )}
          </div>
        </div>
        {/* Reference */}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.textSub, letterSpacing:2, fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Reference</div>
          <div style={{ background:'#111', borderRadius:10, aspectRatio:'9/16', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${theme.border}`, overflow:'hidden' }}>
            <div style={{ textAlign:'center', padding:12 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>🎸</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:'#555', lineHeight:1.4 }}>Instructor<br/>Reference</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync play button */}
      <div style={{ padding:'12px 14px 0' }}>
        <button onClick={handleSyncPlay} style={{
          width:'100%', height:42, borderRadius:10, border:`1px solid ${theme.accent}55`,
          background:theme.accentDim, fontFamily:"'Bebas Neue',cursive", fontSize:18,
          letterSpacing:2, color:theme.accent, cursor:'pointer',
        }}>▶ PLAY BOTH TOGETHER</button>
      </div>

      {/* Observations prompt */}
      <div style={{ margin:'12px 14px 0', background:theme.surface, borderRadius:theme.radius, padding:'12px 14px', border:`1px solid ${theme.border}`, flex:1 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, marginBottom:8, textTransform:'uppercase' }}>What do you notice?</div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {['Timing differences','Phrasing & note choice','Tone & dynamics','Use of techniques','Overall feel'].map((item,i) => (
            <div key={i} style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textMuted, display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:theme.accent, flexShrink:0, opacity:0.5 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px 14px 24px' }}>
        <button onClick={() => setPhase('rate')} style={{
          width:'100%', height:52, borderRadius:theme.radius, border:'none', cursor:'pointer',
          background:`linear-gradient(135deg,${theme.accent},#FFD600)`,
          fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:2, color:'#000',
          boxShadow:`0 4px 20px ${theme.accent}44`,
        }}>RATE THIS TAKE →</button>
      </div>
    </div>
  );

  // ── RATE phase ────────────────────────────────────────────────────────────────
  if (phase === 'rate') return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:theme.bg, overflowY:'auto' }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`1px solid ${theme.border}` }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:26, color:theme.text, letterSpacing:1 }}>REFLECT & RATE</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub }}>Honest self-assessment builds faster growth than anything else.</div>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
        {/* Criteria */}
        <div style={{ padding:'14px 20px 0', display:'flex', flexDirection:'column', gap:14 }}>
          {RATE_CRITERIA.map(c => (
            <div key={c.id} style={{ background:theme.surface, borderRadius:theme.radius, padding:'14px 16px', border:`1px solid ${theme.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:theme.text, fontWeight:700 }}>{c.label}</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textSub, marginTop:2 }}>{c.desc}</div>
                </div>
                {ratings[c.id] && (
                  <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:22, color:theme.accent, lineHeight:1 }}>{ratings[c.id]}</div>
                )}
              </div>
              <StarRating value={ratings[c.id]||0} onChange={v => setRatings(r=>({...r,[c.id]:v}))} color={theme.accent} />
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div style={{ margin:'14px 20px 0', background:theme.surface, borderRadius:theme.radius, padding:'14px 16px', border:`1px solid ${theme.border}`, borderLeft:`3px solid ${theme.accent}` }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.accent, letterSpacing:2, marginBottom:8, textTransform:'uppercase' }}>One Thing I'd Do Differently</div>
          <textarea value={reflection} onChange={e=>setReflection(e.target.value)}
            placeholder="Next take I'll focus more on leaving space in my phrases…"
            rows={3} style={{ width:'100%', background:'transparent', border:'none', outline:'none', fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:theme.text, resize:'none', lineHeight:1.6, caretColor:theme.accent }} />
        </div>

        {/* Average score preview */}
        {Object.keys(ratings).length > 0 && (
          <div style={{ margin:'12px 20px 0', background:theme.accentDim, borderRadius:theme.radius, padding:'12px 16px', border:`1px solid ${theme.accent}33`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.accent, letterSpacing:2, textTransform:'uppercase', marginBottom:3 }}>Session Score</div>
              <div style={{ display:'flex', gap:3 }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize:16, color: n<=avgRating ? theme.accent : '#333' }}>★</span>)}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:32, color:theme.accent, lineHeight:1 }}>+{XP_TABLE[avgRating]||120}</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:theme.textSub }}>XP EARNED</div>
            </div>
          </div>
        )}

        {/* Flag for coach */}
        <div onClick={() => setFlagCoach(f=>!f)} style={{ margin:'12px 20px 0', background:flagCoach?theme.accentDim:theme.surface, borderRadius:theme.radius, padding:'12px 16px', border:`1px solid ${flagCoach?theme.accent+'55':theme.border}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'all .2s' }}>
          <div style={{ width:22,height:22,borderRadius:6,background:flagCoach?theme.accent:'transparent',border:`1.5px solid ${flagCoach?theme.accent:theme.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            {flagCoach && <span style={{ color:'#000', fontSize:12 }}>✓</span>}
          </div>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, color:flagCoach?theme.text:theme.textSub, fontWeight:600 }}>Flag for Coach Review</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:theme.textMuted, marginTop:1 }}>Your instructor will review this take + your ratings {flagCoach ? '· +20 XP':''}
            </div>
          </div>
        </div>

        <div style={{ padding:'16px 20px 32px' }}>
          <button onClick={() => setPhase('complete')} disabled={Object.keys(ratings).length < 3}
            style={{
              width:'100%', height:54, borderRadius:theme.radius, border:'none', cursor: Object.keys(ratings).length < 3 ? 'not-allowed':'pointer',
              background: Object.keys(ratings).length < 3 ? theme.surface : `linear-gradient(135deg,${theme.accent},#FFD600)`,
              fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:2,
              color: Object.keys(ratings).length < 3 ? theme.textMuted : '#000',
              border: Object.keys(ratings).length < 3 ? `1px solid ${theme.border}` : 'none',
              opacity: Object.keys(ratings).length < 3 ? 0.5 : 1,
              boxShadow: Object.keys(ratings).length < 3 ? 'none' : `0 4px 20px ${theme.accent}44`,
            }}>
            {Object.keys(ratings).length < 3 ? `Rate ${3-Object.keys(ratings).length} more criteria` : 'SAVE SESSION →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── COMPLETE phase ────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:theme.bg, padding:28, gap:20 }}>
      {/* XP burst */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:72, color:theme.accent, lineHeight:1, animation:'xpPop .5s cubic-bezier(.36,.07,.19,.97)' }}>+{xpEarned}</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, color:theme.textSub, letterSpacing:3, textTransform:'uppercase' }}>XP Earned</div>
      </div>

      {/* Score summary */}
      <div style={{ background:theme.surface, borderRadius:theme.radius, padding:'18px 20px', width:'100%', border:`1px solid ${theme.border}` }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.textSub, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Session Ratings</div>
        {RATE_CRITERIA.map(c => (
          <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub }}>{c.label}</span>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:13, color:n<=(ratings[c.id]||0)?theme.accent:'#2A2A2A' }}>★</span>)}
            </div>
          </div>
        ))}
        {reflection && (
          <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${theme.border}` }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:theme.accent, letterSpacing:2, marginBottom:4, textTransform:'uppercase' }}>Your Reflection</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub, fontStyle:'italic', lineHeight:1.5 }}>"{reflection}"</div>
          </div>
        )}
      </div>

      {flagCoach && (
        <div style={{ background:theme.accentDim, borderRadius:theme.radius, padding:'10px 16px', width:'100%', border:`1px solid ${theme.accent}44`, display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:18 }}>👨‍🏫</span>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:theme.textSub }}>Flagged for coach review — your instructor will respond within 48h.</div>
        </div>
      )}

      <button onClick={saveSession} style={{
        width:'100%', height:54, borderRadius:theme.radius, border:'none', cursor:'pointer',
        background:`linear-gradient(135deg,${theme.accent},#FFD600)`,
        fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:2, color:'#000',
        boxShadow:`0 4px 20px ${theme.accent}44`,
      }}>BACK TO DASHBOARD →</button>

      <style>{`@keyframes xpPop{0%{transform:scale(.5);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

Object.assign(window, { RecordAndReviewScreen, RATE_CRITERIA });
