#!/usr/bin/env node
import { spawn } from "cross-spawn";
import {
  generate,
  isValidChainIdAndContractAddress,
} from "./commands/generate/generate.js";
import { deployStylus, publishStylus } from "./commands/stylus/builder.js";
import { createStylusProject } from "./commands/stylus/create.js";

// skip the first two args?
const [, , command = "", ...rest] = process.argv;

let secretKey: string | undefined;
const keyIndex = rest.indexOf("-k");
if (keyIndex !== -1 && rest.length > keyIndex + 1) {
  secretKey = rest[keyIndex + 1];
}

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

    case "publish-stylus": {
      await publishStylus(secretKey);
      break;
    }

    case "deploy-stylus": {
      await deployStylus(secretKey);
      break;
    }

    case "create-stylus": {
      await createStylusProject();
      break;
    }

    case "login": {
      // Not implemented yet
      console.info(
        "Please instead pass a secret key to the command directly, learn more: https://portal.thirdweb.com/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
      );
      process.exit(1);
      break;
    }

    default: {
      // check several commands for missing -k flag
      const commands = ["deploy", "publish", "generate", "upload"];
      if (commands.includes(command) && !rest.includes("-k")) {
        console.info(
          "Please include the -k flag with your secret key, learn more: https://portal.thirdweb.com/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
        );
        process.exit(1);
        return;
      }

      const isWindows = /^win/.test(process.platform);

      let runner = "npx";

      switch (true) {
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
