import { defineConfig } from "checkly";
import { Frequency } from "checkly/constructs";

export default defineConfig({
  checks: {
    activated: true,
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: "./tests/**/*.spec.ts",
    },
    checkMatch: "./**/*.check.ts",
    frequency: Frequency.EVERY_24H,
    ignoreDirectoriesMatch: [],
    locations: ["us-east-1", "eu-west-1"],
    muted: false,
    playwrightConfig: {
      use: {
        baseURL: process.env.ENVIRONMENT_URL || "https://thirdweb.com",
      },
    },
    runtimeId: "2023.09",
    tags: ["website"],
  },
  cli: {
    runLocation: "eu-west-1",
  },
  logicalId: "thirdweb-www",
  projectName: "thirdweb.com",
  repoUrl: "https://github.com/thirdweb-dev/dashboard",
});
