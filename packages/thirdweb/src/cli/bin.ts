#!/usr/bin/env node
/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { execSync, spawn } from "node:child_process";
// skip the first two args?
const [, , ...rest] = process.argv;

let bunAvailable = false;
try {
  const res = execSync("bun --version", { stdio: "ignore", encoding: "utf-8" });
  if (typeof res === "string" && res.indexOf(".") > -1) {
    bunAvailable = true;
  }
} catch {
  bunAvailable = false;
}
const runner = bunAvailable ? "bunx" : "npx";
// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
spawn(runner, ["--yes", "@thirdweb-dev/cli@alpha", ...rest], {
  stdio: "inherit",
});
