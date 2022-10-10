#!/usr/bin/env node
import { installGithubAction } from "../common/ci-installer";
import { detectExtensions } from "../common/feature-detector";
import { processProject } from "../common/processor";
import { cliVersion, pkg } from "../constants/urls";
import { info, logger } from "../core/helpers/logger";
import { twCreate } from "../create/command";
import { deployApp } from "../deploy/app";
import generateDashboardUrl from "../helpers/generate-dashboard-url";
import { upload } from "../storage/command";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import { Command } from "commander";
import open from "open";

const main = async () => {
  const program = new Command();

  //yes this has to look like this, eliminates whitespace
  console.info(`
  $$\\     $$\\       $$\\                 $$\\                         $$\\       
  $$ |    $$ |      \\__|                $$ |                        $$ |      
$$$$$$\\   $$$$$$$\\  $$\\  $$$$$$\\   $$$$$$$ |$$\\  $$\\  $$\\  $$$$$$\\  $$$$$$$\\  
\\_$$  _|  $$  __$$\\ $$ |$$  __$$\\ $$  __$$ |$$ | $$ | $$ |$$  __$$\\ $$  __$$\\ 
  $$ |    $$ |  $$ |$$ |$$ |  \\__|$$ /  $$ |$$ | $$ | $$ |$$$$$$$$ |$$ |  $$ |
  $$ |$$\\ $$ |  $$ |$$ |$$ |      $$ |  $$ |$$ | $$ | $$ |$$   ____|$$ |  $$ |
  \\$$$$  |$$ |  $$ |$$ |$$ |      \\$$$$$$$ |\\$$$$$\\$$$$  |\\$$$$$$$\\ $$$$$$$  |
   \\____/ \\__|  \\__|\\__|\\__|       \\_______| \\_____\\____/  \\_______|\\_______/ `);
  console.info(`\n 💎 thirdweb-cli v${cliVersion} 💎\n`);
  import("update-notifier").then(({ default: updateNotifier }) => {
    updateNotifier({
      pkg,
      shouldNotifyInNpmScript: true,
      // check every time while we're still building the CLI
      updateCheckInterval: 0,
    }).notify();
  });

  program
    .name("thirdweb-cli")
    .description("Official thirdweb command line interface")
    .version(cliVersion, "-v, --version");

  program
    .command("create")
    .description(
      "Create a thirdweb app from any of our official templates. Checkout some examples you can use here: https://github.com/thirdweb-example/",
    )
    .option("--app", `Create a thirdweb app.`)
    .option("--contract", `Create a thirdweb contracts project.`)
    .option("--ts, --typescript", `Initialize as a TypeScript project.`)
    .option("--js, --javascript", `Initialize as a JavaScript project.`)
    .option("--forge", `Initialize as a Forge project.`)
    .option("--hardhat", `Initialize as a Hardhat project.`)
    .option("--cra", `Initialize as a Create React App project.`)
    .option("--next", `Initialize as a Next.js project.`)
    .option("--vite", `Initialize as a Vite project.`)
    .option(
      "--use-npm",
      `Explicitly tell the CLI to bootstrap the app using npm`,
    )
    .option(
      "--use-pnpm",
      `Explicitly tell the CLI to bootstrap the app using pnpm`,
    )
    .option("--framework [name]", `The preferred framework.`)
    .option(
      "-t, --template [name]",
      `A template to start your project from. You can use an template repository name from the official thirdweb-example org.`,
    )
    .action(async (options) => {
      await twCreate(options);
    });

  program
    .command("build")
    .description(
      "Compile contracts and detect implemented thirdweb contract extensions",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .option("-a, --all", "run detection on all contracts")
    .action(async (options) => {
      await detectExtensions(options);
    });

  program
    .command("deploy")
    .description(
      "Deploy contracts through your thirdweb dashboard, without dealing with private keys.",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .option(
      "-n, --name [name]",
      "Name of the pre-built or released contract (such as nft-drop)",
    )
    .option(
      "-cv, --contract-version [version]",
      "Version of the released contract",
    )
    .option("--app", "Deploy a web app to decentralized storage")
    .option("--contract", "Deploy a smart contract to blockchains")
    .action(async (options) => {
      if (options.name) {
        const url = generateDashboardUrl(options.name, options.contractVersion);

        if (!url) {
          logger.error(
            chalk.red(
              `Could not find a contract named ${options.name} ${
                options.contractVersion || ""
              }`,
            ),
          );
          return;
        }

        info(`Open this link to deploy your contract:`);
        logger.info(chalk.blueBright(url));
        open(url.toString());
        return;
      }

      if (options.app) {
        try {
          await deployApp({
            path: options.path,
          });
          //info(`Open this link to deploy your contracts:`);
          //logger.info(chalk.blueBright(url.toString()));
          //open(url.toString());
        } catch (err) {
          logger.error(
            "Failed to deploy app, No compatible project found",
            err,
          );
        }
      } else {
        const url = await processProject(options, "deploy");
        info(`Open this link to deploy your contracts:`);
        logger.info(chalk.blueBright(url.toString()));
        open(url.toString());
      }
    });

  program
    .command("release")
    .description(
      "Release contracts, making them available for others to deploy and unlocking SDKs, Dashboards and Analytics.",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .action(async (options) => {
      const url = await processProject(options, "release");
      info(`Open this link to release your contracts:`);
      logger.info(chalk.blueBright(url.toString()));
      open(url.toString());
    });

  program
    .command("upload")
    .description("Upload any file or directory using decentralized storage")
    .argument("[upload-path]", "path to file or directory to upload")
    .action(async (path) => {
      const storage = new ThirdwebStorage();
      const uri = await upload(storage, path);
      info(`Files stored at the following IPFS URI:`);
      logger.info(chalk.blueBright(uri.toString()));

      const url = storage.resolveScheme(uri);
      info(`Open this link to view your upload:`);
      logger.info(chalk.blueBright(url.toString()));
    });

  program
    .command("detect")
    .description(
      "(deprecated) Compile contracts and detect implemented thirdweb contract extensions",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .option("-a, --all", "run detection on all contracts")
    .action(async (options) => {
      await detectExtensions(options);
    });

  await program.parseAsync();
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
