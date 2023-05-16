import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class PoetryDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "poetry";

  public matches(path: string): boolean {
    const files = ["/pyproject.toml", "/poetry.lock"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
