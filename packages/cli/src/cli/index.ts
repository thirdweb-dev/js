#!/usr/bin/env node
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import { Command } from "commander";
import fs from "fs";
import open from "open";
import path from "path";
import prompts from "prompts";
import xdgAppPaths from "xdg-app-paths";
import { loginUser, logoutUser, validateKey } from "../auth";
import { detectExtensions } from "../common/feature-detector";
import { processProject } from "../common/processor";
import { detectProject } from "../common/project-detector";
import { cliVersion, pkg } from "../constants/urls";
import { info, logger, spinner } from "../core/helpers/logger";
import { twCreate } from "../create/command";
import { deploy } from "../deploy";
import { generate } from "../generate/command";
import { findPackageInstallation } from "../helpers/detect-local-packages";
import { install } from "../install";
import { upload } from "../storage/command";

const main = async () => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const skipIntro = process.env.THIRDWEB_CLI_SKIP_INTRO === "true";
  const configDir = xdgAppPaths(".thirdweb").config();
  const cacheDir = xdgAppPaths(".thirdweb").cache();
  const lastVersionCheckCachePath = path.join(
    cacheDir,
    "last-version-check.txt",
  );
  const credsConfigPath = path.join(configDir, "creds.json");
  const cliWalletPath = path.join(configDir, "wallet.json");
  const tokenPath = path.join(configDir, "auth-token.txt");

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
    console.info(`\n 💎 thirdweb v${cliVersion} 💎\n`);
  }

  program
    .name("thirdweb")
    .description("Official thirdweb command line interface")
    .version(cliVersion, "-v, --version")
    .option("--skip-update-check", "Skip check for auto updates")
    .hook("preAction", async () => {
      const regenerateConfig = !fs.existsSync(configDir);
      const regenerateCache = !fs.existsSync(cacheDir);

      // Create config directory if it doesn't exist
      if (regenerateConfig) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // Create cache directory if it doesn't exist
      if (regenerateCache) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      if (skipIntro || program.opts().skipUpdateCheck) {
        return;
      }

      let shouldCheckVersion = true;
      try {
        const lastVersionCheckCache = fs.readFileSync(
          lastVersionCheckCachePath,
          "utf-8",
        );

        if (lastVersionCheckCache) {
          const lastVersionCheck = new Date(lastVersionCheckCache);
          // Don't check for updates if already checked within past 24 hours
          if (Date.now() - lastVersionCheck.getTime() < 1000 * 60 * 60 * 24) {
            shouldCheckVersion = false;
          }
        }
      } catch {
        // no-op
      }

      if (!shouldCheckVersion) {
        return;
      }

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

          try {
            // Set cache to prevent checking for updates again for 24 hours
            fs.writeFileSync(
              lastVersionCheckCachePath,
              new Date().toISOString(),
              {
                encoding: "utf-8",
                mode: 0o600,
              },
            );
          } catch {
            // no-op
          }

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

                await new Promise((resolve, reject) => {
                  const shell = spawn(
                    `npx --yes thirdweb@latest ${process.argv
                      .slice(2)
                      .join(" ")}`,
                    [],
                    { stdio: "inherit", shell: true, env: clonedEnvironment },
                  );
                  shell.on("close", (code) => {
                    if (code === 0) {
                      resolve("");
                    } else {
                      reject();
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

              await new Promise((resolve, reject) => {
                exec(command, (err, stdout, stderr) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve({ stdout, stderr });
                });
              });

              updateSpinner.succeed(
                `Successfully upgraded CLI to version ${versionInfo.latest}. Continuing execution...`,
              );

              // If the package is installed globally with yarn or pnpm, then npx won't recognize it
              // So we need to make sure to run the command directly.
              const executionCommand =
                !installation.isGlobal || installation.packageManager === "npm"
                  ? `npx thirdweb`
                  : `thirdweb`;
              await new Promise((resolve, reject) => {
                const shell = spawn(
                  `${executionCommand} ${process.argv.slice(2).join(" ")}`,
                  [],
                  { stdio: "inherit", shell: true, env: clonedEnvironment },
                );
                shell.on("close", (code) =>
                  code === 0 ? resolve("") : reject(),
                );
              });

              process.exit(0);
            }
          }
        },
      );
    });

  program
    .command("install [projectPath]")
    .description(
      "Install thirdweb into your project. If no path is specified, the current directory will be used.",
    )
    .option("--nightly", "Install the nightly version of packages.")
    .option("--dev", "Install the dev version of packages")
    .option("-d, --debug", "show debug logs")
    .action(async (_path, options) => {
      await install(_path, options);
    });

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
    .option("--extension", "Create a smart contract extension.")
    .option("--cra", "Initialize as a Create React App project.")
    .option("--next", "Initialize as a Next.js project.")
    .option("--vite", "Initialize as a Vite project.")
    .option("--reactNative", "Initialize as a React Native project.")
    .option("--express", "Initialize as a Express project.")
    .option("--node", "Initialize as a Node project.")
    .option(
      "--use-npm",
      "Explicitly tell the CLI to bootstrap the app using npm",
    )
    .option(
      "--use-pnpm",
      "Explicitly tell the CLI to bootstrap the app using pnpm",
    )
    .option("--framework [name]", "The preferred framework.")
    .option("--evm", "Initialize as an Ethereum project.")
    .option(
      "-t, --template [name]",
      "A template to start your project from. You can use an template repository name from the official thirdweb-example org.",
    )
    .option(
      "-c, --contract-name [name]",
      "Name of the new smart contract to create",
    )
    .action(async (type, _path, options) => {
      await twCreate(type, _path, options);
    });

  program
    .command("build")
    .description("Compile contract and detect thirdweb contract extensions")
    .option("--clean", "clear the cache before building")
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .option("-a, --all", "run detection on all contracts")
    .action(async (options) => {
      await detectExtensions(options);
    });

  program
    .command("deploy")
    .description(
      "Securely deploy your contract to any EVM network without having to deal with scripts, private keys, or ABIs",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("--clean", "clear the cache before building")
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .option(
      "--dist-path [distPath]",
      "Path to the dist folder where the HTML based App is",
    )
    .option(
      "-n, --name [name]",
      "Name of the pre-built or published contract (such as nft-drop)",
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
      "Version of the published contract",
    )
    .option("--app", "Deploy a web app to decentralized storage")
    .option("--contract", "Deploy a smart contract to blockchains")
    .option(
      "--dynamic",
      "Deploy a dynamic smart contract made up of extensions to blockchains",
    )
    .option("--zksync", "Deploy on ZKSync")
    .option("-k, --key <key>", "API secret key to authorize usage")
    .action(async (options) => {
      let secretKey = "";
      // If no key is passed in, prompt the user to login. If it is passed in, use it.
      if (!options.key) {
        await loginUser({
          credsConfigPath,
          cliWalletPath,
          tokenPath,
        });
      } else {
        // Don't need to validate anymore? Also, should probably rely on the underlying service to throw that error.
        await validateKey(options.key);
        secretKey = options.key;
      }
      const url = await deploy(options, secretKey);
      if (url && !options.ci) {
        await open(url);
      }
    });

  program
    .command("publish")
    .description(
      "Get a shareable page for your contract with a README, changelog, and version control. Enable one-click deploys to any EVM network",
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
    .option("--clean", "clear the cache before building")
    .option("--dry-run", "dry run (skip actually publishing)")
    .option("-d, --debug", "show debug logs")
    .option("--ci", "Continuous Integration mode")
    .option("-k, --key <key>", "API secret key to authorize usage")
    .action(async (options) => {
      let secretKey = "";
      // If no key is passed in, prompt the user to login. If it is passed in, use it.
      if (!options.key) {
        await loginUser({
          credsConfigPath,
          cliWalletPath,
          tokenPath,
        });
      } else {
        // Don't need to validate anymore? Also, should probably rely on the underlying service to throw that error.
        await validateKey(options.key);
        secretKey = options.key;
      }
      const url = await processProject(options, "publish", secretKey);
      info(
        `Open this link to publish your contracts: ${chalk.blueBright(
          url.toString(),
        )}`,
      );
      if (url && !options.ci) {
        await open(url.toString());
      }
    });

  program
    .command("upload")
    .description("Upload any file or directory to decentralized storage (IPFS)")
    .argument("[upload]", "path to file or directory to upload")
    .option("-k, --key <key>", "API secret key to authorize usage")
    .action(async (_path, options) => {
      let secretKey = "";
      let storage: ThirdwebStorage;
      // If no key is passed in, prompt the user to login. If it is passed in, use it.
      if (!options.key) {
        await loginUser({
          credsConfigPath,
          cliWalletPath,
          tokenPath,
        });
      } else {
        // Don't need to validate anymore? Also, should probably rely on the underlying service to throw that error.
        await validateKey(options.key);
        secretKey = options.key;
      }

      if (secretKey) {
        storage = new ThirdwebStorage({
          secretKey,
        });
      } else {
        storage = new ThirdwebStorage();
      }

      try {
        const uri = await upload(storage, _path);
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
          logger.error(chalk.redBright(err.message ? err.message : err));
        }
      }
    });

  program
    .command("detect")
    .description(
      "Detect the type of project your are running and let you know what it is.",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .action(async (options) => {
      await detectProject(options);
    });

  program
    .command("generate")
    .description(
      "Preload ABIs and generate types for your smart contract to strongly type the thirdweb SDK",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-k, --key <key>", "API secret key to authorize usage")
    .action(async (options) => {
      let secretKey = "";
      // If no key is passed in, prompt the user to login. If it is passed in, use it.
      if (!options.key) {
        await loginUser({
          credsConfigPath,
          cliWalletPath,
          tokenPath,
        });
      } else {
        // Don't need to validate anymore? Also, should probably rely on the underlying service to throw that error.
        await validateKey(options.key);
        secretKey = options.key;
      }
      await generate(options, secretKey);
    });

  program
    .command("login")
    .description(
      "Authorize your device to use the thirdweb CLI by authenticating with your wallet from our dashboard",
    )
    .action(async (options) => {
      await loginUser(
        {
          credsConfigPath,
          cliWalletPath,
          tokenPath,
        },
        options,
        true,
      );
    });

  program
    .command("logout")
    .description("Logout of the thirdweb CLI")
    .action(async () => {
      await logoutUser(credsConfigPath, tokenPath, cliWalletPath);
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
