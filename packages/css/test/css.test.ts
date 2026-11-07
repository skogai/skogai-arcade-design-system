import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildTokensCss } from "@skogai/arcade-tokens";

const src = (f: string) => readFileSync(resolve(__dirname, "../src", f), "utf8");
const layers = ["base.css", "components.css", "terminal.css"] as const;
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const defined = new Set(
  [...buildTokensCss().matchAll(/(--sk-[\w-]+)\s*:/g)].map((m) => m[1]!),
);

describe("css layers", () => {
  for (const file of layers) {
    it(`${file} uses no raw hex colors (tokens only)`, () => {
      const hex = stripComments(src(file)).match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      expect(hex).toEqual([]);
    });

    it(`${file} only references defined --sk-* tokens`, () => {
      const css = stripComments(src(file));
      // Locally-scoped knobs a component reads with a fallback are allowed.
      const local = new Set(["--sk-quest-cols"]);
      const used = [...css.matchAll(/var\((--sk-[\w-]+)/g)].map((m) => m[1]!);
      const missing = [...new Set(used)].filter((v) => !defined.has(v) && !local.has(v));
      expect(missing).toEqual([]);
    });
  }

  it("every reference-bundle class still exists", () => {
    const reference = ["components.css", "terminal.css"]
      .map((f) => readFileSync(resolve(__dirname, "../../../project", f), "utf8"))
      .join("\n");
    const ours = layers.map(src).join("\n");
    const classes = (css: string) =>
      new Set([...stripComments(css).matchAll(/\.(sk[t]?-[\w-]+)/g)].map((m) => m[1]!));
    const missing = [...classes(reference)].filter((c) => !classes(ours).has(c));
    expect(missing).toEqual([]);
  });
});
