// ============================================================
//  Waterflow — Design Token System
//  Theme: Water · Modern · Minimal · Satoshi font
// ============================================================

export const fonts = {
  /** Primary font — load via:
   *  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@401,500,700&display=swap" rel="stylesheet" />
   */
  sans: "'Satoshi', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const fontWeights = {
  regular: 401,
  medium:  500,
  bold:    700,
} as const;

// ── Base neutrals ────────────────────────────────────────────
export const neutral = {
  0:    "#ffffff",   // pure white
  50:   "#f7f8fa",   // page background — soft, not harsh white
  100:  "#f0f2f5",   // subtle surface
  150:  "#e8eaee",   // card border / divider
  200:  "#d6d9df",   // disabled / placeholder
  400:  "#9ba0ab",   // secondary text / muted
  600:  "#4a4f5a",   // body text
  800:  "#1a1d23",   // headings / primary text
  900:  "#0d0f13",   // near-black
} as const;

// ── Water blues — the brand ramp ─────────────────────────────
export const water = {
  50:   "#edf6ff",   // lightest tint — hover bg, tag fill
  100:  "#d6ecff",   // light accent surface
  200:  "#aed5fc",   // light border / badge
  300:  "#74b9f8",   // soft accent
  400:  "#3a9af0",   // interactive default
  500:  "#1a7fe0",   // primary brand blue
  600:  "#1265c0",   // pressed / active
  700:  "#0e4f9a",   // dark accent
  800:  "#0a3870",   // deep water
  900:  "#061f42",   // midnight ocean
} as const;

// ── Cyan / teal — secondary accent ───────────────────────────
export const aqua = {
  50:   "#eafbf8",
  100:  "#c6f4ed",
  200:  "#8ce8da",
  300:  "#4dd4c2",
  400:  "#1abcaa",
  500:  "#0fa08f",
  600:  "#0b8072",
  700:  "#086055",
  800:  "#054038",
  900:  "#02201c",
} as const;

// ── Semantic / status ─────────────────────────────────────────
export const status = {
  successBg:   "#edfaf4",
  successText: "#0a6640",
  successBorder:"#a3e6c8",

  warningBg:   "#fffbeb",
  warningText: "#7a4f00",
  warningBorder:"#fcd97a",

  errorBg:     "#fff1f1",
  errorText:   "#b81c1c",
  errorBorder: "#f9b4b4",

  infoBg:      water[50],
  infoText:    water[700],
  infoBorder:  water[200],
} as const;

// ── Semantic aliases (recommended for component usage) ────────
export const colors = {
  // backgrounds
  bgPage:        neutral[50],      // main page bg
  bgSurface:     neutral[0],       // cards, panels
  bgSubtle:      neutral[100],     // inputs, sidebar, code blocks
  bgHover:       neutral[100],     // hover state on rows/buttons
  bgActive:      water[50],        // active / selected state

  // text
  textPrimary:   neutral[800],     // headings, bold labels
  textBody:      neutral[600],     // body copy
  textMuted:     neutral[400],     // placeholders, helper text
  textInverse:   neutral[0],       // text on dark/colored bg
  textBrand:     water[500],       // links, highlights

  // brand / accent
  brand:         water[500],       // primary CTA, active links
  brandHover:    water[600],       // CTA hover
  brandLight:    water[50],        // brand tint bg
  brandBorder:   water[200],       // brand-tinted border

  // secondary accent
  accent:        aqua[400],        // secondary highlights
  accentLight:   aqua[50],

  // borders & dividers
  borderDefault: neutral[150],     // card borders, inputs
  borderStrong:  neutral[200],     // focused input, separator
  borderBrand:   water[300],       // brand-colored border

  // interactive
  focusRing:     water[300],       // focus outline

  // status
  ...status,
} as const;

// ── Shadow tokens ─────────────────────────────────────────────
export const shadows = {
  xs:  "0 1px 2px 0 rgba(10, 20, 40, 0.04)",
  sm:  "0 2px 6px 0 rgba(10, 20, 40, 0.06)",
  md:  "0 4px 16px 0 rgba(10, 20, 40, 0.08)",
  lg:  "0 8px 32px 0 rgba(10, 20, 40, 0.10)",
  xl:  "0 16px 48px 0 rgba(10, 20, 40, 0.12)",
  // Water glow — use on brand elements
  brandGlow: "0 0 0 4px rgba(26, 127, 224, 0.15)",
  brandGlowStrong: "0 4px 20px 0 rgba(26, 127, 224, 0.25)",
} as const;

// ── Border radius ─────────────────────────────────────────────
export const radius = {
  xs:   "4px",
  sm:   "6px",
  md:   "10px",
  lg:   "14px",
  xl:   "20px",
  "2xl":"28px",
  full: "9999px",
} as const;

// ── Spacing ───────────────────────────────────────────────────
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
  20:  "80px",
  24:  "96px",
} as const;

// ── Typography scale ──────────────────────────────────────────
export const typography = {
  xs:   { fontSize: "11px", lineHeight: "16px" },
  sm:   { fontSize: "13px", lineHeight: "20px" },
  base: { fontSize: "15px", lineHeight: "24px" },
  md:   { fontSize: "17px", lineHeight: "26px" },
  lg:   { fontSize: "20px", lineHeight: "30px" },
  xl:   { fontSize: "24px", lineHeight: "34px" },
  "2xl":{ fontSize: "30px", lineHeight: "40px" },
  "3xl":{ fontSize: "38px", lineHeight: "48px" },
  "4xl":{ fontSize: "48px", lineHeight: "58px" },
  "5xl":{ fontSize: "60px", lineHeight: "70px" },
} as const;

// ── Transition / animation ────────────────────────────────────
export const transitions = {
  fast:   "100ms ease",
  base:   "160ms ease",
  smooth: "240ms ease",
  slow:   "400ms ease",
  spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// ── Z-index layers ────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:100,
  sticky:  200,
  modal:   300,
  toast:   400,
  tooltip: 500,
} as const;

// ── CSS custom properties helper ──────────────────────────────
// Paste this into your global CSS / :root to use tokens as CSS vars
//
// :root {
//   --font-sans:         'Satoshi', sans-serif;
//   --color-bg-page:     #f7f8fa;
//   --color-bg-surface:  #ffffff;
//   --color-text:        #1a1d23;
//   --color-text-muted:  #9ba0ab;
//   --color-brand:       #1a7fe0;
//   --color-brand-hover: #1265c0;
//   --color-border:      #e8eaee;
//   --shadow-md:         0 4px 16px 0 rgba(10,20,40,0.08);
//   --radius-md:         10px;
//   --transition-base:   160ms ease;
// }

export default {
  fonts,
  fontWeights,
  neutral,
  water,
  aqua,
  status,
  colors,
  shadows,
  radius,
  spacing,
  typography,
  transitions,
  zIndex,
};