import { join } from "node:path";
import codspeedPlugin from "@codspeed/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const plugins = process.env.CI ? [codspeedPlugin()] : [];

export default defineConfig({
  // @ts-expect-error - this is a valid vite config
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
    environmentMatchGlobs: [
      ["src/react/**/*.test.tsx", "happy-dom"],
      ["src/**/*.test.ts", "node"],
      ["src/**/*", "node"], // all other files use node
    ],
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [join(__dirname, "./reactSetup.ts")],
    globalSetup: [join(__dirname, "./globalSetup.ts")],
    testTimeout: 90_000,
    retry: 0,
    bail: 1,
    // clear any mocks between any tests
    clearMocks: true,
    pool: "forks",
  },
});
