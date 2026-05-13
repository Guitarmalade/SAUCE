// Interactive Kitchen — focused Current Recipe view with sub-step path + real tab
const KitchenScreen = ({ tweaks = {}, onNav }) => {
  const SKILL_COLORS = {
    blues: "#F5A623", rock: "#E63678", theory: "#8B5BD6",
    ear: "#B6E94B", songwriting: "#2BC9E6", rhythm: "#FF5A3C",
  };

  const recipe = {
    title: "12-Bar Blues in E",
    skill: "blues",
    stage: "A",
    stageName: "Assimilate",
    minutes: 15,
    bpm: 90,
    xp: 150,
  };
  const skill = SKILL_COLORS[recipe.skill];

  // Sub-step waypoints inside this recipe
  const subSteps = [
    { i: 1, title: "Shuffle on E7", bars: "1–4",   state: "done" },
    { i: 2, title: "IV change (A7)", bars: "5–6",  state: "done" },
    { i: 3, title: "Back home (E7)", bars: "7–8",  state: "current" },
    { i: 4, title: "V → IV turnaround", bars: "9–10", state: "next" },
    { i: 5, title: "Bring it home",     bars: "11–12", state: "locked" },
  ];

  const [activeStep, setActiveStep] = React.useState(2);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [tempo, setTempo] = React.useState(90);
  const [celebrate, setCelebrate] = React.useState(false);

  React.useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ padding: "0 56px 56px", position: "relative" }}>
      {/* Top bar: back + title + reward */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
        <button onClick={() => onNav?.("dashboard")} style={{
          width: 50, height: 50, borderRadius: 16, background: "var(--cream-warm)",
          border: "2.5px solid var(--ink)", cursor: "pointer", color: "var(--ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "4px 4px 0 var(--ink)",
        }}>
          <Icon name="arrow-left" size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: skill }}/>
            <span className="label-eyebrow" style={{ color: "var(--ink-mid)" }}>
              BLUES · STAGE {recipe.stage} · {recipe.stageName.toUpperCase()}
            </span>
          </div>
          <h1 className="drip-text" style={{ margin: "2px 0 0", fontSize: 48, color: "var(--ink)", lineHeight: 1 }}>
            {recipe.title.split(" in ")[0]} <span style={{ color: skill }}>in E</span>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tag>⏱ {recipe.minutes} min</Tag>
          <Tag>♪ {recipe.bpm} BPM</Tag>
          <Tag highlight>+{recipe.xp} XP</Tag>
        </div>
      </div>

      {/* Recipe sub-step path */}
      <div style={{
        position: "relative", padding: "20px 28px",
        background: "var(--cream-warm)", borderRadius: "var(--r-lg)",
        border: "2px solid var(--cream-shadow)", marginBottom: 22, overflow: "hidden",
      }}>
        <Splat.Specks color={skill} size={120} seed={3} style={{ position: "absolute", top: 6, right: 12, opacity: .35 }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <span className="label-eyebrow">Recipe path</span>
            <h3 className="drip-text" style={{ margin: "2px 0 0", fontSize: 22, color: "var(--ink)" }}>
              5 sections · cook them in order
            </h3>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-mid)" }}>
            <span style={{ color: skill, fontFamily: "var(--display)", fontSize: 22 }}>2</span> / 5 done
          </div>
        </div>

        {/* horizontal path */}
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${subSteps.length}, 1fr)`, gap: 0, alignItems: "flex-start", paddingTop: 12, paddingBottom: 8 }}>
          {/* connecting line */}
          <div style={{
            position: "absolute", top: 36, left: `${100 / subSteps.length / 2}%`,
            right: `${100 / subSteps.length / 2}%`, height: 6,
            background: `repeating-linear-gradient(90deg, var(--cream-shadow) 0 8px, transparent 8px 16px)`,
            borderRadius: 999, zIndex: 0,
          }}/>
          {/* solid done portion */}
          <div style={{
            position: "absolute", top: 36, left: `${100 / subSteps.length / 2}%`,
            width: `${(100 / subSteps.length) * (subSteps.findIndex(s => s.state === "current"))}%`, height: 6,
            background: skill, borderRadius: 999, zIndex: 1,
          }}/>

          {subSteps.map((s, i) => {
            const active = i === activeStep;
            const stateColors = {
              done: { bg: skill, fg: "var(--ink)", ring: "var(--ink)" },
              current: { bg: "var(--ink)", fg: skill, ring: skill },
              next: { bg: "var(--cream-warm)", fg: skill, ring: skill },
              locked: { bg: "var(--cream-shadow)", fg: "var(--ink-faint)", ring: "var(--ink-faint)" },
            }[s.state];
            return (
              <button key={s.i} onClick={() => s.state !== "locked" && setActiveStep(i)}
                disabled={s.state === "locked"}
                style={{
                  position: "relative", zIndex: 2,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: "transparent", border: "none", padding: 0,
                  cursor: s.state === "locked" ? "not-allowed" : "pointer",
                  opacity: s.state === "locked" ? .55 : 1,
                }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: stateColors.bg, color: stateColors.fg,
                  border: `3px ${s.state === "locked" ? "dashed" : "solid"} ${stateColors.ring}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--display)", fontSize: 26,
                  boxShadow: active ? `0 0 0 4px ${skill}33, 4px 4px 0 ${skill}` : "none",
                  transition: "transform .15s, box-shadow .15s",
                  transform: active ? "translateY(-2px) scale(1.04)" : "none",
                }}>
                  {s.state === "done" ? "✓" : s.state === "locked" ? "🔒" : s.i}
                </div>
                <div style={{ textAlign: "center", maxWidth: 130 }}>
                  <div className="label-eyebrow" style={{ fontSize: 9 }}>BARS {s.bars}</div>
                  <div style={{ marginTop: 2, fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{s.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN: tab + side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "flex-start" }}>
        {/* Tab embed */}
        <AlphaTabPlayer
          tempo={tempo} onTempoChange={setTempo}
          isPlaying={timerRunning} onPlayPause={() => setTimerRunning(t => !t)}
          activeStep={activeStep} skill={skill}
        />

        {/* Side: timer + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Timer */}
          <div style={{
            position: "relative", borderRadius: "var(--r-xl)",
            background: "var(--ink)", color: "var(--cream-warm)",
            padding: 22, border: "3px solid var(--ink)", overflow: "hidden",
            boxShadow: "var(--shadow-pop)",
          }}>
            <Splat.Burst color={skill} size={180} style={{ position: "absolute", top: -50, right: -40, opacity: .25 }} rotate={45}/>
            <div className="label-eyebrow" style={{ color: skill, position: "relative", zIndex: 2 }}>
              {timerRunning ? "🔥 You're cooking" : "Ready when you are"}
            </div>
            <div className="drip-text" style={{ fontSize: 78, lineHeight: 1, marginTop: 4, color: "var(--cream-warm)", position: "relative", zIndex: 2 }}>
              {mm}<span style={{ color: skill }}>:</span>{ss}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, position: "relative", zIndex: 2 }}>
              <button onClick={() => setTimerRunning(t => !t)} style={{
                flex: 1, padding: "14px 16px", borderRadius: 14,
                background: skill, color: "var(--ink)", border: "none",
                fontFamily: "var(--body)", fontWeight: 900, fontSize: 15, cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: `4px 4px 0 var(--punch)`,
              }}>
                <Icon name={timerRunning ? "pause" : "play"} size={16}/>
                {timerRunning ? "Pause" : "Start"}
              </button>
              <button onClick={() => setCelebrate(true)} style={{
                padding: "14px 14px", borderRadius: 14,
                background: "var(--punch)", color: "var(--cream-warm)", border: "none",
                fontFamily: "var(--body)", fontWeight: 800, fontSize: 13, cursor: "pointer",
                boxShadow: `4px 4px 0 ${skill}`,
              }}>Done ✓</button>
            </div>
          </div>

          {/* Section instruction */}
          <div style={{
            position: "relative", padding: 20, borderRadius: "var(--r-lg)",
            background: "var(--cream-warm)", border: "2px solid var(--cream-shadow)", overflow: "hidden",
          }}>
            <Splat.Specks color={skill} size={80} seed={9} style={{ position: "absolute", bottom: 4, right: 8, opacity: .3 }}/>
            <div className="label-eyebrow" style={{ color: skill }}>Section #{activeStep + 1}</div>
            <h4 className="drip-text" style={{ margin: "4px 0 0", fontSize: 22, color: "var(--ink)" }}>{subSteps[activeStep].title}</h4>
            <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-soft)", fontWeight: 500, lineHeight: 1.4 }}>
              {SECTION_TIPS[activeStep] || "Hit the changes cleanly. Eyes off the fretboard once you trust the shape."}
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <MiniBtn onClick={() => setTempo(Math.round(tempo * 0.75))}>75% speed</MiniBtn>
              <MiniBtn onClick={() => setTempo(90)}>Full speed</MiniBtn>
              <MiniBtn>Loop section</MiniBtn>
            </div>
          </div>

          {/* Hints */}
          <div style={{
            padding: 18, borderRadius: "var(--r-md)",
            background: "var(--cream)", border: "1.5px dashed var(--ink-faint)",
          }}>
            <div className="label-eyebrow">Need a hint?</div>
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-mid)", fontWeight: 500, lineHeight: 1.4 }}>
              Use the slow-mo + loop buttons above to drill any sloppy section. Each completed section earns +30 XP toward the recipe's {recipe.xp}.
            </p>
          </div>
        </div>
      </div>

      <CelebrationOverlay open={celebrate} onClose={() => { setCelebrate(false); onNav?.("dashboard"); }}
        goal={recipe.title} xp={recipe.xp} streak={3}/>
    </div>
  );
};

const SECTION_TIPS = [
  "The classic shuffle. Down-up alternate picking, palm-mute lightly. Lock with the metronome on beats 2 and 4.",
  "The IV chord. Same shuffle pattern but on the A string root. Watch your wrist — don't tighten up.",
  "Back to the I. Listen for the resolution. This is the easy section — internalize the groove.",
  "The turnaround. V chord (B7) for one bar, drop down to IV (A7) for the next. The most distinctive moment.",
  "Bring it home. Last two bars resolve back to E7. Add a fill or a single-note line if you're feeling it.",
];

const Tag = ({ children, highlight }) => (
  <span style={{
    padding: "8px 14px", borderRadius: 999,
    background: highlight ? "var(--punch)" : "var(--cream-warm)",
    color: highlight ? "var(--cream-warm)" : "var(--ink)",
    border: highlight ? "none" : "1.5px solid var(--cream-shadow)",
    fontWeight: 800, fontSize: 13,
  }}>{children}</span>
);

const MiniBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 12px", borderRadius: 999, background: "var(--cream)",
    border: "1.5px solid var(--ink)", color: "var(--ink)",
    fontWeight: 800, fontSize: 11, cursor: "pointer",
    fontFamily: "var(--body)",
  }}>{children}</button>
);

// =========================================================================
// AlphaTab embed — real scrolling guitar tab + playback
// =========================================================================
const TWELVE_BAR_E_TEX = `\\title "12-Bar Blues in E"
\\subtitle "Shuffle feel"
\\artist "GUitarmalade"
\\tempo 90
\\instrument 25
.
// Bar 1 - E7
:8 (0.6 2.5){d}.0.6{d}.4.5{d}.0.6{d}.5.5{d}.0.6{d}.4.5{d}.0.6{d}.2.5{d} |
// Bar 2 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 3 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 4 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 5 - A7
:8 (0.5 2.4){d} 0.5{d} 4.4{d} 0.5{d} 5.4{d} 0.5{d} 4.4{d} 0.5{d} 2.4{d} |
// Bar 6 - A7
:8 0.5{d} 4.4{d} 0.5{d} 5.4{d} 0.5{d} 4.4{d} 0.5{d} 2.4{d} |
// Bar 7 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 8 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 9 - B7
:8 2.5{d} 4.4{d} 2.5{d} 5.4{d} 2.5{d} 4.4{d} 2.5{d} 4.4{d} |
// Bar 10 - A7
:8 0.5{d} 4.4{d} 0.5{d} 5.4{d} 0.5{d} 4.4{d} 0.5{d} 2.4{d} |
// Bar 11 - E7
:8 0.6{d} 4.5{d} 0.6{d} 5.5{d} 0.6{d} 4.5{d} 0.6{d} 2.5{d} |
// Bar 12 - E7 turnaround
:4 0.6 :8 2.5 4.5 :4 (1.4 0.3 2.2 0.1){.}.|`;

const AlphaTabPlayer = ({ tempo, onTempoChange, isPlaying, onPlayPause, activeStep, skill }) => {
  const containerRef = React.useRef(null);
  const viewportRef = React.useRef(null);
  const apiRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [loadProgress, setLoadProgress] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    if (typeof alphaTab === "undefined") {
      console.warn("alphaTab not loaded");
      return;
    }

    const settings = {
      core: {
        tex: true,
        fontDirectory: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.4.4/dist/font/",
      },
      display: {
        scale: 1.0,
        staveProfile: "tab",
        layoutMode: "page",
        resources: {
          mainGlyphColor: "#141A36",
          secondaryGlyphColor: "#141A36",
          staffLineColor: "#141A36",
          barSeparatorColor: "#141A36",
          barNumberColor: "#4A5078",
          scoreInfoColor: "#141A36",
        },
      },
      player: {
        enablePlayer: true,
        enableUserInteraction: true,
        enableCursor: true,
        soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.4.4/dist/soundfont/sonivox.sf2",
        scrollMode: "continuous",
        scrollSpeed: 300,
        scrollElement: viewportRef.current,
      },
    };

    try {
      const api = new alphaTab.AlphaTabApi(containerRef.current, settings);
      apiRef.current = api;

      api.soundFontLoad.on(e => {
        if (e && e.total) setLoadProgress(Math.round((e.loaded / e.total) * 100));
      });
      api.playerReady.on(() => setReady(true));
      api.renderFinished.on(() => {/* layout done */});
      api.tex(TWELVE_BAR_E_TEX, [0]);
    } catch (err) {
      console.error("alphaTab init failed:", err);
    }

    return () => {
      try { apiRef.current?.destroy(); } catch (e) {}
    };
  }, []);

  // sync play state
  React.useEffect(() => {
    if (!apiRef.current || !ready) return;
    try {
      if (isPlaying) apiRef.current.play();
      else apiRef.current.pause();
    } catch (e) {}
  }, [isPlaying, ready]);

  // sync tempo
  React.useEffect(() => {
    if (!apiRef.current || !ready) return;
    try {
      apiRef.current.playbackSpeed = tempo / 90;
    } catch (e) {}
  }, [tempo, ready]);

  return (
    <div style={{
      position: "relative", borderRadius: "var(--r-lg)",
      background: "var(--cream-warm)", border: "3px solid var(--ink)",
      boxShadow: "var(--shadow-pop)", overflow: "hidden", minHeight: 480,
      display: "flex", flexDirection: "column",
    }}>
      {/* header */}
      <div style={{
        padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--ink)", color: "var(--cream-warm)", borderBottom: `4px solid ${skill}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🎸</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em", color: "rgba(255,255,255,.55)" }}>NOTATION · alphaTab</div>
            <div className="drip-text" style={{ fontSize: 18, color: "var(--cream-warm)", lineHeight: 1 }}>Scrolling tab</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onPlayPause} style={{
            padding: "8px 16px", borderRadius: 10, border: "none",
            background: skill, color: "var(--ink)", fontWeight: 900, fontSize: 13, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name={isPlaying ? "pause" : "play"} size={14}/>
            {isPlaying ? "Pause" : "Play tab"}
          </button>
          <div style={{ display: "flex", gap: 4 }}>
            {[60, 75, 90, 110].map(t => (
              <button key={t} onClick={() => onTempoChange(t)} style={{
                padding: "6px 10px", borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,.2)",
                background: tempo === t ? skill : "transparent",
                color: tempo === t ? "var(--ink)" : "var(--cream-warm)",
                fontWeight: 800, fontSize: 11, cursor: "pointer", fontFamily: "var(--body)",
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* tab viewport */}
      <div ref={viewportRef} style={{
        position: "relative", flex: 1, overflow: "auto", padding: "20px",
        background: "var(--cream-warm)", maxHeight: 460,
      }}>
        {!ready && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 8, background: "var(--cream-warm)", zIndex: 10,
          }}>
            <div className="drip-text" style={{ fontSize: 28, color: skill }}>Tuning up…</div>
            <div style={{ width: 200, height: 6, background: "var(--cream-shadow)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${loadProgress}%`, height: "100%", background: skill, transition: "width .2s" }}/>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-mid)" }}>Loading sounds {loadProgress}%</div>
          </div>
        )}
        <div ref={containerRef}/>
      </div>

      {/* footer hint */}
      <div style={{
        padding: "10px 22px", background: "var(--cream)", borderTop: "1.5px solid var(--cream-shadow)",
        display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "var(--ink-mid)",
      }}>
        <span>Click any note to jump there. Cursor follows playback.</span>
        <span>Powered by alphaTab</span>
      </div>
    </div>
  );
};

window.KitchenScreen = KitchenScreen;
