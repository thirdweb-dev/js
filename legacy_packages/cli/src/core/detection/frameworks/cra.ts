import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class CRADetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "cra";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);
    const craDependencyExists =
      !!dependencies["react-scripts"] ||
      !!devDependencies["react-scripts"] ||
      false;

    return craDependencyExists;
  }
}
