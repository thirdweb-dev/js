import { defineConfig } from "checkly";
import { Frequency } from "checkly/constructs";

export default defineConfig({
  projectName: "thirdweb.com",
  logicalId: "thirdweb-www",
  repoUrl: "https://github.com/thirdweb-dev/dashboard",
  checks: {
    activated: true,
    muted: false,
    runtimeId: "2023.09",
    frequency: Frequency.EVERY_24H,
    locations: ["us-east-1", "eu-west-1"],
    tags: ["website"],
    checkMatch: "./**/*.check.ts",
    ignoreDirectoriesMatch: [],
    playwrightConfig: {
      use: {
        baseURL: process.env.ENVIRONMENT_URL || "https://thirdweb.com",
      },
    },
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: "./tests/**/*.spec.ts",
    },
  },
  cli: {
    runLocation: "eu-west-1",
  },
});
