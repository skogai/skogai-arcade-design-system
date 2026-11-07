/**
 * Parity: every custom property declared in the Claude Design reference
 * (project/colors_and_type.css) must be emitted with the same value, in
 * :root and in every cabinet scope. Extra tokens are allowed.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildTokensCss, cabinetIds, cabinetSelector } from "../src/index.js";

const reference = readFileSync(
  resolve(__dirname, "../../../project/colors_and_type.css"),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

const norm = (v: string) => v.replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").trim().toLowerCase();

/** Collect declarations from every rule whose selector list includes `selector`. */
function declsFor(css: string, selector: string): Map<string, string> {
  const out = new Map<string, string>();
  const rule = /([^{};]+)\{([^{}]*)\}/g;
  for (const m of css.matchAll(rule)) {
    const selectors = m[1]!.split(",").map((s) => s.trim());
    if (!selectors.includes(selector)) continue;
    for (const d of m[2]!.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out.set(d[1]!, norm(d[2]!));
  }
  return out;
}

const generated = buildTokensCss().replace(/\/\*[\s\S]*?\*\//g, "");

describe("token parity with reference bundle", () => {
  for (const selector of [":root", ...cabinetIds.map(cabinetSelector)]) {
    it(`matches ${selector}`, () => {
      const ref = declsFor(reference, selector);
      const ours = declsFor(generated, selector);
      expect(ref.size).toBeGreaterThan(0);
      const mismatches = [...ref].filter(([name, value]) => ours.get(name) !== value);
      expect(mismatches.map(([n, v]) => `${n}: want ${v}, got ${ours.get(n)}`)).toEqual([]);
    });
  }

  it("re-declares theme-dependent shadows inside each cabinet", () => {
    for (const id of cabinetIds) {
      expect(declsFor(generated, cabinetSelector(id)).get("--sk-shadow-card")).toContain(
        "var(--sk-border)",
      );
    }
  });
});
