import { processProject } from "../common/processor";
import { info, logger } from "../core/helpers/logger";
import generateDashboardUrl from "../helpers/generate-dashboard-url";
import { deployApp } from "./app";
import chalk from "chalk";

type DeployOptions = {
  name: string;
  contractVersion: string;
  app: boolean;
  dist?: string;
  path?: string;
};

export async function deploy(options: DeployOptions) {
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

    info(`Open this link to deploy your contract: ${chalk.blueBright(url)}`);
    return url.toString();
  }

  if (options.app) {
    try {
<<<<<<< HEAD
      let url = await deployApp(options.dist, options.path);
=======
      let url = await deployApp();
>>>>>>> main
      info(`Here is the link to your app: ${chalk.blueBright(url.toString())}`);
      return url.toString();
    } catch (err) {
      logger.error("Failed to deploy app, No compatible project found", err);
    }
    return;
  }

  const url = await processProject(options, "deploy");
  info(
    `Open this link to deploy your contracts: ${chalk.blueBright(
      url.toString(),
    )}`,
  );
  return url.toString();
}
