// Goal-complete celebration overlay — massive paint explosion
const CelebrationOverlay = ({ open, onClose, goal = "12-Bar Blues in E", xp = 150, streak = 2 }) => {
  if (!open) return null;

  // generate splat positions deterministically each open
  const burst = React.useMemo(() => {
    let s = Date.now() % 1000 + 17;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const types = ["Burst", "Drip", "Star", "Streak", "Specks"];
    const colors = ["#F5A623", "#E63678", "#B6E94B", "#2BC9E6", "#8B5BD6", "#FF5A3C", "#FFC95C"];
    const out = [];
    for (let i = 0; i < 22; i++) {
      out.push({
        type: types[Math.floor(rand() * types.length)],
        color: colors[Math.floor(rand() * colors.length)],
        size: 120 + rand() * 280,
        top: rand() * 100,
        left: rand() * 100,
        rotate: rand() * 360,
        delay: rand() * 0.5,
        key: i,
      });
    }
    return out;
  }, [open]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(20,26,54,.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "celebFade .35s ease both",
      overflow: "hidden",
    }} onClick={onClose}>
      {/* paint barrage */}
      {burst.map(b => {
        const Comp = Splat[b.type];
        return (
          <div key={b.key} style={{
            position: "absolute",
            top: `${b.top}%`, left: `${b.left}%`,
            transform: "translate(-50%,-50%) scale(0)",
            animation: `celebPop .9s cubic-bezier(.2,.7,.2,1.4) ${b.delay}s both`,
          }}>
            <Comp color={b.color} size={b.size} rotate={b.rotate} seed={b.key + 3}/>
          </div>
        );
      })}

      {/* centerpiece */}
      <div style={{
        position: "relative", textAlign: "center",
        animation: "celebPunch .55s cubic-bezier(.2,.7,.2,1.4) .15s both",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          fontSize: 14, fontWeight: 900, letterSpacing: ".34em",
          color: "var(--marmalade)", textShadow: "2px 2px 0 var(--ink)",
        }}>RECIPE COMPLETE</div>
        <div className="drip-text" style={{
          fontSize: "clamp(70px, 14vw, 200px)", color: "var(--marmalade)",
          lineHeight: .9, marginTop: 8,
          textShadow: "6px 6px 0 var(--ink), 12px 12px 0 var(--punch)",
        }}>
          NICE<br/>WORK
        </div>
        <div className="drip-text" style={{
          fontSize: 38, color: "#FCF6E8", marginTop: 18,
        }}>
          {goal}
        </div>
        <div style={{
          marginTop: 26, display: "inline-flex", gap: 16,
          padding: "16px 28px", background: "var(--cream-warm)",
          borderRadius: 999, border: "3px solid var(--ink)",
          boxShadow: "6px 6px 0 var(--marmalade)",
        }}>
          <Chip color="var(--punch)" label="+XP" value={`+${xp}`} />
          <Chip color="var(--marmalade)" label="STREAK" value={`${streak} 🔥`} />
        </div>
        <div style={{ marginTop: 26 }}>
          <Btn kind="marmalade" size="lg" icon="arrow-right" onClick={onClose}>Keep going</Btn>
        </div>
      </div>

      <style>{`
        @keyframes celebFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes celebPop { 0% { transform: translate(-50%,-50%) scale(0) rotate(0deg); opacity: 0 }
          60% { opacity: 1 } 100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 1 }}
        @keyframes celebPunch { from { transform: scale(.6) rotate(-3deg); opacity: 0 }
          to { transform: scale(1) rotate(0); opacity: 1 } }
      `}</style>
    </div>
  );
};

const Chip = ({ color, label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", color: "var(--ink-mid)" }}>{label}</div>
    <div className="drip-text" style={{ fontSize: 30, color, marginTop: 2 }}>{value}</div>
  </div>
);

window.CelebrationOverlay = CelebrationOverlay;
