import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class GoModulesDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "go-modules";

  public matches(path: string): boolean {
    const files = ["/go.mod"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
