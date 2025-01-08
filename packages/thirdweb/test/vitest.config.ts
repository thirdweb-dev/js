import { join } from "node:path";
import codspeedPlugin from "@codspeed/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const plugins = process.env.CI ? [codspeedPlugin()] : [];

export default defineConfig({
  plugins: [...plugins, react()],
  test: {
    alias: {
      "~test": join(__dirname, "./src"),
    },
    benchmark: {},
    coverage: {
      all: false,
      provider: "v8",
      reporter: process.env.CI ? ["lcov"] : ["text", "json", "html"],
      exclude: [
        // test files do not count
        "**/*.test.ts",
        "**/*.test.tsx",
        // benchmark files do not count
        "**/*.bench.ts",
        // anything inside /test/ does not count
        "**/test/**",
        // generated files do not count
        "**/__generated__/**",
        // exports do not count
        "src/exports/**",
      ],
      include: ["src/**"],
    },
    environmentMatchGlobs: [["src/**/*.test.tsx", "happy-dom"]],
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [join(__dirname, "./reactSetup.ts")],
    globalSetup: [join(__dirname, "./globalSetup.ts")],
    testTimeout: 90_000,
    retry: process.env.CI ? 3 : 0,
    maxConcurrency: 3,
    bail: 1,
    // clear any mocks between any tests
    clearMocks: true,
    pool: "forks",
  },
});
