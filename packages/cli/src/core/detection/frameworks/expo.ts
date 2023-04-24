import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ExpoDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "expo";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/app.json", "/app.config.js", "/assets"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["expo"] || 
        devDependencies["expo"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
