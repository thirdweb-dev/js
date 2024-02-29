import { join } from "node:path";
import { defineConfig } from "vitest/config";
// @ts-expect-error - no types
import codspeedPlugin from "@codspeed/vitest-plugin";

const plugins = process.env.CI ? [codspeedPlugin()] : [];

export default defineConfig({
  plugins,
  test: {
    alias: {
      "~test": join(__dirname, "./src"),
    },
    benchmark: {},
    coverage: {
      all: true,
      provider: "v8",
      reporter: process.env.CI ? ["lcov"] : ["text", "json", "html"],
      exclude: ["**/*.test.ts", "**/test/**"],
      include: ["src/**"],
    },
    environment: "node",
    include: ["src/**/*.test.ts"],
    // setupFiles: [join(__dirname, "./setup.ts")],
    globalSetup: [join(__dirname, "./globalSetup.ts")],
    testTimeout: 20_000,
  },
});
