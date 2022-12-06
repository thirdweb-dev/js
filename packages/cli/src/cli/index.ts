#!/usr/bin/env node
import { detectExtensions } from "../common/feature-detector";
import { processProject } from "../common/processor";
import { cliVersion, pkg } from "../constants/urls";
import { info, logger, spinner } from "../core/helpers/logger";
import { twCreate } from "../create/command";
import { deploy } from "../deploy";
import { findPackageInstallation } from "../helpers/detect-local-packages";
import { upload } from "../storage/command";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import { Command } from "commander";
import open from "open";
import prompts from "prompts";

const main = async () => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const skipIntro = process.env.THIRDWEB_CLI_SKIP_INTRO === "true";

  const program = new Command();

  // yes this has to look like this, eliminates whitespace
  if (!skipIntro) {
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
  }

  program
    .name("thirdweb-cli")
    .description("Official thirdweb command line interface")
    .version(cliVersion, "-v, --version");

  program
    .command("create [projectType] [projectPath]")
    .description(
      "Create a web3 app from any of our official templates: https://github.com/thirdweb-example/",
    )
    .option("--app", "Create a web3 app.")
    .option("--contract", "Create a web3 contract project")
    .option("--ts, --typescript", "Initialize as a TypeScript project.")
    .option("--js, --javascript", "Initialize as a JavaScript project.")
    .option("--forge", "Initialize as a Forge project.")
    .option("--hardhat", "Initialize as a Hardhat project.")
    .option("--cra", "Initialize as a Create React App project.")
    .option("--next", "Initialize as a Next.js project.")
    .option("--vite", "Initialize as a Vite project.")
    .option(
      "--use-npm",
      "Explicitly tell the CLI to bootstrap the app using npm",
    )
    .option(
      "--use-pnpm",
      "Explicitly tell the CLI to bootstrap the app using pnpm",
    )
    .option("--framework [name]", "The preferred framework.")
    .option("--solana", "Initialize as a Solana project.")
    .option("--evm", "Initialize as an Ethereum project.")
    .option(
      "-t, --template [name]",
      "A template to start your project from. You can use an template repository name from the official thirdweb-example org.",
    )
    .option(
      "-c, --contract-name [name]",
      "Name of the new smart contract to create",
    )
    .action(async (type, path, options) => {
      await twCreate(type, path, options);
    });

  program
    .command("build")
    .description("Compile contract and detect thirdweb contract extensions")
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .option("-a, --all", "run detection on all contracts")
    .action(async (options) => {
      await detectExtensions(options);
    });

  program
    .command("deploy")
    .description("Deploy your (or team) contracts securely to blockchains")
    .option("-p, --path <project-path>", "path to project", ".")
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .option(
      "--dist-path [distPath]",
      "Path to the dist folder where the HTML based App is",
    )
    .option(
      "-n, --name [name]",
      "Name of the pre-built or released contract (such as nft-drop)",
    )
    .option(
      "-f, --file [name]",
      "Filter for contract files that contain this file name",
    )
    .option(
      "-cn, --contract-name [name]",
      "Filter for contracts that contain this contract name",
    )
    .option(
      "-cv, --contract-version [version]",
      "Version of the released contract",
    )
    .option("--app", "Deploy a web app to decentralized storage")
    .option("--contract", "Deploy a smart contract to blockchains")
    .action(async (options) => {
      const url = await deploy(options);
      if (url) {
        open(url);
      }
    });

  program
    .command("release")
    .description(
      "Release your protocol so other devs can deploy them and unlock SDKs, Dashboards and Analytics",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option(
      "-f, --file [name]",
      "Filter for contract files that contain the file name",
    )
    .option(
      "-cn, --contract-name [name]",
      "Filter for contracts that contain this contract name",
    )
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .action(async (options) => {
      const url = await processProject(options, "release");
      info(
        `Open this link to release your contracts: ${chalk.blueBright(
          url.toString(),
        )}`,
      );
      open(url.toString());
    });

  program
    .command("upload")
    .description("Upload any file or directory to decentralized storage (IPFS)")
    .argument("[upload]", "path to file or directory to upload")
    .action(async (path) => {
      const storage = new ThirdwebStorage();
      try {
        const uri = await upload(storage, path);
        info(
          `Files stored at the following IPFS URI: ${chalk.blueBright(
            uri.toString(),
          )}`,
        );

        const url = storage.resolveScheme(uri);
        info(
          `Open this link to view your upload: ${chalk.blueBright(
            url.toString(),
          )}`,
        );
      } catch (err: any) {
        if (
          err.toString() === "No files detected in specified directory" ||
          err.toString() === "Invalid path provided" ||
          err.toString() === "No path provided"
        ) {
          logger.error(
            chalk.redBright(
              "Please specify a valid file or directory to upload",
            ),
          );
        } else {
          logger.error(chalk.redBright("Failed to upload files"), err);
        }
      }
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

  if (!skipIntro) {
    const versionSpinner = spinner("Checking for updates...");
    await import("update-notifier").then(
      async ({ default: updateNotifier }) => {
        const notifier = updateNotifier({
          pkg,
          shouldNotifyInNpmScript: true,
          // check every time while we're still building the CLI
          updateCheckInterval: 0,
        });

        const versionInfo = await notifier.fetchInfo();
        versionSpinner.stop();

        if (versionInfo.type !== "latest") {
          const res = await prompts({
            type: "toggle",
            name: "upgrade",
            message: `A new version of the CLI is available. Would you like to upgrade?`,
            initial: true,
            active: "yes",
            inactive: "no",
          });

          if (res.upgrade) {
            const updateSpinner = spinner(
              `Upgrading CLI to version ${versionInfo.latest}...`,
            );

            const clonedEnvironment = { ...process.env };
            clonedEnvironment.THIRDWEB_CLI_SKIP_INTRO = "true";

            const installation = await findPackageInstallation();

            // If the package isn't installed anywhere, just defer to npx thirdweb@latest
            if (!installation) {
              updateSpinner.succeed(
                `Now using CLI version ${versionInfo.latest}. Continuing execution...`,
              );

              await new Promise((done, failed) => {
                const shell = spawn(
                  `npx --yes thirdweb@latest ${process.argv
                    .slice(2)
                    .join(" ")}`,
                  [],
                  { stdio: "inherit", shell: true, env: clonedEnvironment },
                );
                shell.on("close", (code) => {
                  if (code === 0) {
                    done("");
                  } else {
                    failed();
                  }
                });
              });

              return process.exit(0);
            }

            // Otherwise, get the correct command based on package manager and local vs. global
            let command = "";
            switch (installation.packageManager) {
              case "npm":
                command = installation.isGlobal
                  ? `npm install -g thirdweb`
                  : `npm install thirdweb`;
                break;
              case "yarn":
                command = installation.isGlobal
                  ? `yarn global add thirdweb`
                  : `yarn add thirdweb`;
                break;
              case "pnpm":
                command = installation.isGlobal
                  ? `pnpm add -g thirdweb@latest`
                  : `pnpm add thirdweb@latest`;
                break;
              default:
                console.error(
                  `Could not detect package manager in use, aborting automatic upgrade.\nIf you want to upgrade the CLI, please do it manually with your package manager.`,
                );
                process.exit(1);
            }

            await new Promise((done, failed) => {
              exec(command, (err, stdout, stderr) => {
                if (err) {
                  failed(err);
                  return;
                }

                done({ stdout, stderr });
              });
            });

            updateSpinner.succeed(
              `Successfully upgraded CLI to version ${versionInfo.latest}. Continuing execution...`,
            );

            // If the package is installed globally with yarn or pnpm, then npx won't recognize it
            // So we need to make sure to run the command directly
            const executionCommand =
              !installation.isGlobal || installation.packageManager === "npm"
                ? `npx thirdweb`
                : `thirdweb`;
            await new Promise((done, failed) => {
              const shell = spawn(
                `${executionCommand} ${process.argv.slice(2).join(" ")}`,
                [],
                { stdio: "inherit", shell: true, env: clonedEnvironment },
              );
              shell.on("close", (code) => {
                if (code === 0) {
                  done("");
                } else {
                  failed();
                }
              });
            });

            process.exit(0);
          }
        }
      },
    );
  }

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
