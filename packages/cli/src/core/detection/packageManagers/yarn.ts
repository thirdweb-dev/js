import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class YarnDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "yarn";

  public matches(path: string): boolean {
    return existsSync(path + "/yarn.lock");
  }
}
