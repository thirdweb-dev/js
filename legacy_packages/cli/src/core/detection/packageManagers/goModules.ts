import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class GoModulesDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "go-modules";

  public matches(path: string): boolean {
    return existsSync(path + "/go.mod");
  }
}
