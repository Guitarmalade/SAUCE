// Shared UI primitives for GUitarmalade

// =========================================================================
// Brand mark — drippy "G" logo
// =========================================================================
const BrandMark = ({ size = 44, color = "#141A36", drip = "#F5A623" }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <g>
      {/* outer circle */}
      <path fill={color} d="M30 4 C 45 4, 56 15, 56 30 C 56 45, 45 56, 30 56 C 15 56, 4 45, 4 30 C 4 15, 15 4, 30 4 Z M30 14 C 21 14, 14 21, 14 30 C 14 39, 21 46, 30 46 C 36 46, 41 43, 44 38 L 34 38 L 34 30 L 50 30 C 50 30, 50 32, 50 34 C 47 47, 39 54, 30 54"/>
      {/* drip */}
      <path fill={drip} d="M40 38 Q 40 50 42 56 Q 44 60 42 60 Q 38 56 38 52 Q 38 44 40 38 Z"/>
      <circle fill={drip} cx="48" cy="44" r="3"/>
    </g>
  </svg>
);

// =========================================================================
// Marquee / sidebar nav
// =========================================================================
const Sidebar = ({ current, onNav }) => {
  const items = [
    { id: "dashboard", label: "Home", icon: "home" },
    { id: "kitchen", label: "Kitchen", icon: "fire" },
    { id: "sessions", label: "History", icon: "history" },
    { id: "roadmap", label: "Roadmap", icon: "map" },
    { id: "tricks", label: "Bag O' Tricks", icon: "bag" },
    { id: "core", label: "C.O.R.E.", icon: "book" },
  ];

  return (
    <aside style={{
      width: 96, flexShrink: 0, padding: "20px 12px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--cream)",
      position: "sticky", top: 0, height: "100vh", borderRight: "3px solid var(--ink-soft)",
      zIndex: 30,
    }}>
      <div style={{ marginBottom: 12 }}>
        <BrandMark size={48} color="#FCF6E8" drip="#F5A623" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "center" }}>
        {items.map(it => {
          const active = it.id === current;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} title={it.label}
              style={{
                width: 64, height: 64, borderRadius: 18,
                background: active ? "var(--marmalade)" : "transparent",
                color: active ? "var(--ink)" : "var(--cream)",
                border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2, transition: "background .2s, transform .2s",
                position: "relative",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={it.icon} size={22} />
              <span style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" }}>{it.label.split(" ")[0]}</span>
              {active && <Splat.Burst color="var(--marmalade)" size={88} rotate={20} style={{ position: "absolute", inset: -12, zIndex: -1, opacity: .4 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }}></div>
      <button title="Sign out" style={{
        width: 56, height: 56, borderRadius: 16, border: "1px solid rgba(255,255,255,.15)",
        background: "transparent", color: "var(--cream)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="logout" size={20} />
      </button>
    </aside>
  );
};

// =========================================================================
// Icons (chunky, hand-drawn-ish)
// =========================================================================
const Icon = ({ name, size = 24, color = "currentColor", strokeWidth = 2.2 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home": return <svg {...common}><path d="M3 11 L12 3 L21 11 V21 H15 V14 H9 V21 H3 Z"/></svg>;
    case "fire": return <svg {...common}><path d="M12 3 C 14 7, 8 8, 8 13 C 8 18, 12 21, 12 21 C 12 21, 16 18, 16 13 C 16 10, 14 9, 13 7 C 13 5, 14 4, 12 3 Z"/></svg>;
    case "history": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7 V12 L16 14"/></svg>;
    case "map": return <svg {...common}><path d="M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z"/><path d="M9 4 V18 M15 6 V20"/></svg>;
    case "bag": return <svg {...common}><path d="M5 8 H19 V20 H5 Z"/><path d="M8 8 V6 A4 4 0 0 1 16 6 V8"/></svg>;
    case "book": return <svg {...common}><path d="M4 4 H11 V20 H4 Z M13 4 H20 V20 H13 Z"/></svg>;
    case "logout": return <svg {...common}><path d="M14 4 H19 V20 H14 M9 8 L5 12 L9 16 M5 12 H15"/></svg>;
    case "target": return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>;
    case "play": return <svg {...common} fill={color}><path d="M8 5 L19 12 L8 19 Z"/></svg>;
    case "pause": return <svg {...common} fill={color} stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
    case "spark": return <svg {...common}><path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z"/></svg>;
    case "check": return <svg {...common}><path d="M5 13 L10 18 L19 7"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12 H19 M14 6 L20 12 L14 18"/></svg>;
    case "arrow-left": return <svg {...common}><path d="M19 12 H5 M10 6 L4 12 L10 18"/></svg>;
    case "calendar": return <svg {...common}><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10 H20 M9 3 V7 M15 3 V7"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7 V12 L15 14"/></svg>;
    case "trophy": return <svg {...common}><path d="M6 4 H18 V10 A6 6 0 0 1 6 10 Z"/><path d="M6 6 H3 A3 3 0 0 0 6 10 M18 6 H21 A3 3 0 0 1 18 10"/><path d="M9 16 H15 V20 H9 Z"/><path d="M12 14 V16"/></svg>;
    case "metronome": return <svg {...common}><path d="M8 3 H16 L19 21 H5 Z"/><path d="M9 17 H15"/><path d="M12 17 L9 6"/></svg>;
    case "guitar": return <svg {...common}><path d="M14 4 L20 10 M16 6 L19 3 M18 8 L21 5"/><circle cx="9" cy="15" r="5"/><circle cx="9" cy="15" r="2"/><path d="M12 12 L14 10"/></svg>;
    case "music": return <svg {...common}><path d="M9 18 V6 L19 4 V16"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>;
    case "lock": return <svg {...common}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11 V7 A4 4 0 0 1 16 7 V11"/></svg>;
    case "edit": return <svg {...common}><path d="M4 20 H8 L20 8 L16 4 L4 16 Z"/></svg>;
    case "send": return <svg {...common}><path d="M4 12 L20 4 L14 20 L11 13 Z"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M16 16 L21 21"/></svg>;
    case "bell": return <svg {...common}><path d="M6 17 H18 L17 13 V10 A5 5 0 0 0 7 10 V13 Z"/><path d="M10 20 A2 2 0 0 0 14 20"/></svg>;
    default: return null;
  }
};

// =========================================================================
// Top header with greeting + actions
// =========================================================================
const TopHeader = ({ name = "Chris", subtitle, action }) => {
  const today = new Date(2026, 4, 13); // May 13 2026
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "28px 56px 18px",
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--ink)", color: "var(--marmalade)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--display)", fontSize: 30,
            border: "3px solid var(--cream)",
            boxShadow: "0 6px 0 var(--marmalade)",
          }}>C</div>
          <Splat.Specks color="var(--punch)" size={70} seed={3} style={{ position: "absolute", top: -10, left: -10, opacity: .8 }}/>
        </div>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".24em", fontWeight: 800, color: "var(--ink-mid)" }}>{dateStr}</div>
          <h1 className="drip-text" style={{ margin: "2px 0 0", fontSize: 46, color: "var(--ink)" }}>
            Hey, <span style={{ color: "var(--marmalade)" }}>{name}</span>
            <span style={{ color: "var(--punch)" }}>.</span>
          </h1>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {action}
        <button style={iconBtn}><Icon name="search" size={20} /></button>
        <button style={iconBtn}><Icon name="bell" size={20} /></button>
      </div>
    </header>
  );
};
const iconBtn = {
  width: 48, height: 48, borderRadius: 14,
  background: "var(--cream-warm)", border: "2px solid var(--cream-shadow)",
  color: "var(--ink)", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

// =========================================================================
// Buttons
// =========================================================================
const Btn = ({ kind = "primary", icon, children, onClick, style = {}, size = "md" }) => {
  const palette = {
    primary: { bg: "var(--ink)", fg: "var(--cream-warm)", shadow: "var(--marmalade)" },
    marmalade: { bg: "var(--marmalade)", fg: "var(--ink)", shadow: "var(--ink)" },
    punch: { bg: "var(--punch)", fg: "var(--cream-warm)", shadow: "var(--ink)" },
    ghost: { bg: "transparent", fg: "var(--ink)", shadow: "var(--ink)", border: "2px solid var(--ink)" },
    cream: { bg: "var(--cream-warm)", fg: "var(--ink)", shadow: "var(--ink)", border: "2px solid var(--ink)" },
  }[kind] || palette.primary;
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 13, borderRadius: 12, drop: 4 },
    md: { padding: "14px 22px", fontSize: 15, borderRadius: 16, drop: 6 },
    lg: { padding: "18px 28px", fontSize: 17, borderRadius: 20, drop: 8 },
  }[size];
  return (
    <button onClick={onClick}
      onMouseDown={e => e.currentTarget.style.transform = `translate(${sizes.drop/2}px, ${sizes.drop/2}px)`}
      onMouseUp={e => e.currentTarget.style.transform = ""}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        background: palette.bg, color: palette.fg, border: palette.border || "2px solid transparent",
        fontWeight: 800, fontFamily: "var(--body)", cursor: "pointer",
        transition: "transform .08s",
        boxShadow: `${sizes.drop}px ${sizes.drop}px 0 ${palette.shadow}`,
        ...sizes, ...style,
      }}>
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 16} />}
      <span>{children}</span>
    </button>
  );
};

// =========================================================================
// Card
// =========================================================================
const Card = ({ children, style = {}, pad = 28, splash, tone = "cream" }) => {
  const bg = tone === "cream" ? "var(--cream-warm)" : tone === "ink" ? "var(--ink)" : tone;
  return (
    <div style={{
      position: "relative",
      background: bg,
      borderRadius: "var(--r-lg)",
      padding: pad,
      border: "2px solid var(--cream-shadow)",
      boxShadow: "var(--shadow-soft)",
      overflow: "hidden",
      ...style,
    }}>
      {splash}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

// =========================================================================
// Section heading with underline splash
// =========================================================================
const SectionHead = ({ children, color = "var(--marmalade)", size = 38, style = {} }) => (
  <div style={{ position: "relative", display: "inline-block", ...style }}>
    <h2 className="drip-text" style={{ margin: 0, fontSize: size, color: "var(--ink)", position: "relative", zIndex: 2 }}>{children}</h2>
    <Splat.Underline color={color} width={size * 5.5} height={size * 0.4} style={{ position: "absolute", bottom: -10, left: -8, zIndex: 1, opacity: .9 }} />
  </div>
);

// =========================================================================
// XP/Level meter
// =========================================================================
const XPMeter = ({ value = 750, max = 1000, level = 4 }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, background: "var(--ink)",
        color: "var(--marmalade)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: 18, fontFamily: "var(--display)",
        boxShadow: "3px 3px 0 var(--punch)",
      }}>{level}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800, color: "var(--ink-mid)" }}>Level {level} → {level + 1}</div>
        <div style={{
          width: 200, height: 14, background: "var(--cream-shadow)", borderRadius: 999, marginTop: 4,
          position: "relative", overflow: "hidden", border: "2px solid var(--ink)",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: "linear-gradient(90deg, var(--marmalade), var(--punch))",
            borderRadius: 999,
            transition: "width .8s cubic-bezier(.2,.7,.2,1)",
          }}/>
        </div>
        <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: "var(--ink-mid)" }}>
          <span style={{ color: "var(--ink)" }}>{value}</span> / {max} XP
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BrandMark, Sidebar, Icon, TopHeader, Btn, Card, SectionHead, XPMeter });
