import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType, PackageManagerType } from "../../types/ProjectType";
import { getDependenciesForPython } from "../../../lib/utils";

export default class DjangoDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "django";

  public matches(path: string, packageManager: PackageManagerType): boolean {
    const { dependencies, devDependencies } = getDependenciesForPython(
      path,
      packageManager,
    );

    const additionalFilesToCheck = ["/manage.py"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      !!dependencies.find((dep) => dep.includes("Django")) ||
      !!devDependencies.find((dep) => dep.includes("Django")) ||
      additionalFilesExist ||
      false
    );
  }
}
