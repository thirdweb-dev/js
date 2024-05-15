import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class PipEnvDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "pipenv";

  public matches(path: string): boolean {
    const files = ["/Pipfile", "/Pipfile.lock"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
