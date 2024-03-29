#!/usr/bin/env node
/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { execSync, spawn } from "node:child_process";
import {
  generate,
  isValidChainIdAndContractAddress,
} from "./commands/generate/generate.js";
// skip the first two args?
const [, , command = "", ...rest] = process.argv;

async function main() {
  switch (command) {
    case "generate": {
      const [chainIdPlusContract] = rest;
      if (!isValidChainIdAndContractAddress(chainIdPlusContract)) {
        console.info("Usage: thirdweb generate <chainId>/<contractAddress>");
        process.exit(1);
      } else {
        await generate(chainIdPlusContract);
      }

      break;
    }

    default: {
      const isWindows = /^win/.test(process.platform);
      let bunAvailable = false;
      // bun has no windows support yet anyways
      if (!isWindows) {
        try {
          const res = execSync("bun --version", {
            stdio: "ignore",
            encoding: "utf-8",
          });
          if (typeof res === "string" && res.indexOf(".") > -1) {
            bunAvailable = true;
          }
        } catch {
          bunAvailable = false;
        }
      }
      let runner = "npx";

      switch (true) {
        case bunAvailable:
          runner = "bun";
          break;
        case isWindows:
          runner = "npx.cmd";
          break;
      }

      const args = command
        ? ["--yes", "@thirdweb-dev/cli@latest", command, ...rest]
        : ["--yes", "@thirdweb-dev/cli@latest", ...rest];

      // eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
      spawn(runner, args, {
        stdio: "inherit",
      });
    }
  }
}

main();
