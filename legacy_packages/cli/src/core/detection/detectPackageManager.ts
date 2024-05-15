import { info } from "../helpers/logger";
import { PackageManagerType } from "../types/ProjectType";
import { PackageManagerDetector } from "./detector";
import inquirer from "inquirer";
import NPMDetector from "./packageManagers/npm";
import YarnDetector from "./packageManagers/yarn";
import PnpmDetector from "./packageManagers/pnpm";
import PipDetector from "./packageManagers/pip";
import PipEnvDetector from "./packageManagers/pipenv";
import PoetryDetector from "./packageManagers/poetry";
import BrownieDetector from "./packageManagers/brownie";
import FoundryDetector from "./packageManagers/foundry";
import GoModulesDetector from "./packageManagers/goModules";

export default async function detect(
  path: string,
  options: any,
): Promise<PackageManagerType> {
  const packageManagerDetectors: PackageManagerDetector[] = [
    new NPMDetector(),
    new YarnDetector(),
    new PnpmDetector(),
    new PipDetector(),
    new PipEnvDetector(),
    new PoetryDetector(),
    new GoModulesDetector(),
    new BrownieDetector(),
    new FoundryDetector(),
  ];

  const possiblePackageManagers = packageManagerDetectors
    .filter((detector) => {
      return detector.matches(path);
    })
    .map((detector) => detector.packageManagerType);

  if (!possiblePackageManagers.length) {
    return "none";
  }

  if (possiblePackageManagers.length === 1) {
    return possiblePackageManagers[0];
  }

  if (
    possiblePackageManagers.includes("brownie") &&
    possiblePackageManagers.includes("pip")
  ) {
    return "brownie";
  }

  info(
    `Detected multiple possible package managers: ${possiblePackageManagers
      .map((s) => `"${s}"`)
      .join(", ")}`,
  );

  const question =
    "We detected multiple possible package managers, which one do you want to use?";

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
