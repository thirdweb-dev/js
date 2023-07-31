import { ALWAYS_SUGGESTED } from "../constants/features";
import build from "../core/builder/build";
import detect from "../core/detection/detect";
import { logger, spinner } from "../core/helpers/logger";
import { createContractsPrompt } from "../core/helpers/selector";
import { ContractFeatures, Feature } from "../core/interfaces/ContractFeatures";
import { ContractPayload } from "../core/interfaces/ContractPayload";
import { getPkgManager } from "../create/helpers/get-pkg-manager";
import { detectFeatures, FeatureWithEnabled } from "@thirdweb-dev/sdk";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import ora from "ora";
import path from "path";

export async function detectExtensions(options: any) {
  logger.setSettings({
    minLevel: options.debug ? "debug" : "info",
  });

  let projectPath = process.cwd();
  if (options.path) {
    logger.debug("Overriding project path to " + options.path);

    const resolvedPath = (options.path as string).startsWith("/")
      ? options.path
      : path.resolve(`${projectPath}/${options.path}`);
    projectPath = resolvedPath;
  }

  logger.debug("Processing project at path " + projectPath);

  const projectType = await detect(projectPath, options);

  let compiledResult;
  const compileLoader = spinner("Compiling project...");
  try {
    compiledResult = await build(projectPath, projectType, options);
  } catch (e) {
    compileLoader.fail("Compilation failed");
    logger.error(e);
    process.exit(1);
  }
  compileLoader.succeed("Compilation successful");

  let selectedContracts: ContractPayload[] = [];
  if (compiledResult.contracts.length === 1) {
    selectedContracts = [compiledResult.contracts[0]];
  } else {
    if (options.all) {
      selectedContracts = compiledResult.contracts;
    } else {
      const choices = compiledResult.contracts.map((c) => ({
        name: c.name,
        value: c,
      }));
      const prompt = createContractsPrompt(
        choices,
        "Choose which contracts to run detection on",
      );
      const selection: Record<string, ContractPayload> = await prompt.run();
      selectedContracts = Object.keys(selection).map((key) => selection[key]);
    }
  }

  const contractsWithFeatures: ContractFeatures[] = selectedContracts.map(
    (contract) => {
      const abi: Parameters<typeof detectFeatures>[0] = JSON.parse(
        contract.metadata,
      )["output"]["abi"];
      const features = extractFeatures(detectFeatures(abi));

      const enabledFeatures: Feature[] = features.enabledFeatures.map(
        (feature) => ({
          name: feature.name,
          reference: `https://portal.thirdweb.com/interfaces/${feature.name.toLowerCase()}`,
        }),
      );
      const suggestedFeatures: Feature[] = features.suggestedFeatures.map(
        (feature) => ({
          name: feature.name,
          reference: `https://portal.thirdweb.com/interfaces/${feature.name.toLowerCase()}`,
        }),
      );

      return {
        name: contract.name,
        enabledFeatures,
        suggestedFeatures,
      };
    },
  );

  contractsWithFeatures.map((contractWithFeatures) => {
    logger.info(`\n`);
    if (contractWithFeatures.enabledFeatures.length === 0) {
      ora(
        `No extensions detected on ${chalk.blueBright(
          contractWithFeatures.name,
        )}`,
      ).stopAndPersist({ symbol: "🔎" });
    } else {
      ora(
        `Detected extension on ${chalk.blueBright(contractWithFeatures.name)}`,
      ).stopAndPersist({ symbol: "🔎" });
      contractWithFeatures.enabledFeatures.map((feature) => {
        logger.info(`✔️ ${chalk.green(feature.name)}`);
      });
    }
    logger.info(``);
    ora(`Suggested extensions`).info();
    contractWithFeatures.suggestedFeatures.map((feature) => {
      logger.info(
        `${chalk.dim(chalk.gray(`-`))} ${chalk.gray(
          feature.name,
        )} - ${chalk.dim(chalk.gray(feature.reference))}`,
      );
    });

    let deployCmd = `npx thirdweb@latest deploy`;
    if (existsSync(projectPath + "/package.json")) {
      const packageManager = getPkgManager();
      const useYarn = packageManager === "yarn";
      const pkgJson = JSON.parse(
        readFileSync(projectPath + "/package.json", "utf-8"),
      );
      if (pkgJson?.scripts?.deploy === deployCmd) {
        deployCmd = `${packageManager}${useYarn ? "" : " run"} deploy`;
      }
    }

    logger.info(``);
    ora(
      `Once you're done writing your contracts, you can run the following command to deploy them:`,
    ).info();
    logger.info(``);
    logger.info(`     ${chalk.cyan(deployCmd)}`);
    logger.info(``);
  });
}

function extractFeatures(
  input: ReturnType<typeof detectFeatures>,
  enabledFeatures: FeatureWithEnabled[] = [],
  suggestedFeatures: FeatureWithEnabled[] = [],
  parent = "__ROOT__",
) {
  if (!input) {
    return {
      enabledFeatures,
      suggestedFeatures,
    };
  }
  for (const featureKey in input) {
    const feature = input[featureKey];
    // if feature is enabled, then add it to enabledFeatures
    if (feature.enabled) {
      enabledFeatures.push(feature);
    }
    // otherwise if it is disabled, but it's parent is enabled or suggested, then add it to suggestedFeatures
    else if (
      enabledFeatures.findIndex((f) => f.name === parent) > -1 ||
      ALWAYS_SUGGESTED.includes(feature.name)
    ) {
      suggestedFeatures.push(feature);
    }
    // recurse
    extractFeatures(
      feature.features,
      enabledFeatures,
      suggestedFeatures,
      feature.name,
    );
  }

  return {
    enabledFeatures,
    suggestedFeatures,
  };
}
