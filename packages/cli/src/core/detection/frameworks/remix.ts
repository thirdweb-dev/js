import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class CRADetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "remix";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/remix.config.js", "/remix-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    const remixDependencies = Object.keys(dependencies)
      .concat(Object.keys(devDependencies))
      .filter((dep) => dep.startsWith("@remix-run/"));

    return remixDependencies.length > 0 || additionalFilesExist || false;
  }
}
