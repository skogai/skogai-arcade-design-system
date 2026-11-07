/* Generators: tokens → CSS custom properties, JSON, Tailwind v4 theme. */

import {
  ansi,
  baseTheme,
  cabinetIds,
  cabinets,
  fixed,
  fonts,
  insets,
  leading,
  neon,
  neonNames,
  neonRamp,
  radius,
  shadows,
  spaceSteps,
  status,
  textSizes,
  type CabinetId,
  type NeonName,
  type Theme,
} from "./tokens.js";

const kebab = (s: string) => s.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();

/** CSS custom property name for a theme key: card2 → --sk-card-2. */
export const themeVar = (key: keyof Theme) => `--sk-${kebab(key)}`;

type Decl = [name: string, value: string];

function themeDecls(theme: Partial<Theme>): Decl[] {
  const out: Decl[] = [];
  for (const [key, value] of Object.entries(theme) as [keyof Theme, string][]) {
    if (key === "primary" || key === "accent") {
      const n = value as NeonName;
      out.push([`--sk-${key}`, `var(--sk-neon-${n})`]);
      out.push([`--sk-${key}-hover`, `var(--sk-neon-${n}-hover)`]);
      out.push([`--sk-${key}-border`, `var(--sk-neon-${n}-border)`]);
      out.push([`--sk-${key}-glow`, `var(--sk-glow-${n})`]);
    } else if (key === "cabinetGlow") {
      out.push(["--sk-cabinet-glow", `var(--sk-glow-${value})`]);
    } else {
      out.push([themeVar(key), value]);
    }
  }
  return out;
}

function rootDecls(): Decl[] {
  const d: Decl[] = [];
  d.push(...themeDecls(baseTheme));
  d.push(["--sk-primary-fg", "var(--sk-fg-on-neon)"]);
  d.push(["--sk-accent-fg", "var(--sk-fg-on-neon)"]);
  for (const n of neonNames) {
    d.push([`--sk-neon-${n}`, neon[n]]);
    d.push([`--sk-neon-${n}-hover`, neonRamp[n].hover]);
    d.push([`--sk-neon-${n}-border`, neonRamp[n].border]);
  }
  for (const n of neonNames) d.push([`--sk-glow-${n}`, neonRamp[n].glow]);
  for (const [role, n] of Object.entries(status)) d.push([`--sk-${role}`, `var(--sk-neon-${n})`]);
  for (const [k, v] of Object.entries(fixed)) d.push([`--sk-${kebab(k)}`, v]);
  for (const [k, v] of Object.entries(insets)) d.push([`--sk-inset-${k}`, v]);
  for (const [k, v] of Object.entries(ansi)) d.push([`--sk-ansi-${k}`, v]);
  for (const [k, v] of Object.entries(fonts)) d.push([`--sk-font-${k}`, v]);
  for (const s of textSizes) d.push([`--sk-text-${s}`, `${s}px`]);
  for (const [k, v] of Object.entries(leading)) d.push([`--sk-leading-${k}`, v]);
  for (const s of spaceSteps) d.push([`--sk-space-${s}`, `${s}px`]);
  for (const [k, v] of Object.entries(radius)) d.push([`--sk-radius-${k}`, v]);
  return d;
}

/**
 * Tokens that reference themable values must be re-declared on every
 * cabinet scope, otherwise they resolve once at :root and never retint.
 */
function scopedDecls(): Decl[] {
  return [
    ...Object.entries(shadows).map(([k, v]) => [`--sk-shadow-${k}`, v] as Decl),
    [
      "--sk-inset-primary",
      "inset 0 0 0 2px color-mix(in srgb, var(--sk-primary) 50%, #000), inset 0 0 12px color-mix(in srgb, var(--sk-primary) 40%, transparent)",
    ],
    ["--sk-ring-soft", "color-mix(in srgb, var(--sk-ring) 35%, transparent)"],
  ];
}

const block = (selector: string, decls: Decl[]) =>
  `${selector} {\n${decls.map(([n, v]) => `  ${n}: ${v};`).join("\n")}\n}\n`;

export const cabinetSelector = (id: CabinetId) => `[data-cabinet="${id}"]`;

export function buildTokensCss(): string {
  const header =
    "/* Skogai Arcade tokens — GENERATED from packages/tokens/src/tokens.ts. Do not edit. */\n\n";
  const cabinetBlocks = cabinetIds
    .map((id) => block(cabinetSelector(id), themeDecls(cabinets[id].theme)))
    .join("\n");
  const scopedSelector = [":root", ...cabinetIds.map(cabinetSelector)].join(",\n");
  return (
    header +
    block(":root", rootDecls()) +
    "\n/* Cabinet themes: scope any subtree with data-cabinet=\"…\". */\n" +
    cabinetBlocks +
    "\n/* Theme-dependent composites, re-evaluated inside every cabinet. */\n" +
    block(scopedSelector, scopedDecls())
  );
}

/** A cabinet's fully-resolved theme (base merged with overrides). */
export function resolveTheme(id?: CabinetId): Theme {
  return id ? { ...baseTheme, ...cabinets[id].theme } : { ...baseTheme };
}

export function buildTokensJson() {
  return {
    neon,
    neonRamp,
    status,
    fixed,
    insets,
    ansi,
    fonts,
    textSizes,
    leading,
    spaceSteps,
    radius,
    shadows,
    themes: {
      default: resolveTheme(),
      ...Object.fromEntries(cabinetIds.map((id) => [id, resolveTheme(id)])),
    },
    cabinets: Object.fromEntries(
      cabinetIds.map((id) => [id, { id, name: cabinets[id].name, use: cabinets[id].use }]),
    ),
  };
}

/** Tailwind v4 theme: `@import "@skogai/arcade-tokens/tailwind.css";` */
export function buildTailwindCss(): string {
  const colorKeys: (keyof Theme)[] = [
    "bg", "bg2", "shell", "card", "card2", "muted", "overlay", "fg", "fg2", "fgMuted",
    "fgDim", "fgOnNeon", "border", "borderSoft", "borderStrong", "ring",
  ];
  const d: Decl[] = [];
  for (const k of colorKeys) d.push([`--color-sk-${kebab(k)}`, `var(${themeVar(k)})`]);
  for (const r of ["primary", "primary-hover", "primary-fg", "accent", "accent-hover", "accent-fg"])
    d.push([`--color-sk-${r}`, `var(--sk-${r})`]);
  for (const r of Object.keys(status)) d.push([`--color-sk-${r}`, `var(--sk-${r})`]);
  for (const n of neonNames) d.push([`--color-sk-${n}`, `var(--sk-neon-${n})`]);
  for (const k of Object.keys(fonts)) d.push([`--font-sk-${k}`, `var(--sk-font-${k})`]);
  for (const k of Object.keys(radius)) d.push([`--radius-sk-${k}`, `var(--sk-radius-${k})`]);
  for (const k of Object.keys(shadows)) d.push([`--shadow-sk-${k}`, `var(--sk-shadow-${k})`]);
  for (const n of neonNames) d.push([`--text-shadow-sk-${n}`, `var(--sk-glow-${n})`]);

  const variants = cabinetIds
    .map(
      (id) =>
        `@custom-variant cabinet-${id} (&:where(${cabinetSelector(id)}, ${cabinetSelector(id)} *));`,
    )
    .join("\n");

  return (
    "/* Skogai Arcade Tailwind v4 theme — GENERATED. Import after tokens.css. */\n\n" +
    block("@theme inline", d) +
    "\n" +
    variants +
    "\n"
  );
}
