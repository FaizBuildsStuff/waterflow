// ============================================================
//  Anthryve — Design Token System 2.0
//  Theme: Stealth Dark · High-Contrast · Satoshi Font
// ============================================================

export const fonts = {
  /** Satoshi is the core of our professional aesthetic. 
   * Mono is used for AI-generated logs and terminal-style stats.
   */
  sans: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900, // Used for wide-tracked uppercase labels
} as const;

// ── Obsidian Neutrals (Dark Mode Optimized) ──────────────────
export const neutral = {
  0:   "#ffffff",   // pure white (for cards/active text)
  50:  "#f4f4f5",   // inverted text / highlights
  100: "#d4d4d8",   // secondary text
  200: "#71717a",   // muted text / placeholders
  400: "#3f3f46",   // borders (strong)
  600: "#27272a",   // dividers / subtle borders
  800: "#18181b",   // card surfaces / sidebar
  900: "#0d0d0d",   // secondary bg
  950: "#0a0a0a",   // core page background
} as const;

// ── Anthryve Brand (Indigo/Purple) ──────────────────────────
export const brand = {
  50:  "#e0e7ff",
  100: "#c7d2fe",
  200: "#a5b4fc",
  300: "#818cf8",
  400: "#6366f1",
  500: "#4f46e5",   // Primary Brand Indigo
  600: "#4338ca",   // Interactive Hover
  700: "#3730a3",
  800: "#312e81",
  900: "#1e1b4b",
  glow: "rgba(99, 102, 241, 0.5)", // For AI pulses
} as const;

// ── Semantic Aliases (Stealth Mappings) ──────────────────────
export const colors = {
  // Backgrounds
  background:  neutral[950],
  foreground:  neutral[0],
  card:        neutral[800],
  popover:     neutral[900],
  
  // States
  muted:       neutral[600],
  mutedText:   neutral[200],
  accent:      "rgba(255, 255, 255, 0.05)", // Hover state for sidebar/rows
  
  // Brand
  primary:     brand[400],
  primaryForeground: neutral[0],
  
  // Borders
  border:      "rgba(255, 255, 255, 0.08)", // Thin surgical borders
  input:       "rgba(255, 255, 255, 0.05)",
  ring:        brand[400],

  // Status
  success: "#10b981",
  warning: "#f59e0b",
  error:   "#ef4444",
  info:    brand[300],
} as const;

// ── Stealth Shadows ──────────────────────────────────────────
export const shadows = {
  // We use shadows less and borders more in Stealth Dark
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
  // The Signature AI Glow
  aiGlow: `0 0 20px -5px ${brand.glow}`,
} as const;

// ── Radius (Modern & Rounded) ────────────────────────────────
export const radius = {
  xs:   "4px",
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "24px",
  full: "9999px",
} as const;

// ── Spacing ──────────────────────────────────────────────────
export const spacing = {
  0:   "0px",
  1:   "4px",
  2:   "8px",
  3:   "12px",
  4:   "16px",
  5:   "20px",
  6:   "24px",
  8:   "32px",
  10:  "40px",
  12:  "48px",
  16:  "64px",
} as const;

// ── Typography Scale ──────────────────────────────────────────
export const typography = {
  label: { fontSize: "10px", lineHeight: "12px", letterSpacing: "0.15em", fontWeight: 900 },
  xs:    { fontSize: "12px", lineHeight: "16px" },
  sm:    { fontSize: "14px", lineHeight: "20px" },
  base:  { fontSize: "16px", lineHeight: "24px" },
  md:    { fontSize: "18px", lineHeight: "28px" },
  lg:    { fontSize: "20px", lineHeight: "28px" },
  xl:    { fontSize: "24px", lineHeight: "32px" },
  "2xl": { fontSize: "30px", lineHeight: "36px" },
  "3xl": { fontSize: "36px", lineHeight: "40px" },
  "4xl": { fontSize: "48px", lineHeight: "1" },
} as const;

// ── Transitions (Snappy/High-Perf) ───────────────────────────
export const transitions = {
  fast:   "100ms cubic-bezier(0.4, 0, 0.2, 1)",
  base:   "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  smooth: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

export default {
  fonts,
  fontWeights,
  neutral,
  brand,
  colors,
  shadows,
  radius,
  spacing,
  typography,
  transitions,
};