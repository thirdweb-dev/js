import { info } from "../helpers/logger";
import { PackageManagerType } from "../types/ProjectType";
import { PackageManagerDetector } from "./detector";
import inquirer from "inquirer";
import NPMDetector from "./packageManagers/npm";
import YarnDetector from "./packageManagers/yarn";
import PnpmDetector from "./packageManagers/pnpm";
import CondaDetector from "./packageManagers/conda";
import PipDetector from "./packageManagers/pip";
import PipEnvDetector from "./packageManagers/pipenv";
import PoetryDetector from "./packageManagers/poetry";

export default async function detect(
  path: string,
  options: any,
): Promise<PackageManagerType> {
  const packageManagerDetectors: PackageManagerDetector[] = [
    new NPMDetector(),
    new YarnDetector(),
    new PnpmDetector(),
    new CondaDetector(),
    new PipDetector(),
    new PipEnvDetector(),
    new PoetryDetector(),
  ];

  const possiblePackageManagers = packageManagerDetectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.packageManagerType);

  if (!possiblePackageManagers.length) {
    return "none";
  }

  if (possiblePackageManagers.length === 1) {
    return possiblePackageManagers[0];
  }

  info(`Detected multiple possible package managers: ${possiblePackageManagers.map((s) => `"${s}"`).join(", ")}`);

  const question = "We detected multiple possible package managers. Which one do you want to use?";

  if (options.ci) {
    return possiblePackageManagers[0];
  } else {
    const answer = await inquirer.prompt({
      type: "list",
      choices: possiblePackageManagers,
      name: question,
    });
    return answer[question];
  }
}