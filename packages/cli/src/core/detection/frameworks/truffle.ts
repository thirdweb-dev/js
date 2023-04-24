import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class TruffleDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "truffle";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/truffle.config.js", "/truffle.js", "/contracts/"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["truffle"] || 
        devDependencies["truffle"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
