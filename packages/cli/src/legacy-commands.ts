import type { Command } from "@commander-js/extra-typings";
import { ensureAuth } from "./auth";
import { logger } from "./utils/logger";
import chalk from "chalk";

export function exposeLegacyCommands(thirdweb: Command) {
  /**
   * Install command [legacy]
   */
  thirdweb
    .command("install [projectPath]")
    .description(
      "Install thirdweb into your project. If no path is specified, the current directory will be used.",
    )
    .option("--nightly", "Install the nightly version of packages.")
    .option("--dev", "Install the dev version of packages")
    .option("-d, --debug", "show debug logs")
    .action(async (path, options) => {
      await (await import("./legacy/install")).install(path, options);
    });

  /**
   * Create Command [legacy]
   */
  thirdweb
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
    .option("--react", "Initialize as a Create React App project.")
    .option("--next", "Initialize as a Next.js project.")
    .option("--vite", "Initialize as a Vite project.")
    .option("--reactNative", "Initialize as a React Native project.")
    .option("--express", "Initialize as a Express project.")
    .option("--node", "Initialize as a Node project.")
    .option("--pwaVite", "Initialize as a PWA project.")
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
      await (
        await import("./legacy/create/command")
      ).twCreate(type || "", path, options);
    });

  /**
   * Build Command [legacy]
   */
  thirdweb
    .command("build")
    .description("Compile contract and detect thirdweb contract extensions")
    .option("--clean", "clear the cache before building")
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .option("-a, --all", "run detection on all contracts")
    .action(async (options) => {
      await (
        await import("./legacy/common/feature-detector")
      ).detectExtensions(options);
    });

  /**
   * Deploy Command [legacy]
   * @auth
   */

  thirdweb
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
      const secretKey = await ensureAuth(options.key);
      // @ts-expect-error - TODO: fix this
      await (await import("./legacy/deploy")).deploy(options, secretKey);
    });

  /**
   * Publish Command [legacy]
   * @auth
   */
  thirdweb
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
      const secretKey = await ensureAuth(options.key);
      const url = await (
        await import("./legacy/common/processor")
      ).processProject(options, "publish", secretKey);

      // TODO move this into the command itself
      logger.info(
        `Open this link to publish your contracts: ${chalk.blueBright(
          url.toString(),
        )}`,
      );
      if (url && !options.ci) {
        open(url.toString());
      }
      // end TODO
    });

  /**
   * Detect Command [legacy]
   */
  thirdweb
    .command("detect")
    .description(
      "Detect the type of project your are running and let you know what it is.",
    )
    .option("-p, --path <project-path>", "path to project", ".")
    .option("-d, --debug", "show debug logs")
    .action(async (options) => {
      await (
        await import("./legacy/common/project-detector")
      ).detectProject(options);
    });
}
