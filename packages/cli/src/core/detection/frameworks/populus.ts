import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType, PackageManagerType } from "../../types/ProjectType";
import { getDependenciesForPython } from "../../../lib/utils";

export default class PopulusDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "populus";

  public matches(path: string, packageManager: PackageManagerType): boolean {
    const { dependencies, devDependencies } = getDependenciesForPython(
      path,
      packageManager,
    );

    const additionalFilesToCheck = ["/populus.json", "/populus.yaml"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      !!dependencies.find((dep) => dep === "populus") ||
      !!devDependencies.find((dep) => dep === "populus") ||
      additionalFilesExist ||
      false
    );
  }
}
