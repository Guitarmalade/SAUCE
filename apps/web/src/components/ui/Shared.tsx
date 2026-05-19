import React from 'react';
import { Splat } from './Splats';
import { Icon } from './Icon';

export const BrandMark = ({ size = 44, color = "var(--ink)", drip = "var(--marmalade)" }: { size?: number, color?: string, drip?: string }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <g>
      <path fill={color} d="M30 4 C 45 4, 56 15, 56 30 C 56 45, 45 56, 30 56 C 15 56, 4 45, 4 30 C 4 15, 15 4, 30 4 Z M30 14 C 21 14, 14 21, 14 30 C 14 39, 21 46, 30 46 C 36 46, 41 43, 44 38 L 34 38 L 34 30 L 50 30 C 50 30, 50 32, 50 34 C 47 47, 39 54, 30 54"/>
      <path fill={drip} d="M40 38 Q 40 50 42 56 Q 44 60 42 60 Q 38 56 38 52 Q 38 44 40 38 Z"/>
      <circle fill={drip} cx="48" cy="44" r="3"/>
    </g>
  </svg>
);

export const Btn = ({ 
  kind = "primary", 
  icon, 
  children, 
  onClick, 
  style = {}, 
  size = "md" 
}: { 
  kind?: "primary" | "marmalade" | "punch" | "ghost" | "cream", 
  icon?: string, 
  children: React.ReactNode, 
  onClick?: () => void, 
  style?: React.CSSProperties, 
  size?: "sm" | "md" | "lg" 
}) => {
  const palette = {
    primary: { bg: "var(--ink)", fg: "var(--cream-warm)", shadow: "var(--marmalade)", border: "2px solid transparent" },
    marmalade: { bg: "var(--marmalade)", fg: "var(--ink)", shadow: "var(--ink)", border: "2px solid transparent" },
    punch: { bg: "var(--punch)", fg: "var(--cream-warm)", shadow: "var(--ink)", border: "2px solid transparent" },
    ghost: { bg: "transparent", fg: "var(--ink)", shadow: "var(--ink)", border: "2px solid var(--ink)" },
    cream: { bg: "var(--cream-warm)", fg: "var(--ink)", shadow: "var(--ink)", border: "2px solid var(--ink)" },
  }[kind];

  const sizes = {
    sm: { padding: "8px 14px", fontSize: 13, borderRadius: 12, drop: 4 },
    md: { padding: "14px 22px", fontSize: 15, borderRadius: 16, drop: 6 },
    lg: { padding: "18px 28px", fontSize: 17, borderRadius: 20, drop: 8 },
  }[size];

  return (
    <button 
      onClick={onClick}
      onMouseDown={e => e.currentTarget.style.transform = `translate(${sizes.drop/2}px, ${sizes.drop/2}px)`}
      onMouseUp={e => e.currentTarget.style.transform = ""}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        background: palette.bg, color: palette.fg, border: palette.border,
        fontWeight: 800, fontFamily: "var(--body)", cursor: "pointer",
        transition: "transform .08s",
        boxShadow: `${sizes.drop}px ${sizes.drop}px 0 ${palette.shadow}`,
        ...sizes, ...style,
      }}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 16} />}
      <span>{children}</span>
    </button>
  );
};

export const Card = ({ children, style = {}, pad = 28, splash, tone = "cream" }: { children: React.ReactNode, style?: React.CSSProperties, pad?: number, splash?: React.ReactNode, tone?: "cream" | "ink" | string }) => {
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

export const SectionHead = ({ children, color = "var(--marmalade)", size = 38, style = {} }: { children: React.ReactNode, color?: string, size?: number, style?: React.CSSProperties }) => (
  <div style={{ position: "relative", display: "inline-block", ...style }}>
    <h2 className="drip-text" style={{ margin: 0, fontSize: size, color: "var(--ink)", position: "relative", zIndex: 2 }}>{children}</h2>
    <Splat.Underline color={color} width={size * 5.5} height={size * 0.4} style={{ position: "absolute", bottom: -10, left: -8, zIndex: 1, opacity: .9 }} />
  </div>
);

export const Pill = ({ icon, children, color = "ink" }: { icon?: string, children: React.ReactNode, color?: "ink" | "punch" }) => (
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

export const XPMeter = ({ value = 750, max = 1000, level = 4 }) => {
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
