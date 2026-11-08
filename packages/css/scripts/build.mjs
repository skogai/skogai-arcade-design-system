// Bundles tokens + base + components + terminal into dist/, with fonts and icons.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve("@skogai/arcade-tokens/tokens.css"), "utf8");

export const GOOGLE_FONTS =
  '@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap");\n';

const parts = ["fonts.css", "base.css", "components.css", "terminal.css", "cards.css"];
const read = (f) => readFileSync(resolve(root, "src", f), "utf8");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const body = [tokensCss, ...parts.map(read)].join("\n");
const banner = "/* @skogai/arcade-css — GENERATED bundle. Source: packages/css/src */\n";

// arcade.css: everything, display/body faces from Google Fonts.
writeFileSync(resolve(dist, "arcade.css"), GOOGLE_FONTS + banner + body);
// arcade.local.css: no remote import, for CSP-strict or self-hosted apps.
writeFileSync(resolve(dist, "arcade.local.css"), banner + body);
// Individual layers for apps that want to compose their own bundle.
writeFileSync(resolve(dist, "tokens.css"), tokensCss);
writeFileSync(resolve(dist, "google-fonts.css"), GOOGLE_FONTS);
for (const f of parts) writeFileSync(resolve(dist, f), read(f));

cpSync(resolve(root, "fonts"), resolve(dist, "fonts"), { recursive: true });
cpSync(resolve(root, "src/icons.svg"), resolve(dist, "icons.svg"));

console.log("css: wrote dist/arcade.css, dist/arcade.local.css and layers");
