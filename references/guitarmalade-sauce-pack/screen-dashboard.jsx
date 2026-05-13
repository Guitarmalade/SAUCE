// Dashboard screen — bold, dynamic, captivating
const DashboardScreen = ({ tweaks = {}, onNav }) => {
  const intensity = tweaks.splashIntensity || "medium";
  const streak = tweaks.streakDays ?? 1;
  const xp = tweaks.xp ?? 2350;
  const focusTitle = "12-Bar Blues in E";

  return (
    <div style={{ position: "relative" }}>
      {/* Hero strip with massive streak + focus */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(420px, 1.1fr) 2fr",
        gap: 24,
        padding: "0 56px",
      }}>
        {/* STREAK CARD — full bleed paint */}
        <StreakHero days={streak} intensity={intensity} />

        {/* TODAY'S FOCUS */}
        <FocusCard title={focusTitle} onNav={onNav} intensity={intensity} />
      </div>

      {/* MID ROW — quick stats marquee */}
      <div style={{ marginTop: 28, padding: "0 56px" }}>
        <StatsMarquee xp={xp} />
      </div>

      {/* BOTTOM ROW — practice journey + log */}
      <div style={{
        marginTop: 28,
        padding: "0 56px 56px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        gap: 24,
      }}>
        <PracticeJourney />
        <LogKitchen />
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// STREAK HERO
// -------------------------------------------------------------------------
const StreakHero = ({ days = 1, intensity }) => {
  return (
    <div style={{
      position: "relative",
      borderRadius: "var(--r-xl)",
      background: "linear-gradient(155deg, #14182E 0%, #1E2447 80%)",
      color: "var(--cream-warm)",
      padding: "28px 30px",
      overflow: "hidden",
      minHeight: 340,
      boxShadow: "var(--shadow-pop)",
      border: "3px solid var(--ink)",
    }}>
      {/* paint splatters bg */}
      <Splat.Burst color="#E63678" size={280} style={{ position: "absolute", top: -80, right: -60, opacity: .35 }} rotate={20}/>
      <Splat.Drip color="#F5A623" size={200} style={{ position: "absolute", bottom: -40, left: -20, opacity: .25 }} rotate={180}/>
      <Splat.Specks color="#FCF6E8" size={180} seed={9} style={{ position: "absolute", top: 60, right: 80, opacity: .4 }}/>

      {/* eyebrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".22em", fontWeight: 800, color: "var(--marmalade)" }}>
          🔥 Current streak
        </div>
        <div style={{
          padding: "4px 10px", background: "rgba(245,166,35,.15)", color: "var(--marmalade)",
          borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
        }}>
          PERSONAL BEST: 14 DAYS
        </div>
      </div>

      {/* MASSIVE number */}
      <div style={{ position: "relative", marginTop: 18, zIndex: 2 }}>
        <div className="drip-text" style={{
          fontSize: 220, lineHeight: .82,
          color: "var(--marmalade)",
          textShadow: "0 0 0 transparent",
          letterSpacing: "-0.02em",
          position: "relative",
        }}>
          {String(days).padStart(2, "0")}
        </div>
        {/* drip behind number */}
        <Splat.Drip color="#F5A623" size={110} style={{ position: "absolute", top: 165, left: 30, opacity: .55, zIndex: -1 }}/>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 4 }}>
        <div className="drip-text" style={{ fontSize: 44, color: "var(--cream-warm)" }}>
          day<span style={{ color: "var(--punch)" }}>s</span> hot
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
          Practice today<br/>to keep it cookin'
        </div>
      </div>

      {/* dotted week strip */}
      <div style={{ marginTop: 22, display: "flex", gap: 10, alignItems: "center", position: "relative", zIndex: 2 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => {
          const done = i < days;
          const today = i === days;
          return (
            <div key={i} style={{
              flex: 1, padding: "8px 0", textAlign: "center",
              background: done ? "var(--marmalade)" : today ? "rgba(245,166,35,.15)" : "rgba(255,255,255,.05)",
              color: done ? "var(--ink)" : "var(--cream-warm)",
              border: today ? "2px dashed var(--marmalade)" : "2px solid transparent",
              borderRadius: 12, fontWeight: 800, fontSize: 13,
            }}>
              <div style={{ fontSize: 10, opacity: .7 }}>{d}</div>
              <div style={{ marginTop: 2 }}>{done ? "✓" : today ? "•" : "—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// FOCUS CARD
// -------------------------------------------------------------------------
const FocusCard = ({ title, onNav, intensity }) => {
  return (
    <Card pad={32} style={{ minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      splash={<>
        <Splat.Burst color="var(--marmalade)" size={260} style={{ position: "absolute", top: -90, right: -70, opacity: .25 }} rotate={45} />
        <Splat.Specks color="var(--punch)" size={120} seed={4} style={{ position: "absolute", bottom: 20, right: 30, opacity: .45 }}/>
      </>}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: "var(--marmalade)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)",
            }}>
              <Icon name="target" size={26} />
            </div>
            <div>
              <div className="label-eyebrow">Today's recipe</div>
              <h3 className="drip-text" style={{ margin: "2px 0 0", fontSize: 40, color: "var(--ink)" }}>{title}</h3>
            </div>
          </div>

          <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
            <Pill icon="clock">15 min</Pill>
            <Pill icon="metronome">90 BPM</Pill>
            <Pill icon="music">E minor pentatonic</Pill>
            <Pill icon="trophy" color="punch">+150 XP</Pill>
          </div>

          <p style={{ marginTop: 16, fontSize: 15, color: "var(--ink-mid)", lineHeight: 1.5, maxWidth: 520, fontWeight: 500 }}>
            Master the classic 12-bar turnaround. Strict alternate picking, eyes <em>off</em> the fretboard. We'll loop the tricky changes at 75%.
          </p>
        </div>

        <div style={{ position: "relative", flexShrink: 0 }}>
          <div className="drip-text" style={{
            fontSize: 72, color: "var(--punch)", lineHeight: .9, textAlign: "right",
          }}>
            S<span style={{ color: "var(--marmalade)" }}>2</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mid)", textAlign: "right" }}>
            SAUCE STAGE
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, marginTop: 24 }}>
        <Btn kind="primary" icon="fire" size="lg" onClick={() => onNav?.("kitchen")}>Enter the Kitchen</Btn>
        <Btn kind="cream" icon="map" onClick={() => onNav?.("roadmap")}>View Roadmap</Btn>
        <Btn kind="ghost" icon="edit">Update Guitar DNA</Btn>
      </div>
    </Card>
  );
};

const Pill = ({ icon, children, color = "ink" }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px",
    background: color === "punch" ? "var(--punch)" : "rgba(20,26,54,.06)",
    color: color === "punch" ? "var(--cream-warm)" : "var(--ink)",
    borderRadius: 999, fontSize: 13, fontWeight: 700,
    border: color === "punch" ? "none" : "1.5px solid rgba(20,26,54,.1)",
  }}>
    {icon && <Icon name={icon} size={15} />}
    {children}
  </div>
);

// -------------------------------------------------------------------------
// STATS MARQUEE
// -------------------------------------------------------------------------
const StatsMarquee = ({ xp }) => {
  const stats = [
    { label: "TOTAL XP", value: xp.toLocaleString(), accent: "var(--marmalade)", icon: "spark" },
    { label: "MINUTES THIS WEEK", value: "127", accent: "var(--punch)", icon: "clock" },
    { label: "TRICKS LEARNED", value: "23", accent: "var(--cyan)", icon: "bag" },
    { label: "S.A.U.C.E. STAGE", value: "S2", accent: "var(--acid)", icon: "fire" },
    { label: "NEXT BADGE IN", value: "150 XP", accent: "var(--grape)", icon: "trophy" },
  ];
  return (
    <div style={{
      background: "var(--ink)",
      borderRadius: "var(--r-lg)",
      padding: "20px 28px",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 0,
      position: "relative",
      overflow: "hidden",
      boxShadow: "var(--shadow-pop)",
    }}>
      <Splat.Streak color="var(--marmalade)" size={400} style={{ position: "absolute", top: -20, left: "30%", opacity: .12 }} rotate={-8}/>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "4px 18px",
          borderLeft: i === 0 ? "none" : "1.5px solid rgba(255,255,255,.08)",
          display: "flex", flexDirection: "column", gap: 4,
          position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: s.accent, display: "flex" }}><Icon name={s.icon} size={13} /></span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", color: "rgba(255,255,255,.55)" }}>{s.label}</span>
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: 36, color: "var(--cream-warm)", lineHeight: 1 }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
};

// -------------------------------------------------------------------------
// PRACTICE JOURNEY HEATMAP
// -------------------------------------------------------------------------
const PracticeJourney = () => {
  // generate a deterministic year of dots: 7 days × 53 weeks
  const weeks = 28;
  const data = React.useMemo(() => {
    let s = 17;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const out = [];
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const r = rand();
        // weight toward 0 for empty days but make recent weeks fuller
        const recencyBoost = w > weeks - 6 ? 0.4 : 0;
        const v = r + recencyBoost;
        let level = 0;
        if (v > 0.75) level = 4;
        else if (v > 0.6) level = 3;
        else if (v > 0.45) level = 2;
        else if (v > 0.3) level = 1;
        else level = 0;
        col.push(level);
      }
      out.push(col);
    }
    // current day (last) → exactly level 2
    out[weeks - 1][3] = 2;
    return out;
  }, []);

  const colors = ["var(--cream-shadow)", "#FFE0A0", "var(--marmalade)", "var(--marmalade-deep)", "var(--punch)"];
  const dayLabels = ["M", "", "W", "", "F", "", "S"];
  const months = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY"];

  return (
    <Card pad={32}
      splash={<Splat.Specks color="var(--marmalade)" size={140} seed={7} style={{ position: "absolute", top: 20, right: 30, opacity: .25 }}/>}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionHead color="var(--punch)" size={34}>Your Practice Journey</SectionHead>
        <div style={{ textAlign: "right" }}>
          <div className="num-display" style={{ fontSize: 38, color: "var(--ink)" }}>127</div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-mid)" }}>
            minutes this week<br/>+42% vs last
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 8 }}>
        {/* day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 22, fontSize: 11, fontWeight: 700, color: "var(--ink-mid)" }}>
          {dayLabels.map((d, i) => <div key={i} style={{ height: 18, lineHeight: "18px" }}>{d}</div>)}
        </div>

        {/* grid + months */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 800, color: "var(--ink-mid)", letterSpacing: ".12em", marginBottom: 6 }}>
            {months.map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 4 }}>
            {data.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {col.map((lvl, ri) => (
                  <div key={ri} title={`${months[Math.floor((ci / weeks) * months.length)]}: ${lvl > 0 ? `${lvl * 12} min` : "no practice"}`}
                    style={{
                      width: "100%", aspectRatio: "1", borderRadius: 6,
                      background: colors[lvl],
                      transform: lvl > 2 ? "scale(1.08)" : "scale(1)",
                      transition: "transform .15s",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
        <div style={{ fontSize: 13, color: "var(--ink-mid)", fontWeight: 600 }}>
          <span className="drip-text" style={{ fontSize: 22, color: "var(--ink)" }}>14 hrs</span>  practiced this year
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "var(--ink-mid)" }}>
          <span>LESS</span>
          {colors.map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: c }}/>)}
          <span>MORE</span>
        </div>
      </div>
    </Card>
  );
};

// -------------------------------------------------------------------------
// LOG KITCHEN — practice logger
// -------------------------------------------------------------------------
const LogKitchen = () => {
  const [duration, setDuration] = React.useState(20);
  const [focus, setFocus] = React.useState("");
  const [feel, setFeel] = React.useState(4);
  const [stage, setStage] = React.useState("S2");
  const [saved, setSaved] = React.useState(false);

  const stages = ["S", "A", "U", "C", "E"];
  const stageNames = { "S": "Steal", "A": "Assimilate", "U": "Utilize", "C": "Compose", "E": "Experience" };
  const feelEmoji = ["😤","😐","🙂","😎","🔥"];
  const feelLabel = ["Rough","OK","Good","Great","On fire"];

  const submit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Card pad={28} style={{ position: "relative" }}
      splash={<Splat.Drip color="var(--marmalade)" size={140} rotate={180} style={{ position: "absolute", top: -30, right: -20, opacity: .25 }}/>}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, background: "var(--marmalade)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
          boxShadow: "3px 3px 0 var(--punch)",
        }}>
          <Icon name="fire" size={24}/>
        </div>
        <div>
          <div className="label-eyebrow">Just finished?</div>
          <h3 className="drip-text" style={{ margin: 0, fontSize: 28, color: "var(--ink)" }}>Log Your Kitchen</h3>
        </div>
      </div>

      {/* duration big slider */}
      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="label-eyebrow">Time in the kitchen</div>
          <div>
            <span className="drip-text" style={{ fontSize: 38, color: "var(--punch)" }}>{duration}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-mid)", marginLeft: 4 }}>min</span>
          </div>
        </div>
        <input type="range" min="1" max="120" value={duration} onChange={e => setDuration(+e.target.value)}
          style={{ width: "100%", marginTop: 6, accentColor: "var(--marmalade)" }}/>
      </div>

      {/* what'd you cook */}
      <div style={{ marginTop: 14 }}>
        <div className="label-eyebrow" style={{ marginBottom: 6 }}>What'd you cook?</div>
        <input value={focus} onChange={e => setFocus(e.target.value)} placeholder="12-bar blues, hammer-ons, ear training..."
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 14,
            border: "2px solid var(--cream-shadow)", background: "var(--cream)",
            fontSize: 14, fontFamily: "var(--body)", fontWeight: 600, color: "var(--ink)",
            outline: "none",
          }}/>
      </div>

      {/* sauce stage */}
      <div style={{ marginTop: 14 }}>
        <div className="label-eyebrow" style={{ marginBottom: 6 }}>S.A.U.C.E. stage</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {stages.map(s => (
            <button key={s} onClick={() => setStage(s)} style={{
              padding: "10px 6px", borderRadius: 12,
              border: stage === s ? "2px solid var(--ink)" : "2px solid var(--cream-shadow)",
              background: stage === s ? "var(--ink)" : "var(--cream)",
              color: stage === s ? "var(--marmalade)" : "var(--ink)",
              fontFamily: "var(--display)", fontSize: 22, cursor: "pointer",
              boxShadow: stage === s ? "3px 3px 0 var(--marmalade)" : "none",
              transition: "transform .1s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* feel */}
      <div style={{ marginTop: 14 }}>
        <div className="label-eyebrow" style={{ marginBottom: 6 }}>How'd it feel?</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
          {feelEmoji.map((e, i) => (
            <button key={i} onClick={() => setFeel(i+1)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 12,
              border: feel === i + 1 ? "2px solid var(--punch)" : "2px solid var(--cream-shadow)",
              background: feel === i + 1 ? "rgba(230,54,120,.12)" : "var(--cream)",
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              transform: feel === i + 1 ? "translateY(-2px)" : "none",
              transition: "transform .15s",
            }}>
              <div style={{ fontSize: 22 }}>{e}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: feel === i + 1 ? "var(--punch)" : "var(--ink-mid)", letterSpacing: ".06em" }}>{feelLabel[i].toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <Btn kind={saved ? "marmalade" : "primary"} icon={saved ? "check" : "send"} size="lg" onClick={submit} style={{ width: "100%", justifyContent: "center" }}>
          {saved ? "Saved! +50 XP" : "Plate it up"}
        </Btn>
      </div>
    </Card>
  );
};

window.DashboardScreen = DashboardScreen;
