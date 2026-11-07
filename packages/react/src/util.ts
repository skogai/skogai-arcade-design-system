/** Join class names, skipping falsy values. */
export function cx(...parts: (string | false | null | undefined)[]): string | undefined {
  const s = parts.filter(Boolean).join(" ");
  return s || undefined;
}

/**
 * Pad a score per house style: 12750 → "012,750".
 * `digits` is the minimum digit count before grouping.
 */
export function formatScore(value: number, digits = 6): string {
  const n = Math.max(0, Math.trunc(value));
  return String(n)
    .padStart(digits, "0")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Seconds → "02:18" or "01:23:45" (hours shown when non-zero or forced). */
export function formatTime(totalSeconds: number, opts: { hours?: boolean } = {}): string {
  const t = Math.max(0, Math.trunc(totalSeconds));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 || opts.hours ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
