import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Test against sources, so no build step is needed first.
    alias: {
      "@skogai/arcade-tokens": resolve(__dirname, "packages/tokens/src/index.ts"),
    },
  },
  test: {
    include: ["packages/*/test/**/*.test.{ts,tsx}"],
    environmentMatchGlobs: [["packages/react/**", "jsdom"]],
  },
});
