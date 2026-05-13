// Paint splat SVG library — hand-built drippy splatters
// Each component takes color + size props

const Splat = {
  // Burst splat with drips
  Burst: ({ color = "#E63678", size = 200, style = {}, className = "", rotate = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ ...style, transform: `rotate(${rotate}deg)` }} className={className}>
      <g fill={color}>
        <path d="M100 30c8-18 28-24 38-10s-2 28-14 32c14 6 22 22 12 34s-30 4-32-12c-6 18-28 22-38 10s2-32 16-32c-16-4-24-22-12-34s30-4 30 12z"/>
        <circle cx="160" cy="60" r="8"/>
        <circle cx="170" cy="80" r="4"/>
        <circle cx="40" cy="50" r="6"/>
        <circle cx="30" cy="70" r="3"/>
        <circle cx="50" cy="160" r="7"/>
        <circle cx="155" cy="155" r="5"/>
        <circle cx="180" cy="130" r="3"/>
        <circle cx="20" cy="120" r="4"/>
        <circle cx="100" cy="180" r="5"/>
        <path d="M100 60 L98 95 L102 95 Z" />
        <path d="M70 80 L66 110 L74 110 Z" opacity=".85"/>
        <path d="M130 75 L126 100 L134 100 Z" opacity=".85"/>
      </g>
    </svg>
  ),

  // Big organic blob with stretched drips going down
  Drip: ({ color = "#F5A623", size = 220, style = {}, className = "", rotate = 0 }) => (
    <svg width={size} height={size*1.3} viewBox="0 0 200 260" style={{ ...style, transform: `rotate(${rotate}deg)` }} className={className}>
      <g fill={color}>
        <path d="M40 60 C 20 80, 18 110, 40 130 C 25 145, 30 175, 55 180 C 50 200, 70 215, 92 210 C 95 230, 120 235, 135 220 C 155 230, 175 215, 168 195 C 188 188, 192 165, 178 150 C 195 135, 190 110, 170 102 C 180 80, 170 55, 145 55 C 138 35, 110 30, 95 45 C 78 32, 50 40, 40 60 Z"/>
        {/* hanging drips */}
        <path d="M60 175 Q 58 220 62 240 Q 66 250 62 258 Q 58 250 58 245 Q 56 230 60 175 Z"/>
        <path d="M100 200 Q 98 230 100 245 Q 104 255 100 260 Q 96 255 96 248 Q 94 230 100 200 Z"/>
        <path d="M140 195 Q 138 215 142 235 Q 146 245 142 252 Q 138 245 138 238 Q 136 220 140 195 Z"/>
        {/* satellite drops */}
        <circle cx="40" cy="40" r="6"/>
        <circle cx="180" cy="35" r="8"/>
        <circle cx="190" cy="60" r="4"/>
        <circle cx="25" cy="90" r="3"/>
        <circle cx="105" cy="240" r="3"/>
      </g>
    </svg>
  ),

  // Long horizontal swipe / streak
  Streak: ({ color = "#2BC9E6", size = 320, style = {}, className = "", rotate = 0 }) => (
    <svg width={size} height={size*0.35} viewBox="0 0 320 110" style={{ ...style, transform: `rotate(${rotate}deg)` }} className={className}>
      <g fill={color}>
        <path d="M10 55 C 30 35, 80 30, 130 40 C 180 50, 230 35, 280 45 C 300 50, 310 60, 308 70 C 295 80, 260 78, 220 72 C 170 65, 120 78, 70 72 C 35 68, 12 65, 10 55 Z"/>
        <path d="M70 70 Q 68 90 72 100 Q 76 105 72 108 Q 68 105 68 100 Q 66 88 70 70 Z"/>
        <path d="M150 65 Q 148 85 152 95 Q 156 100 152 104 Q 148 100 148 95 Q 146 84 150 65 Z"/>
        <path d="M230 68 Q 228 88 232 100 Q 234 105 230 108 Q 226 102 226 95 Q 224 82 230 68 Z"/>
        <circle cx="305" cy="35" r="6"/>
        <circle cx="290" cy="20" r="4"/>
        <circle cx="20" cy="30" r="5"/>
      </g>
    </svg>
  ),

  // Tiny scattered specks
  Specks: ({ color = "#E63678", size = 120, style = {}, className = "", seed = 1 }) => {
    // deterministic-ish
    const dots = [];
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 18; i++) {
      dots.push({ cx: rand() * 120, cy: rand() * 120, r: 1 + rand() * 5 });
    }
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" style={style}>
        <g fill={color}>
          {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />)}
        </g>
      </svg>
    );
  },

  // Big blot with star points
  Star: ({ color = "#B6E94B", size = 180, style = {}, className = "", rotate = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ ...style, transform: `rotate(${rotate}deg)` }} className={className}>
      <g fill={color}>
        <path d="M100 10 L120 60 L180 50 L140 95 L195 120 L130 130 L160 185 L100 150 L40 185 L70 130 L5 120 L60 95 L20 50 L80 60 Z"/>
      </g>
    </svg>
  ),

  // Underline / brush stroke
  Underline: ({ color = "#F5A623", width = 240, height = 22, style = {}, rotate = 0 }) => (
    <svg width={width} height={height} viewBox="0 0 240 22" style={{ ...style, transform: `rotate(${rotate}deg)` }}>
      <path fill={color} d="M5 14 C 50 6, 100 4, 150 8 C 190 11, 220 9, 235 12 C 232 17, 200 19, 160 17 C 110 14, 60 19, 20 18 C 8 17, 3 16, 5 14 Z"/>
      <path fill={color} d="M40 18 Q 38 22 42 22 Q 44 21 40 18 Z"/>
      <path fill={color} d="M120 19 Q 118 22 122 22 Q 124 21 120 19 Z"/>
    </svg>
  ),

  // Drippy circle for heatmap dots
  Blob: ({ color = "#F5A623", size = 28, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 28 28" style={style}>
      <path fill={color} d="M14 2 C 20 2, 26 7, 25 14 C 26 20, 20 26, 14 25 C 8 26, 2 20, 3 14 C 2 7, 8 2, 14 2 Z"/>
    </svg>
  ),
};

// Background scatter — places multiple splats randomly inside container
const SplatBackdrop = ({ intensity = "medium", palette = "default", seed = 1, opacity = 1 }) => {
  if (intensity === "off") return null;
  const palettes = {
    default: ["#F5A623", "#E63678", "#2BC9E6", "#B6E94B", "#8B5BD6"],
    warm: ["#F5A623", "#FF5A3C", "#E63678", "#FFC95C"],
    cool: ["#2BC9E6", "#8B5BD6", "#B6E94B", "#3B5BD6"],
    mono: ["#141A36", "#2A3055", "#4A5078"],
  };
  const colors = palettes[palette] || palettes.default;
  const count = intensity === "subtle" ? 3 : intensity === "medium" ? 6 : 11;
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const items = [];
  const types = ["Burst", "Drip", "Streak", "Star", "Specks"];
  for (let i = 0; i < count; i++) {
    const t = types[Math.floor(rand() * types.length)];
    const C = Splat[t];
    items.push({
      Comp: C,
      color: colors[Math.floor(rand() * colors.length)],
      size: 100 + rand() * 220,
      top: rand() * 100,
      left: rand() * 100,
      rotate: rand() * 360,
      key: i,
      op: 0.25 + rand() * 0.5,
    });
  }
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity }}>
      {items.map(it => (
        <div key={it.key} style={{ position: "absolute", top: `${it.top}%`, left: `${it.left}%`, transform: "translate(-50%,-50%)", opacity: it.op, mixBlendMode: "multiply" }}>
          <it.Comp color={it.color} size={it.size} rotate={it.rotate} seed={it.key + 7} />
        </div>
      ))}
    </div>
  );
};

window.Splat = Splat;
window.SplatBackdrop = SplatBackdrop;
