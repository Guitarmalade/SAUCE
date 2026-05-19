import React from 'react';

export const Icon = ({ name, size = 24, color = "currentColor", strokeWidth = 2.2 }: { name: string, size?: number, color?: string, strokeWidth?: number }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
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
