import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class NextDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "next";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/next.config.js", "/next-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    const nextDependencyExists =
      !!dependencies["next"] ||
      !!devDependencies["next"] ||
      additionalFilesExist ||
      false;

    return nextDependencyExists;
  }
}
