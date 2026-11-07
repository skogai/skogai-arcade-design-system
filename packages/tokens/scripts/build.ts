import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTailwindCss, buildTokensCss, buildTokensJson } from "../src/index.js";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
mkdirSync(dist, { recursive: true });

writeFileSync(resolve(dist, "tokens.css"), buildTokensCss());
writeFileSync(resolve(dist, "tailwind.css"), buildTailwindCss());
writeFileSync(resolve(dist, "tokens.json"), JSON.stringify(buildTokensJson(), null, 2) + "\n");

console.log("tokens: wrote dist/tokens.css, dist/tailwind.css, dist/tokens.json");
