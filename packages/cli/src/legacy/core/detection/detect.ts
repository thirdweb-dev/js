import { ERROR_MESSAGES } from "../../../../constants/constants";
import { info, logger, warn } from "../helpers/logger";
import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import FoundryDetector from "./foundry";
import HardhatDetector from "./hardhat";
import TruffleDetector from "./truffle";
import { existsSync, readdirSync } from "fs";
import inquirer from "inquirer";
import { parse } from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require("enquirer");

export default async function detect(
  path: string,
  options: any,
): Promise<ProjectType> {
  const detectors: Detector[] = [
    new HardhatDetector(),
    new FoundryDetector(),
    new TruffleDetector(),
    // new BrownieDetector(), TODO brownie does not support outputting metadata yet
  ];

  const possibleProjectTypes = detectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.projectType);

  //if there is no project returned at all then just return unknown}
  if (!possibleProjectTypes.length) {
    const canCompile = hasContracts(path);

    if (canCompile) {
      warn(`${ERROR_MESSAGES.noConfiguration} ${path}`);
      const prompt = new Confirm({
        name: "continue",
        message:
          "Do you want to continue and compile this project with solc instead?",
        initial: true,
      });
      const shouldCompile = await prompt.run();
      if (!shouldCompile) {
        logger.warn("Aborted contract compilation");
        process.exit(1);
      }
      return "solc";
    } else {
      return "none";
    }
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

// Check if a directory has any .sol files or a /contracts folder with .sol files
function hasContracts(path: any) {
  return (
    ["", "/contracts"].filter((p) => {
      const dirPath = path + p;

      if (!existsSync(dirPath)) {
        return false;
      }

      const files = readdirSync(dirPath);
      const contracts = files.filter((filePath) => {
        const { ext } = parse(filePath);
        return ext === ".sol";
      });
      return contracts.length > 0;
    }).length > 0
  );
}
