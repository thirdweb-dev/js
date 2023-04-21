import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";

export default class CRADetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "remix";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const packageJsonContent = JSON.parse(packageJson.toString());
    const dependencies = packageJsonContent.dependencies || {};
    const devDependencies = packageJsonContent.devDependencies || {};

    const additionalFilesToCheck = ["/remix.config.js", "/remix-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    const remixDependencies = Object
      .keys(dependencies)
      .concat(Object.keys(devDependencies))
      .filter(dep => dep.startsWith('@remix-run/'));

    return (
      (
        remixDependencies.length > 0 ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
