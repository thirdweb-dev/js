import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class HardhatDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "hardhat";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/hardhat.config.js"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    const hardhatDependencyExists =
      !!dependencies["hardhat"] ||
      !!devDependencies["hardhat"] ||
      additionalFilesExist ||
      false;

    return hardhatDependencyExists;
  }
}
