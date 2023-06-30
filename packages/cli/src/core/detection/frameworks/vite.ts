import { existsSync, readFileSync } from "fs";
import { parsePackageJson } from "../../../lib/utils";
import { FrameworkType } from "../../types/ProjectType";
import { FrameworkDetector } from "../detector";

export default class ViteDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "vite";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);
    const viteDependencyExists =
      !!dependencies["vite"] || !!devDependencies["vite"] || false;

    return viteDependencyExists;
  }
}
