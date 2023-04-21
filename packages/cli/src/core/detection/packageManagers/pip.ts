import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class PipDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "pip";

  public matches(path: string): boolean {
    const files = ["/requirements.txt"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
