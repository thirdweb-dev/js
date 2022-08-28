import { info, logger, warn } from "../helpers/logger";
import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import FoundryDetector from "./foundry";
import HardhatDetector from "./hardhat";
import TruffleDetector from "./truffle";
import inquirer from "inquirer";

const { Confirm } = require("enquirer");

export default async function detect(
  path: string,
  options: any,
): Promise<ProjectType> {
  const detectors: Detector[] = [
    new HardhatDetector(),
    new FoundryDetector(),
    new TruffleDetector(),
    // new BrownieDetector(), TODO brownie does not support outputing metadata yet
  ];

  const possibleProjectTypes = detectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.projectType);

  //if there is no project returned at all then just return unknown}
  if (!possibleProjectTypes.length) {
    warn("Failed to find a supported project configuration file in current directory " + path);
    const prompt = new Confirm({
      name: "continue",
      message: "Do you want to continue and compile this project with solc instead?",
    });
    const shouldCompile = await prompt.run();
    if (!shouldCompile) {
      logger.warn("Aborted contract compilation");
      process.exit(1);
    }
    return "unknown";
  }
  //if there is only one possible option just return it
  if (possibleProjectTypes.length === 1) {
    info(`Detected project type: ${possibleProjectTypes[0]}`);
    return possibleProjectTypes[0];
  }

  info(
    `Detected multiple possible build tools: ${possibleProjectTypes
      .map((s) => `"${s}"`)
      .join(", ")}`,
  );

  const question = "How would you like to compile your contracts";

  if (options.ci) {
    return possibleProjectTypes[0];
  } else {
    const answer = await inquirer.prompt({
      type: "list",
      choices: possibleProjectTypes,
      name: question,
    });
    return answer[question];
  }
}
