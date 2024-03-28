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
      let bunAvailable = false;
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
      const runner = bunAvailable ? "bunx" : "npx";
      // eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
      spawn(runner, ["--yes", "@thirdweb-dev/cli@beta", command, ...rest], {
        stdio: "inherit",
      });
    }
  }
}

main();
