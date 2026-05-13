// Roadmap as a visual progression path with waypoints
const RoadmapScreen = ({ tweaks = {}, onNav }) => {
  // Each waypoint: { id, title, stage, skill, state, x%, y% }
  // state: "done" | "current" | "next" | "locked"
  // x and y are positions inside the 1000×2200 SVG viewBox
  const SKILL = {
    blues: "#F5A623", rock: "#E63678", theory: "#8B5BD6",
    ear: "#B6E94B", songwriting: "#2BC9E6", rhythm: "#FF5A3C",
  };

  const waypoints = [
    // STAGE S — Steal
    { id: 1, title: "Listen: B.B. King Live", stage: "S", skill: "blues", state: "done", x: 280, y: 220 },
    { id: 2, title: "Transcribe opening lick", stage: "S", skill: "blues", state: "done", x: 540, y: 320 },
    { id: 3, title: "Analyze blues scale shapes", stage: "S", skill: "theory", state: "done", x: 720, y: 470 },

    // Stage boundary S → A
    { id: "gateS", title: "S · Steal", stage: "S", isGate: true, state: "done", x: 500, y: 620 },

    // STAGE A — Assimilate
    { id: 4, title: "Spider warmup", stage: "A", skill: "rhythm", state: "done", x: 260, y: 760 },
    { id: 5, title: "12-Bar Blues in E", stage: "A", skill: "blues", state: "current", x: 500, y: 900 },
    { id: 6, title: "String bending fundamentals", stage: "A", skill: "rock", state: "next", x: 740, y: 980 },
    { id: 7, title: "Em pentatonic shapes", stage: "A", skill: "theory", state: "locked", x: 540, y: 1110 },

    // Stage boundary A → U
    { id: "gateA", title: "A · Assimilate", stage: "A", isGate: true, state: "locked", x: 280, y: 1250 },

    // STAGE U — Utilize
    { id: 8, title: "2-5-1 progressions", stage: "U", skill: "theory", state: "locked", x: 500, y: 1380 },
    { id: 9, title: "Record over backing track", stage: "U", skill: "songwriting", state: "locked", x: 760, y: 1470 },
    { id: 10, title: "Ear: minor pentatonic intervals", stage: "U", skill: "ear", state: "locked", x: 520, y: 1620 },

    // Stage boundary U → C
    { id: "gateU", title: "U · Utilize", stage: "U", isGate: true, state: "locked", x: 260, y: 1740 },

    // STAGE C — Compose
    { id: 11, title: "Write a 12-bar in your voice", stage: "C", skill: "songwriting", state: "locked", x: 500, y: 1860 },
    { id: 12, title: "Craft a solo over Em", stage: "C", skill: "songwriting", state: "locked", x: 740, y: 1940 },

    // Stage boundary C → E
    { id: "gateC", title: "C · Compose", stage: "C", isGate: true, state: "locked", x: 500, y: 2060 },

    // STAGE E — Experience
    { id: 13, title: "Open mic night", stage: "E", skill: "rock", state: "locked", x: 280, y: 2190 },
    { id: 14, title: "Record & release a track", stage: "E", skill: "songwriting", state: "locked", x: 520, y: 2280 },
    { id: 15, title: "🏆 Book your first gig", stage: "E", skill: "rock", state: "locked", x: 500, y: 2400, isFinal: true },
  ];

  // Build path string connecting all waypoints with smooth bezier curves
  const path = waypoints.reduce((acc, w, i) => {
    if (i === 0) return `M ${w.x} ${w.y}`;
    const prev = waypoints[i - 1];
    const cx1 = prev.x;
    const cy1 = (prev.y + w.y) / 2;
    const cx2 = w.x;
    const cy2 = (prev.y + w.y) / 2;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${w.x} ${w.y}`;
  }, "");

  // Compute "done" portion of path: stop at the current waypoint
  const currentIdx = waypoints.findIndex(w => w.state === "current");
  const donePath = waypoints.slice(0, currentIdx + 1).reduce((acc, w, i) => {
    if (i === 0) return `M ${w.x} ${w.y}`;
    const prev = waypoints[i - 1];
    const cx1 = prev.x;
    const cy1 = (prev.y + w.y) / 2;
    const cx2 = w.x;
    const cy2 = (prev.y + w.y) / 2;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${w.x} ${w.y}`;
  }, "");

  const VBW = 1000, VBH = 2500;

  return (
    <div style={{ padding: "0 56px 56px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="label-eyebrow" style={{ color: "var(--marmalade-deep)" }}>The path</div>
        <h1 className="drip-text" style={{ margin: "4px 0 0", fontSize: 60, color: "var(--ink)", lineHeight: .95 }}>
          Your <span style={{ color: "var(--marmalade)" }}>roadmap</span>
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "var(--ink-mid)", maxWidth: 620, fontWeight: 500, lineHeight: 1.45 }}>
          Every node is a recipe. Cook them in order — earn the next one by completing the last.
        </p>
      </div>

      {/* Progress summary card */}
      <div style={{
        position: "relative", marginBottom: 32, padding: "18px 24px",
        background: "var(--cream-warm)", borderRadius: "var(--r-lg)",
        border: "2px solid var(--cream-shadow)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12, overflow: "hidden",
      }}>
        <Splat.Specks color="var(--marmalade)" size={120} seed={4}
          style={{ position: "absolute", top: 0, right: 0, opacity: .3 }}/>
        {[
          { code: "S", name: "Steal", done: 3, total: 3, color: SKILL.songwriting },
          { code: "A", name: "Assimilate", done: 1, total: 4, color: SKILL.blues, current: true },
          { code: "U", name: "Utilize", done: 0, total: 3, color: SKILL.ear },
          { code: "C", name: "Compose", done: 0, total: 2, color: SKILL.theory },
          { code: "E", name: "Experience", done: 0, total: 3, color: SKILL.rock },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "10px 14px", borderRadius: 14,
            background: s.current ? "var(--ink)" : "transparent",
            color: s.current ? "var(--cream-warm)" : "var(--ink)",
            border: s.current ? `2.5px solid ${s.color}` : "1.5px solid var(--cream-shadow)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="drip-text" style={{ fontSize: 26, color: s.color, lineHeight: 1 }}>{s.code}</div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".06em" }}>{s.name}</div>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, opacity: .7 }}>
              {s.done} / {s.total} recipes
            </div>
            <div style={{ height: 5, marginTop: 4, background: "rgba(0,0,0,.08)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${(s.done / s.total) * 100}%`, height: "100%", background: s.color }}/>
            </div>
          </div>
        ))}
      </div>

      {/* THE PATH */}
      <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* dashed underlay path (full) */}
          <path d={path} fill="none" stroke="var(--cream-shadow)" strokeWidth="22"
            strokeLinecap="round" strokeDasharray="6 18" />
          {/* solid done path overlay */}
          <path d={donePath} fill="none" stroke="var(--marmalade)" strokeWidth="22"
            strokeLinecap="round" />

          {/* Drip from end of done path */}
          <circle cx={waypoints[currentIdx].x} cy={waypoints[currentIdx].y + 22} r="8" fill="var(--marmalade)" opacity=".6"/>
          <circle cx={waypoints[currentIdx].x - 18} cy={waypoints[currentIdx].y + 38} r="5" fill="var(--marmalade)" opacity=".4"/>

          {/* Decorative paint splatters across map */}
          <g opacity=".22" transform="translate(80, 100)">
            <circle r="40" fill={SKILL.blues}/>
          </g>
          <g opacity=".18" transform="translate(880, 1500)">
            <circle r="55" fill={SKILL.rock}/>
          </g>

          {/* Waypoints as SVG circles + foreign labels */}
          {waypoints.map((w, i) => {
            const c = w.skill ? SKILL[w.skill] : "var(--marmalade)";
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

                <circle cx={w.x} cy={w.y} r={r} fill={fill} stroke={stroke}
                  strokeWidth={w.state === "current" ? 5 : w.state === "next" ? 4 : 3.5}
                  strokeDasharray={w.state === "locked" ? "4 5" : "none"}
                />

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
                      style={{ fontFamily: "var(--display)", fontSize: 38, fill: "var(--ink)" }}>
                      ▶
                    </text>
                  )}
                  {w.isGate && (
                    <text textAnchor="middle" dominantBaseline="central"
                      style={{ fontFamily: "var(--display)", fontSize: 44, fill: w.state === "done" ? "var(--cream-warm)" : "var(--ink-faint)" }}>
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
                  <g>
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
                        fontFamily: "var(--body)", fontWeight: 800, fontSize: 11, letterSpacing: ".12em",
                        fill: w.state === "current" ? c : "var(--ink-mid)",
                      }}>
                      {w.state === "current" ? "▶ NOW PLAYING" : w.state === "next" ? "UP NEXT" : w.stage + " · " + (w.state === "done" ? "DONE" : "LOCKED")}
                    </text>
                    <text
                      x={w.x + r + 30}
                      y={w.y + 14}
                      style={{
                        fontFamily: "var(--display)", fontSize: 18,
                        fill: w.state === "current" ? "var(--cream-warm)" : "var(--ink)",
                        opacity: w.state === "locked" ? .55 : 1,
                      }}>
                      {w.title.length > 24 ? w.title.slice(0, 22) + "…" : w.title}
                    </text>
                  </g>
                )}
                {/* Gate label */}
                {w.isGate && (
                  <g>
                    <text x={w.x} y={w.y + r + 26} textAnchor="middle" style={{
                      fontFamily: "var(--display)", fontSize: 24,
                      fill: w.state === "done" ? "var(--ink)" : "var(--ink-faint)",
                    }}>{w.title}</text>
                    <text x={w.x} y={w.y + r + 46} textAnchor="middle" style={{
                      fontFamily: "var(--body)", fontWeight: 800, fontSize: 10, letterSpacing: ".18em",
                      fill: w.state === "done" ? "var(--marmalade-deep)" : "var(--ink-faint)",
                    }}>{w.state === "done" ? "✓ STAGE CLEARED" : "STAGE LOCKED"}</text>
                  </g>
                )}

                {/* "YOU ARE HERE" tag for current */}
                {w.state === "current" && (
                  <g transform={`translate(${w.x - 100}, ${w.y - 80})`}>
                    <path d="M 0 0 L 80 0 L 75 16 L 0 16 Z" fill={c} stroke="var(--ink)" strokeWidth="2.5"/>
                    <text x="40" y="11" textAnchor="middle" style={{
                      fontFamily: "var(--body)", fontWeight: 900, fontSize: 10, letterSpacing: ".14em",
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
              fontFamily: "var(--display)", fontSize: 20, fill: "var(--marmalade)",
            }}>START</text>
          </g>
        </svg>
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
        <Btn kind="primary" size="lg" icon="fire" onClick={() => onNav?.("kitchen")}>
          Cook your current recipe
        </Btn>
      </div>
    </div>
  );
};

window.RoadmapScreen = RoadmapScreen;
