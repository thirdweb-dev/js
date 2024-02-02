import { join } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "~test": join(__dirname, "./src"),
    },
    benchmark: {
      outputFile: "./bench/report.json",
      reporters: process.env.CI ? ["json"] : ["verbose"],
    },
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
