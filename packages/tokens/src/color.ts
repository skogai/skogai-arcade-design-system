/** Small color helpers used to derive ramps. Hex input is #rrggbb. */

export function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Expected #rrggbb, got "${hex}"`);
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

/** Linear sRGB mix: `amount` of `other` into `base`. */
export function mixHex(base: string, other: string, amount: number): string {
  const a = parseHex(base);
  const b = parseHex(other);
  return toHex([0, 1, 2].map((i) => a[i]! + (b[i]! - a[i]!) * amount) as [number, number, number]);
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** The house neon glow: tight core + soft halo. */
export function glowFor(hex: string): string {
  return `0 0 6px ${hex}, 0 0 14px ${rgba(hex, 0.55)}`;
}
