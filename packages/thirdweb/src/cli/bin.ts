#!/usr/bin/env node

import { execSync } from "node:child_process";
import { spawn } from "cross-spawn";
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

      const isBunAvailable = (() => {
        try {
          const res = execSync("bun --version", {
            stdio: "ignore",
            encoding: "utf-8",
          });
          if (typeof res === "string" && res.indexOf(".") > -1) {
            return true;
          }
        } catch {}
        return false;
      })();

      let runner = "npx";

      switch (true) {
        case isBunAvailable:
          runner = "bun";
          break;
        case isWindows:
          runner = "npx.cmd";
          break;
      }

      const args = command
        ? ["--yes", "@thirdweb-dev/cli@latest", command, ...rest]
        : ["--yes", "@thirdweb-dev/cli@latest", ...rest];

      spawn(runner, args, {
        stdio: "inherit",
      });
    }
  }
}

main();
