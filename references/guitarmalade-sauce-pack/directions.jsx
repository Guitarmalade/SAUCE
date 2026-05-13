// Three dashboard directions, all focused on progress toward a single goal.
// Each artboard is a self-contained working mini-dashboard.


// =========================================================================
// Shared skill color system — color is bound to what you're practicing
// =========================================================================
const SKILL_COLORS = {
  blues: { fg: "#F5A623", name: "Blues", shadow: "#E08810" },
  rock: { fg: "#E63678", name: "Rock / Lead", shadow: "#C42768" },
  theory: { fg: "#8B5BD6", name: "Theory", shadow: "#6B3FB8" },
  ear: { fg: "#B6E94B", name: "Ear Training", shadow: "#8FBD30" },
  songwriting: { fg: "#2BC9E6", name: "Songwriting", shadow: "#19A5C0" },
  rhythm: { fg: "#FF5A3C", name: "Rhythm", shadow: "#D63F20" },
};

const TODAY = {
  title: "12-Bar Blues in E",
  skill: "blues",
  stage: "A", // Assimilate
  stageName: "Assimilate",
  minutes: 15,
  bpm: 90,
  xp: 150,
  pct: 60,            // progress on this specific recipe
  thisWeek: 127,      // mins this week
  weekGoal: 200,      // weekly target
  streak: 2,
};

// =========================================================================
// Direction A — "ONE FOCUS"  Minimalist, single recipe hero
// =========================================================================
const DirectionA = () => {
  const [celebrate, setCelebrate] = React.useState(false);
  const skill = SKILL_COLORS[TODAY.skill];

  return (
    <div style={{
      width: "100%", height: "100%", background: "var(--cream)", color: "var(--ink)",
      padding: "32px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* watermark splash, very subtle */}
      <Splat.Burst color={skill.fg} size={520} rotate={20}
        style={{ position: "absolute", top: -200, right: -180, opacity: .14 }}/>

      {/* tiny header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "var(--ink)",
            color: skill.fg, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--display)", fontSize: 20,
          }}>C</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Hey, Chris</div>
            <div className="label-eyebrow" style={{ fontSize: 10 }}>WED · MAY 13</div>
          </div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px", background: "var(--cream-warm)", borderRadius: 999,
          border: "2px solid var(--cream-shadow)",
        }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span className="drip-text" style={{ fontSize: 20, color: skill.fg }}>{TODAY.streak}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-mid)", letterSpacing: ".1em" }}>DAY STREAK</span>
        </div>
      </div>

      {/* TINY EYEBROW */}
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div className="label-eyebrow" style={{ fontSize: 12, color: skill.fg, letterSpacing: ".34em" }}>
          TODAY'S ONE THING
        </div>
      </div>

      {/* HERO recipe card — central, dominant */}
      <div style={{
        position: "relative", margin: "16px auto 0", maxWidth: 620, width: "100%",
        background: "var(--cream-warm)", borderRadius: 30,
        padding: "34px 36px 30px", border: "3px solid var(--ink)",
        boxShadow: `12px 12px 0 ${skill.fg}`,
        overflow: "hidden",
      }}>
        <Splat.Specks color={skill.fg} size={120} seed={3}
          style={{ position: "absolute", top: 12, right: 14, opacity: .4 }}/>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: skill.fg }}/>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-mid)", letterSpacing: ".18em" }}>
            {skill.name.toUpperCase()} · STAGE {TODAY.stage} · {TODAY.stageName.toUpperCase()}
          </span>
        </div>

        <h1 className="drip-text" style={{ margin: "12px 0 0", fontSize: 64, color: "var(--ink)", lineHeight: .92 }}>
          12-Bar Blues<br/><span style={{ color: skill.fg }}>in E</span>
        </h1>

        {/* progress bar */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span className="label-eyebrow">Recipe progress</span>
            <span style={{ fontFamily: "var(--display)", fontSize: 22, color: skill.fg }}>{TODAY.pct}%</span>
          </div>
          <div style={{
            height: 16, borderRadius: 999, background: "var(--cream-shadow)",
            border: "2px solid var(--ink)", overflow: "hidden", position: "relative",
          }}>
            <div style={{
              width: `${TODAY.pct}%`, height: "100%", background: skill.fg,
              boxShadow: "inset 0 -4px 0 rgba(0,0,0,.1)",
              transition: "width .8s cubic-bezier(.2,.7,.2,1)",
            }}/>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", gap: 18, fontSize: 13, fontWeight: 700, color: "var(--ink-mid)" }}>
            <Meta icon="⏱" v={`${TODAY.minutes} min`}/>
            <Meta icon="♪" v={`${TODAY.bpm} BPM`}/>
            <Meta icon="✦" v={`+${TODAY.xp} XP`}/>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
          <button onClick={() => setCelebrate(true)} style={{
            flex: 1, padding: "18px 22px", borderRadius: 18, border: "none",
            background: "var(--ink)", color: skill.fg, fontWeight: 900, fontSize: 18,
            fontFamily: "var(--body)", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: `6px 6px 0 ${skill.fg}`,
          }}>
            ▶  Practice now
          </button>
          <button style={{
            padding: "18px 22px", borderRadius: 18,
            background: "transparent", color: "var(--ink)",
            border: "2.5px solid var(--ink)", fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}>Swap</button>
        </div>
      </div>

      {/* progress to the week */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 620 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span className="label-eyebrow">This week's flame</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>
              <span className="drip-text" style={{ fontSize: 26, color: skill.fg }}>{TODAY.thisWeek}</span>
              <span style={{ color: "var(--ink-mid)" }}> / {TODAY.weekGoal} min</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--cream-shadow)", overflow: "hidden" }}>
            <div style={{ width: `${(TODAY.thisWeek / TODAY.weekGoal) * 100}%`, height: "100%",
              background: `linear-gradient(90deg, ${skill.fg}, var(--punch))`,
            }}/>
          </div>
        </div>
      </div>

      <CelebrationOverlay open={celebrate} onClose={() => setCelebrate(false)}
        goal={TODAY.title} xp={TODAY.xp} streak={TODAY.streak + 1}/>
    </div>
  );
};

const Meta = ({ icon, v }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
    <span style={{ fontSize: 14 }}>{icon}</span>{v}
  </span>
);


// =========================================================================
// Direction B — "RING"  Big circular weekly target, recipe in center
// =========================================================================
const DirectionB = () => {
  const [celebrate, setCelebrate] = React.useState(false);
  const skill = SKILL_COLORS[TODAY.skill];
  const pct = TODAY.thisWeek / TODAY.weekGoal;
  const R = 170;
  const C = 2 * Math.PI * R;

  return (
    <div style={{
      width: "100%", height: "100%", background: "var(--cream-warm)", color: "var(--ink)",
      padding: "32px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <Splat.Drip color={skill.fg} size={300} rotate={205}
        style={{ position: "absolute", bottom: -120, left: -80, opacity: .12 }}/>
      <Splat.Burst color="var(--punch)" size={200} rotate={30}
        style={{ position: "absolute", top: -50, right: -60, opacity: .18 }}/>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="drip-text" style={{ margin: 0, fontSize: 34, color: "var(--ink)" }}>
            Hey, <span style={{ color: skill.fg }}>Chris</span>
          </h1>
          <div className="label-eyebrow" style={{ fontSize: 10, marginTop: 2 }}>WEDNESDAY · MAY 13</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "10px 16px",
          background: "var(--ink)", color: "var(--cream-warm)", borderRadius: 16,
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".18em", color: "rgba(255,255,255,.55)" }}>STREAK</div>
            <div className="drip-text" style={{ fontSize: 24, color: skill.fg, lineHeight: 1 }}>{TODAY.streak} 🔥</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,.15)" }}/>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".18em", color: "rgba(255,255,255,.55)" }}>STAGE</div>
            <div className="drip-text" style={{ fontSize: 24, color: "var(--cream-warm)", lineHeight: 1 }}>{TODAY.stage}</div>
          </div>
        </div>
      </div>

      {/* RING */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "relative", width: 440, height: 440 }}>
          <svg width="440" height="440" viewBox="-220 -220 440 440">
            {/* track */}
            <circle r={R} fill="none" stroke="var(--cream-shadow)" strokeWidth="36" />
            {/* progress arc */}
            <circle r={R} fill="none" stroke={skill.fg} strokeWidth="36"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90)"
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)" }}/>
            {/* dashed "today's recipe" sub arc */}
            <circle r={R - 36} fill="none" stroke="var(--ink)" strokeWidth="3" opacity=".18"
              strokeDasharray="6 8"/>
          </svg>

          {/* paint drip off the ring */}
          <div style={{ position: "absolute", top: 18, right: 60, pointerEvents: "none" }}>
            <Splat.Drip color={skill.fg} size={80} rotate={150}/>
          </div>

          {/* center content */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40,
          }}>
            <div className="label-eyebrow" style={{ color: skill.fg, fontSize: 11 }}>
              {skill.name.toUpperCase()} · TODAY
            </div>
            <h2 className="drip-text" style={{ margin: "8px 0 0", fontSize: 38, color: "var(--ink)", lineHeight: .95 }}>
              12-Bar Blues<br/>in <span style={{ color: skill.fg }}>E</span>
            </h2>
            <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: "var(--ink-mid)", letterSpacing: ".08em" }}>
              {TODAY.minutes} min · {TODAY.bpm} BPM · +{TODAY.xp} XP
            </div>
          </div>

          {/* ring labels */}
          <div style={{
            position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
            background: "var(--ink)", color: "var(--cream-warm)", padding: "4px 12px", borderRadius: 999,
            fontSize: 10, fontWeight: 900, letterSpacing: ".16em",
          }}>WEEKLY: {TODAY.thisWeek} / {TODAY.weekGoal} MIN</div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
        <button onClick={() => setCelebrate(true)} style={{
          padding: "18px 36px", borderRadius: 999, border: "none",
          background: skill.fg, color: "var(--ink)", fontWeight: 900, fontSize: 17,
          fontFamily: "var(--body)", cursor: "pointer",
          boxShadow: `0 8px 0 ${skill.shadow}, 0 14px 30px -10px rgba(0,0,0,.3)`,
          display: "inline-flex", alignItems: "center", gap: 10,
        }}>▶ Start practice</button>
        <button style={{
          padding: "18px 28px", borderRadius: 999,
          background: "var(--ink)", color: "var(--cream-warm)",
          border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer",
        }}>See recipe →</button>
      </div>

      {/* mini next-up */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 10 }}>
        <UpNext color={SKILL_COLORS.rock.fg} title="String bending" />
        <UpNext color={SKILL_COLORS.theory.fg} title="Em pentatonic shapes"/>
        <UpNext color={SKILL_COLORS.ear.fg} title="2-5-1 ear test"/>
      </div>

      <CelebrationOverlay open={celebrate} onClose={() => setCelebrate(false)}
        goal={TODAY.title} xp={TODAY.xp} streak={TODAY.streak + 1}/>
    </div>
  );
};

const UpNext = ({ color, title }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 999,
    background: "var(--cream)", border: "1.5px solid var(--cream-shadow)",
    fontSize: 13, fontWeight: 700, color: "var(--ink-soft)",
  }}>
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }}/>
    {title}
  </div>
);


// =========================================================================
// Direction C — "SETLIST"   handwritten setlist of goals
// =========================================================================
const DirectionC = () => {
  const [celebrate, setCelebrate] = React.useState(false);
  const skill = SKILL_COLORS[TODAY.skill];

  const setlist = [
    { i: 1, title: "12-Bar Blues in E", skill: "blues", time: 15, today: true, pct: 60 },
    { i: 2, title: "String bending warmup", skill: "rock", time: 10 },
    { i: 3, title: "Em pentatonic shapes 1–5", skill: "theory", time: 20 },
    { i: 4, title: "2-5-1 ear training", skill: "ear", time: 8 },
  ];

  return (
    <div style={{
      width: "100%", height: "100%", background: "var(--ink)", color: "var(--cream-warm)",
      padding: "32px 36px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* paint splashes */}
      <Splat.Streak color={skill.fg} size={620} rotate={-12}
        style={{ position: "absolute", top: -30, left: -100, opacity: .15 }}/>
      <Splat.Drip color="var(--punch)" size={260} rotate={185}
        style={{ position: "absolute", bottom: -120, right: -40, opacity: .15 }}/>

      {/* tape header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div className="drip-text" style={{ fontSize: 48, color: "var(--cream-warm)" }}>
          Tonight's <span style={{ color: skill.fg }}>setlist</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                width: 4, height: 22, background: i < TODAY.streak ? skill.fg : "rgba(255,255,255,.18)",
                borderRadius: 2,
              }}/>
            ))}
            <div className="drip-text" style={{ fontSize: 22, color: skill.fg, marginLeft: 6 }}>{TODAY.streak}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "rgba(255,255,255,.55)" }}>NIGHT STREAK</span>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.55)", maxWidth: 460 }}>
        Stage: <strong style={{ color: skill.fg }}>{TODAY.stageName}</strong> · 4 songs queued · ~53 min total
      </div>

      {/* the list */}
      <div style={{ marginTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 2 }}>
        {setlist.map(item => {
          const s = SKILL_COLORS[item.skill];
          return (
            <div key={item.i} style={{
              display: "grid", gridTemplateColumns: "70px 1fr auto auto", alignItems: "center", gap: 18,
              padding: item.today ? "20px 22px" : "14px 22px",
              background: item.today ? "var(--cream-warm)" : "rgba(255,255,255,.04)",
              color: item.today ? "var(--ink)" : "var(--cream-warm)",
              borderRadius: 18,
              border: item.today ? `3px solid ${s.fg}` : "1.5px solid rgba(255,255,255,.08)",
              boxShadow: item.today ? `8px 8px 0 ${s.fg}` : "none",
              position: "relative", overflow: "hidden",
              transform: item.today ? "rotate(-.4deg)" : "none",
            }}>
              {item.today && (
                <Splat.Specks color={s.fg} size={70} seed={item.i}
                  style={{ position: "absolute", top: 6, right: 8, opacity: .4 }}/>
              )}
              <div className="drip-text" style={{
                fontSize: item.today ? 56 : 28, color: item.today ? s.fg : "rgba(255,255,255,.5)", lineHeight: 1,
              }}>
                #{item.i}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".16em",
                  color: item.today ? "var(--ink-mid)" : "rgba(255,255,255,.45)",
                }}>
                  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: s.fg, marginRight: 6 }}/>
                  {s.name.toUpperCase()}
                </div>
                <div className="drip-text" style={{
                  fontSize: item.today ? 36 : 20, marginTop: 2,
                  color: item.today ? "var(--ink)" : "rgba(255,255,255,.85)", lineHeight: 1.05,
                }}>
                  {item.title}
                </div>
              </div>
              <div className="num-display" style={{
                fontSize: item.today ? 28 : 18, color: item.today ? s.fg : "rgba(255,255,255,.55)",
              }}>{item.time}<span style={{ fontSize: 12 }}>m</span></div>
              <div>
                {item.today ? (
                  <button onClick={() => setCelebrate(true)} style={{
                    padding: "14px 24px", borderRadius: 14, border: "none",
                    background: "var(--ink)", color: s.fg, fontWeight: 900, fontSize: 16,
                    fontFamily: "var(--body)", cursor: "pointer",
                    boxShadow: `4px 4px 0 ${s.fg}`,
                  }}>▶ Play</button>
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,.2)",
                  }}/>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* progress to the night */}
      <div style={{ marginTop: 18, padding: "14px 18px", background: "rgba(255,255,255,.04)", borderRadius: 14,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "rgba(255,255,255,.55)" }}>NIGHT PROGRESS</span>
        <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,.08)", borderRadius: 999 }}>
          <div style={{ width: "25%", height: "100%", background: skill.fg, borderRadius: 999 }}/>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: skill.fg }}>1 / 4</span>
      </div>

      <CelebrationOverlay open={celebrate} onClose={() => setCelebrate(false)}
        goal={TODAY.title} xp={TODAY.xp} streak={TODAY.streak + 1}/>
    </div>
  );
};


// =========================================================================
// Canvas
// =========================================================================
function App() {
  return (
    <DesignCanvas>
      <DCSection id="dashboards" title="Dashboard Directions" subtitle="3 takes on a focused, goal-first home screen. Each has a working ▶ Practice button that fires the goal-complete celebration.">
        <DCArtboard id="a" label="A · One Focus" width={760} height={920}>
          <DirectionA />
        </DCArtboard>
        <DCArtboard id="b" label="B · Weekly Ring" width={760} height={920}>
          <DirectionB />
        </DCArtboard>
        <DCArtboard id="c" label="C · Setlist (Dark)" width={760} height={920}>
          <DirectionC />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
