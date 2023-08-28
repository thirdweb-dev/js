import chalk from "chalk";
import { processProject } from "../common/processor";
import { info, logger } from "../core/helpers/logger";
import generateDashboardUrl from "../helpers/generate-dashboard-url";
import { deployApp } from "./app";

type DeployOptions = {
  name: string;
  contractVersion: string;
  app: boolean;
  path?: string;
  distPath?: string;
};

export async function deploy(options: DeployOptions, secretKey: string) {
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
      const url = await deployApp(options.distPath, options.path, secretKey);
      info(`Here is the link to your app: ${chalk.blueBright(url.toString())}`);
      return url.toString();
    } catch (err) {
      logger.error("Failed to deploy app, No compatible project found", err);
      return Promise.reject(
        "failed to deploy app, no compatible project found",
      );
    }
  }

  const url = await processProject(options, "deploy", secretKey);
  info(
    `Open this link to deploy your contracts: ${chalk.blueBright(
      url.toString(),
    )}`,
  );
  return url.toString();
}
