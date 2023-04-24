import { FrameworkDetector } from "../detector";
import { readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class CRADetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "cra";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    return (
      (
        dependencies["react-scripts"] || 
        devDependencies["react-scripts"]
      ) ||
      false
    );
  }
}
