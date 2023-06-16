import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType, PackageManagerType } from "../../types/ProjectType";
import { getDependenciesForPython } from "../../../lib/utils";

export default class FlaskDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "flask";

  public matches(path: string, packageManager: PackageManagerType): boolean {
    const { dependencies, devDependencies } = getDependenciesForPython(
      path,
      packageManager,
    );

    const additionalFilesToCheck: string[] = [];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      !!dependencies.find(dep => dep.includes("Flask")) ||
      !!devDependencies.find(dep => dep.includes("Flask")) ||
      additionalFilesExist ||
      false
    );
  }
}
