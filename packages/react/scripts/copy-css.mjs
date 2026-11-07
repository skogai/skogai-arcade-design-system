// Re-export the CSS bundle (and its fonts) so `@skogai/arcade-react/styles.css` works.
import { cpSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const cssDist = dirname(require.resolve("@skogai/arcade-css/arcade.css"));
const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

cpSync(resolve(cssDist, "arcade.css"), resolve(dist, "arcade.css"));
cpSync(resolve(cssDist, "fonts"), resolve(dist, "fonts"), { recursive: true });
console.log("react: copied arcade.css + fonts into dist/");
