import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class NPMDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "npm";

  public matches(path: string): boolean {
    return existsSync(path + "/package-lock.json");
  }
}
