import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class PipDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "pip";

  public matches(path: string): boolean {
    return existsSync(path + "/requirements.txt");
  }
}
