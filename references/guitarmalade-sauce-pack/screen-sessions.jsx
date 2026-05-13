// Sessions / History screen
const SessionsScreen = ({ tweaks = {}, onNav }) => {
  const sessions = [
    { date: "May 13, 2026", day: "Today", duration: 35, stage: "S2", focus: "Pentatonic shred runs", feel: 2, xp: 80 },
    { date: "May 12, 2026", day: "Tue", duration: 22, stage: "A", focus: "12-bar blues changes", feel: 4, xp: 110 },
    { date: "May 10, 2026", day: "Sun", duration: 48, stage: "U", focus: "Ear training intervals", feel: 5, xp: 220 },
    { date: "May 9, 2026", day: "Sat", duration: 60, stage: "C", focus: "Songwriting / chord voicings", feel: 4, xp: 250 },
    { date: "May 7, 2026", day: "Thu", duration: 18, stage: "S1", focus: "Spider warmup, scales", feel: 3, xp: 60 },
    { date: "May 5, 2026", day: "Tue", duration: 30, stage: "E", focus: "Improv over backing track", feel: 5, xp: 180 },
    { date: "May 3, 2026", day: "Sun", duration: 25, stage: "A", focus: "Hammer-ons and pull-offs", feel: 3, xp: 90 },
  ];
  const feelColor = { 1: "#9CA0B9", 2: "#FF5A3C", 3: "#F5A623", 4: "#B6E94B", 5: "#E63678" };
  const feelEmoji = { 1: "😤", 2: "😬", 3: "🙂", 4: "😎", 5: "🔥" };
  const stageColor = {
    "S1": "var(--cyan)", "A": "var(--marmalade)", "U": "var(--acid)", "C": "var(--grape)", "E": "var(--punch)"
  };

  const total = sessions.reduce((a, s) => a + s.duration, 0);
  const totalXP = sessions.reduce((a, s) => a + s.xp, 0);

  return (
    <div style={{ padding: "0 56px 56px" }}>
      {/* Heading */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="label-eyebrow" style={{ color: "var(--marmalade-deep)" }}>Where you've been</div>
          <h1 className="drip-text" style={{ margin: "4px 0 0", fontSize: 64, color: "var(--ink)", position: "relative" }}>
            Recent <span style={{ color: "var(--punch)" }}>Sessions</span>
            <Splat.Underline color="var(--marmalade)" width={300} height={22} style={{ position: "absolute", bottom: -14, left: 4 }}/>
          </h1>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Stat label="Total time" value={`${total}m`} accent="var(--marmalade)"/>
          <Stat label="XP earned" value={totalXP} accent="var(--punch)"/>
          <Stat label="Sessions" value={sessions.length} accent="var(--cyan)"/>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["All", "This week", "S · Steal", "A · Assimilate", "U · Utilize", "C · Compose", "E · Experience", "🔥 On fire"].map((f, i) => (
          <button key={i} style={{
            padding: "8px 14px", borderRadius: 999,
            border: i === 0 ? "2px solid var(--ink)" : "1.5px solid var(--cream-shadow)",
            background: i === 0 ? "var(--ink)" : "var(--cream-warm)",
            color: i === 0 ? "var(--marmalade)" : "var(--ink)",
            fontWeight: 800, fontSize: 13, cursor: "pointer",
          }}>{f}</button>
        ))}
      </div>

      {/* Sessions list — cards not table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "100px 1fr 180px 140px 140px",
            alignItems: "center",
            gap: 24,
            padding: "20px 26px",
            borderRadius: "var(--r-md)",
            background: "var(--cream-warm)",
            border: "2px solid var(--cream-shadow)",
            transition: "transform .15s, box-shadow .15s",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "8px 8px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {i === 0 && <Splat.Specks color="var(--marmalade)" size={80} seed={i+2} style={{ position: "absolute", top: 5, left: 5, opacity: .35 }}/>}

            {/* date */}
            <div>
              <div className="drip-text" style={{ fontSize: 28, color: "var(--ink)", lineHeight: 1 }}>
                {s.date.split(",")[0].split(" ")[1].replace(",", "")}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-mid)", letterSpacing: ".12em", marginTop: 2 }}>
                {s.date.split(" ")[0].toUpperCase()} · {s.day.toUpperCase()}
              </div>
            </div>

            {/* focus */}
            <div>
              <div className="label-eyebrow" style={{ marginBottom: 3 }}>Focus</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{s.focus}</div>
            </div>

            {/* stage */}
            <div>
              <div className="label-eyebrow" style={{ marginBottom: 3 }}>Stage</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
                background: stageColor[s.stage] + "22", borderRadius: 999,
                border: `2px solid ${stageColor[s.stage]}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: stageColor[s.stage] }}/>
                <span style={{ fontFamily: "var(--display)", fontSize: 18, color: "var(--ink)" }}>{s.stage}</span>
              </div>
            </div>

            {/* duration */}
            <div>
              <div className="label-eyebrow" style={{ marginBottom: 3 }}>Duration</div>
              <div className="drip-text" style={{ fontSize: 28, color: "var(--marmalade-deep)", lineHeight: 1 }}>
                {s.duration} <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--body)", color: "var(--ink-mid)" }}>min</span>
              </div>
            </div>

            {/* feel */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
              <div style={{ textAlign: "right" }}>
                <div className="label-eyebrow" style={{ marginBottom: 3 }}>+XP</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 22, color: "var(--punch)", lineHeight: 1 }}>{s.xp}</div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: feelColor[s.feel] + "22",
                border: `2.5px solid ${feelColor[s.feel]}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{feelEmoji[s.feel]}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Btn kind="ghost" icon="arrow-right">Load more sessions</Btn>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }) => (
  <div style={{
    padding: "12px 18px", borderRadius: 14,
    background: "var(--cream-warm)", border: `2px solid var(--cream-shadow)`,
    minWidth: 110,
  }}>
    <div className="label-eyebrow">{label}</div>
    <div className="drip-text" style={{ fontSize: 32, color: accent, lineHeight: 1, marginTop: 2 }}>{value}</div>
  </div>
);

window.SessionsScreen = SessionsScreen;
