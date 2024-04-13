import { join } from "node:path";
// @ts-expect-error - no types
import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig } from "vitest/config";

const plugins = process.env.CI ? [codspeedPlugin()] : [];

export default defineConfig({
  plugins,
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
    environment: "node",
    include: ["src/**/*.test.ts"],
    // setupFiles: [join(__dirname, "./setup.ts")],
    globalSetup: [join(__dirname, "./globalSetup.ts")],
    testTimeout: 60_000,
    retry: 0,
    bail: 1,
    // clear any mocks between any tests
    clearMocks: true,
    pool: "forks",
  },
});
