import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType, PackageManagerType } from "../../types/ProjectType";
import { getDependenciesForPython } from "../../../lib/utils";

export default class BrownieDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "brownie";

  public matches(path: string, packageManager: PackageManagerType): boolean {
    const { dependencies, devDependencies } = getDependenciesForPython(
      path,
      packageManager,
    );

    const additionalFilesToCheck = [
      "/brownie-config.yaml",
      "/brownie-config.json",
    ];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      dependencies.includes("brownie") ||
      devDependencies.includes("brownie") ||
      additionalFilesExist ||
      false
    );
  }
}
