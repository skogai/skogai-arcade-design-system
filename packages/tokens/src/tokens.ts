/* ==========================================================================
   Skogai Arcade — design tokens (single source of truth)
   Everything else (CSS custom properties, JSON, Tailwind theme) is
   generated from this file. Edit values here, never in generated output.
   ========================================================================== */

import { glowFor, mixHex } from "./color.js";

/* ---- Brand neons (arcade signs) ---------------------------------------- */
export const neon = {
  magenta: "#ff3ea0", // primary action / Wi-Fi Wizards
  pink: "#ff7ad9",
  violet: "#b26bff", // Sudo Hero primary
  purple: "#8a3dff",
  cyan: "#4ee2ff", // Honkers & Hackers / data viz
  blue: "#4a7dff",
  green: "#5fff8a", // terminal / success
  acid: "#3dff9e", // eco signage / Skog-Net Syndicate
  teal: "#2fe0d0", // cool data / HUD rails
  yellow: "#ffd23f", // coin / score / S+ rank
  orange: "#ff9347", // warning
  red: "#ff4d6d", // HP / danger
} as const;

export type NeonName = keyof typeof neon;
export const neonNames = Object.keys(neon) as NeonName[];

/**
 * Interactive ramp for a neon used as a solid fill (buttons, active states).
 * Values from the reference bundle are pinned; the rest are derived so any
 * neon can be promoted to a cabinet's primary or accent role.
 */
export interface NeonRamp {
  base: string;
  hover: string;
  border: string;
  glow: string;
}

const pinnedRamps: Partial<Record<NeonName, Partial<Omit<NeonRamp, "base">>>> = {
  magenta: {
    hover: "#ff5cb0",
    border: "#c8267d",
    glow: "0 0 6px #ff3ea0, 0 0 14px rgba(255, 62, 160, 0.55)",
  },
  violet: { glow: "0 0 6px #b26bff, 0 0 14px rgba(178, 107, 255, 0.55)" },
  cyan: {
    hover: "#6ce8ff",
    border: "#2a9bb8",
    glow: "0 0 6px #4ee2ff, 0 0 14px rgba(78, 226, 255, 0.55)",
  },
  green: { border: "#2fb863", glow: "0 0 4px #5fff8a, 0 0 10px rgba(95, 255, 138, 0.5)" },
  acid: { glow: "0 0 6px #3dff9e, 0 0 14px rgba(61, 255, 158, 0.55)" },
  yellow: { glow: "0 0 4px #ffd23f, 0 0 10px rgba(255, 210, 63, 0.55)" },
};

export const neonRamp = Object.fromEntries(
  neonNames.map((name) => {
    const base = neon[name];
    const pinned = pinnedRamps[name] ?? {};
    const ramp: NeonRamp = {
      base,
      hover: pinned.hover ?? mixHex(base, "#ffffff", 0.12),
      border: pinned.border ?? mixHex(base, "#000000", 0.22),
      glow: pinned.glow ?? glowFor(base),
    };
    return [name, ramp];
  }),
) as Record<NeonName, NeonRamp>;

/* ---- Surface / foreground theme (what a cabinet can retint) ------------ */
export interface Theme {
  bg: string;
  bg2: string;
  shell: string;
  card: string;
  card2: string;
  muted: string;
  overlay: string;
  fg: string;
  fg2: string;
  fgMuted: string;
  fgDim: string;
  fgOnNeon: string;
  border: string;
  borderSoft: string;
  borderStrong: string;
  ring: string;
  /** Neon used for the single hero action and active states. */
  primary: NeonName;
  /** Neon used for secondary emphasis (secondary button, accent badges). */
  accent: NeonName;
  /** Neon whose glow tints headline chrome (HUD brand, announce banner). */
  cabinetGlow: NeonName;
}

export const baseTheme: Theme = {
  bg: "#0b0716",
  bg2: "#140a26",
  shell: "#1a1030",
  card: "#211640",
  card2: "#2c1d54",
  muted: "#3a2966",
  overlay: "rgba(8, 4, 20, 0.78)",
  fg: "#f3e9ff",
  fg2: "#c8b6e8",
  fgMuted: "#8a78b3",
  fgDim: "#5b4d80",
  fgOnNeon: "#1a0420",
  border: "#4a3580",
  borderSoft: "#2a1d52",
  borderStrong: "#6f4ec2",
  ring: "#d65cff",
  primary: "magenta",
  accent: "cyan",
  cabinetGlow: "magenta",
};

/* ---- Cabinets: four sub-brands, one chassis ---------------------------- */
export interface Cabinet {
  id: string;
  name: string;
  /** What kind of surface this cabinet is for. */
  use: string;
  theme: Partial<Theme>;
}

export const cabinets = {
  "sudo-hero": {
    id: "sudo-hero",
    name: "Sudo Hero",
    use: "Solo quests, terminal-led flows, personal dashboards.",
    theme: {
      bg: "#0e0620", bg2: "#180b32", shell: "#1d1038", card: "#241548", card2: "#301c60",
      border: "#4a3580", borderStrong: "#8a3dff", ring: "#b26bff",
      primary: "violet", accent: "pink", cabinetGlow: "violet",
    },
  },
  "wifi-wizards": {
    id: "wifi-wizards",
    name: "Wi-Fi Wizards",
    use: "Co-op multiplayer, network and sync, party UI.",
    theme: {
      bg: "#12071c", bg2: "#1c0a2c", shell: "#230e36", card: "#2b1240", card2: "#3a1854",
      border: "#6b2a6e", borderStrong: "#ff3ea0", ring: "#ff7ad9",
      primary: "magenta", accent: "cyan", cabinetGlow: "magenta",
    },
  },
  "honkers-hackers": {
    id: "honkers-hackers",
    name: "Honkers & Hackers",
    use: "Time-attack, casual chaos, daily mini-games.",
    theme: {
      bg: "#05101f", bg2: "#081a2e", shell: "#0b2138", card: "#0e2a45", card2: "#133655",
      border: "#1f5f7a", borderStrong: "#2fa8c8", ring: "#4ee2ff",
      primary: "cyan", accent: "yellow", cabinetGlow: "cyan",
    },
  },
  "skognet-syndicate": {
    id: "skognet-syndicate",
    name: "Skog-Net Syndicate",
    use: "City-forest network, eco and infrastructure surfaces.",
    theme: {
      bg: "#050f0c", bg2: "#081a14", shell: "#0b241b", card: "#0e2c21", card2: "#133a2b",
      border: "#1f6647", borderStrong: "#2fb87a", ring: "#3dff9e",
      primary: "acid", accent: "magenta", cabinetGlow: "green",
    },
  },
} as const satisfies Record<string, Cabinet>;

export type CabinetId = keyof typeof cabinets;
export const cabinetIds = Object.keys(cabinets) as CabinetId[];

/* ---- Fixed surfaces (not retinted by cabinets) ------------------------- */
export const fixed = {
  /** Near-black well behind plaques, meters, inputs, avatars. */
  void: "#050810",
  /** CRT terminal canvas. */
  termBg: "#04060c",
  /** Terminal composer row. */
  termBg2: "#060914",
  termBorder: "#14352a",
  /** Dim green bevel for success plaques and done quests. */
  successBevel: "#1f5538",
} as const;

export const status = {
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "cyan",
} as const satisfies Record<string, NeonName>;

export const insets = {
  violet: "inset 0 0 0 2px #4a3580, inset 0 0 12px rgba(178, 107, 255, 0.35)",
  cyan: "inset 0 0 0 2px #2a6f8a, inset 0 0 12px rgba(78, 226, 255, 0.35)",
  green: "inset 0 0 0 2px #1f5538, inset 0 0 12px rgba(95, 255, 138, 0.3)",
  yellow: "inset 0 0 0 2px #6b5418, inset 0 0 12px rgba(255, 210, 63, 0.3)",
} as const;

/* ---- ANSI 16 (terminal) ------------------------------------------------ */
export const ansi = {
  black: "#1a1030", red: "#ff4d6d", green: "#5fff8a", yellow: "#ffd23f",
  blue: "#4a7dff", magenta: "#ff3ea0", cyan: "#4ee2ff", white: "#f3e9ff",
  "bright-black": "#5b4d80", "bright-red": "#ff7a93", "bright-green": "#95ffba",
  "bright-yellow": "#ffe680", "bright-blue": "#7aa3ff", "bright-magenta": "#ff7ad9",
  "bright-cyan": "#8af0ff", "bright-white": "#ffffff",
} as const;

/* ---- Typography -------------------------------------------------------- */
export const fonts = {
  display: '"Press Start 2P", "Silkscreen", monospace',
  ui: '"Silkscreen", "Press Start 2P", monospace',
  body: '"VT323", "JetBrains Mono", monospace',
  mono: '"JetBrains Mono", "VT323", ui-monospace, monospace',
  terminal: '"BigBlueTermPlus", "BigBlueTerm", "DepartureMono", "VT323", ui-monospace, monospace',
  "pixel-mono": '"DepartureMono", "BigBlueTerm", "VT323", ui-monospace, monospace',
} as const;

/** Type scale — snaps to 2px steps. */
export const textSizes = [10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 60] as const;

export const leading = { tight: "1.0", snug: "1.2", normal: "1.4", loose: "1.6" } as const;

/* ---- Spacing / radius / shadow ----------------------------------------- */
export const spaceSteps = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64] as const;

export const radius = { "0": "0", control: "2px", panel: "4px", overlay: "6px" } as const;

export const shadows = {
  panel: "0 2px 0 #000, 0 0 0 1px var(--sk-border)",
  card: "0 4px 0 rgba(0,0,0,0.6), 0 0 0 1px var(--sk-border)",
  overlay: "0 8px 0 rgba(0,0,0,0.5), 0 0 0 2px var(--sk-border-strong)",
} as const;
