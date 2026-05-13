// Main app shell — nav + screen routing + tweaks
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "splashIntensity": "medium",
  "theme": "cream",
  "streakDays": 1,
  "xp": 2350,
  "showXPHeader": true
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = React.useState("dashboard");
  const [tweaks, setTweak] = useTweaks(DEFAULTS);

  // theme switch
  React.useEffect(() => {
    document.body.classList.toggle("dark", tweaks.theme === "dark");
  }, [tweaks.theme]);

  const screens = {
    dashboard: <DashboardScreen tweaks={tweaks} onNav={setScreen} />,
    kitchen: <KitchenScreen tweaks={tweaks} onNav={setScreen} />,
    sessions: <SessionsScreen tweaks={tweaks} onNav={setScreen} />,
    roadmap: <RoadmapScreen tweaks={tweaks} onNav={setScreen} />,
    tricks: <PlaceholderScreen name="Bag O' Tricks" onNav={setScreen}/>,
    core: <PlaceholderScreen name="C.O.R.E. Specs" onNav={setScreen}/>,
  };

  const labels = {
    dashboard: "01 Dashboard",
    kitchen: "02 Kitchen",
    sessions: "03 Sessions",
    roadmap: "04 Roadmap",
    tricks: "05 Bag O' Tricks",
    core: "06 C.O.R.E.",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cream)" }} data-screen-label={labels[screen]}>
      <Sidebar current={screen} onNav={setScreen}/>
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* ambient backdrop */}
        <AmbientBackdrop screen={screen} intensity={tweaks.splashIntensity}/>

        {/* header is per-screen except for dashboard */}
        {screen === "dashboard" && (
          <TopHeader
            name="Chris"
            action={tweaks.showXPHeader ? <XPMeter value={tweaks.xp % 1000} max={1000} level={Math.floor(tweaks.xp / 1000) + 1}/> : null}
          />
        )}
        {screen !== "dashboard" && <ScreenHeader name="Chris" />}

        <div className="enter" key={screen} style={{ position: "relative", zIndex: 2 }}>
          {screens[screen]}
        </div>
      </main>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks" defaultPosition="bottom-right">
        <TweakSection title="Vibe">
          <TweakRadio label="Splash intensity" value={tweaks.splashIntensity}
            options={[{value:"off", label:"Off"},{value:"subtle", label:"Subtle"},{value:"medium", label:"Med"},{value:"heavy", label:"Heavy"}]}
            onChange={v => setTweak("splashIntensity", v)} />
          <TweakRadio label="Theme" value={tweaks.theme}
            options={[{value:"cream", label:"Cream"},{value:"dark", label:"Dark"}]}
            onChange={v => setTweak("theme", v)} />
        </TweakSection>
        <TweakSection title="Stats">
          <TweakSlider label="Streak days" value={tweaks.streakDays} min={0} max={30} step={1}
            onChange={v => setTweak("streakDays", v)} />
          <TweakSlider label="Total XP" value={tweaks.xp} min={0} max={10000} step={50}
            onChange={v => setTweak("xp", v)} />
          <TweakToggle label="Show XP in header" value={tweaks.showXPHeader}
            onChange={v => setTweak("showXPHeader", v)} />
        </TweakSection>
        <TweakSection title="Jump to">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {Object.keys(screens).map(k => (
              <TweakButton key={k} onClick={() => setScreen(k)}>{labels[k].split(" ").slice(1).join(" ")}</TweakButton>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Minimal header for non-dashboard screens
const ScreenHeader = ({ name }) => (
  <div style={{ padding: "22px 56px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", color: "var(--marmalade)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontSize: 22,
        border: "2px solid var(--cream)",
      }}>{name[0]}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-mid)" }}>
        Hey, <strong style={{ color: "var(--ink)" }}>{name}</strong> · Wednesday, May 13
      </div>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <button style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cream-warm)", border: "2px solid var(--cream-shadow)", cursor: "pointer", color: "var(--ink)" }}>
        <Icon name="search" size={18}/>
      </button>
      <button style={{ width: 44, height: 44, borderRadius: 12, background: "var(--cream-warm)", border: "2px solid var(--cream-shadow)", cursor: "pointer", color: "var(--ink)" }}>
        <Icon name="bell" size={18}/>
      </button>
    </div>
  </div>
);

// Ambient paint backdrop per screen
const AmbientBackdrop = ({ screen, intensity = "medium" }) => {
  if (intensity === "off") return null;
  // each screen gets its own palette flavour
  const palettes = {
    dashboard: ["#F5A623", "#E63678", "#FCF6E8", "#FFC95C"],
    kitchen: ["#F5A623", "#FF5A3C", "#E63678"],
    sessions: ["#8B5BD6", "#E63678", "#F5A623"],
    roadmap: ["#2BC9E6", "#B6E94B", "#F5A623", "#E63678"],
  };
  const colors = palettes[screen] || palettes.dashboard;
  const count = intensity === "subtle" ? 4 : intensity === "medium" ? 7 : 14;
  let s = screen.length * 31 + 7;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const items = [];
  const types = ["Burst", "Drip", "Streak", "Star", "Specks"];
  for (let i = 0; i < count; i++) {
    const t = types[Math.floor(rand() * types.length)];
    items.push({
      Comp: Splat[t], color: colors[i % colors.length],
      size: 140 + rand() * 280,
      top: rand() * 100, left: rand() * 100,
      rotate: rand() * 360, key: i, op: 0.08 + rand() * 0.16,
    });
  }

  return (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
    }}>
      {items.map(it => (
        <div key={it.key} style={{
          position: "absolute", top: `${it.top}%`, left: `${it.left}%`,
          transform: "translate(-50%,-50%)", opacity: it.op,
          mixBlendMode: "multiply",
        }}>
          <it.Comp color={it.color} size={it.size} rotate={it.rotate} seed={it.key + 11} />
        </div>
      ))}
    </div>
  );
};

// Placeholder for screens not yet built
const PlaceholderScreen = ({ name, onNav }) => (
  <div style={{ padding: "0 56px 56px", textAlign: "center", minHeight: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
    <Splat.Burst color="var(--marmalade)" size={300} style={{ position: "absolute", opacity: .2 }}/>
    <Splat.Specks color="var(--punch)" size={200} seed={2} style={{ position: "absolute", opacity: .4 }}/>
    <div className="drip-text" style={{ fontSize: 80, color: "var(--ink)", position: "relative", zIndex: 2 }}>{name}</div>
    <p style={{ marginTop: 16, fontSize: 17, color: "var(--ink-mid)", fontWeight: 600, maxWidth: 500, position: "relative", zIndex: 2 }}>
      Coming soon. For now, jump back into the kitchen.
    </p>
    <div style={{ marginTop: 24, position: "relative", zIndex: 2 }}>
      <Btn kind="primary" icon="arrow-left" onClick={() => onNav?.("dashboard")}>Back to dashboard</Btn>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
