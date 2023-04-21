import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class CondaDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "conda";

  public matches(path: string): boolean {
    const files = ["/environment.yml", "/environment.yaml", "/conda-requirements.txt", "/.conda", "/.condarc"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
