#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { version } from "../package.json";
import { printCLIBanner } from "./utils/banner";
import { ensureFSDirs } from "./utils/filesystem";
import { logger } from "./utils/logger";
import { exposeLegacyCommands } from "./legacy-commands";
import { upload } from "./commands/upload";
import { login } from "./commands/login";
import { logout } from "./commands/logout";
import { generate } from "./commands/generate";
import { whoami } from "./commands/whoami";

async function run() {
  // print the banner (informs of new version, etc)
  await printCLIBanner();
  // ensure config dirs exist
  await ensureFSDirs();

  // setup the CLI
  const thirdweb = new Command("thirdweb");

  // define the core config
  thirdweb
    .description("thirdweb command line interface")
    .version(version, "-v, --version");

  // define the commands

  thirdweb.addCommand(generate);
  thirdweb.addCommand(upload);
  // "auth" related commands should be last
  thirdweb.addCommand(login);
  thirdweb.addCommand(logout);
  thirdweb.addCommand(whoami);

  // also expose legacy commands
  exposeLegacyCommands(thirdweb);

  // actually execute the CLI
  await thirdweb.parseAsync();
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
