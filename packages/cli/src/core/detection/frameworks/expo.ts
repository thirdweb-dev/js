import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ExpoDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "expo";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/app.json", "/app.config.js"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    const expoDependencyExists =
      !!dependencies["expo"] ||
      !!devDependencies["expo"] ||
      additionalFilesExist ||
      false;

    return expoDependencyExists;
  }
}
