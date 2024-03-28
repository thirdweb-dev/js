import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class PnpmDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "pnpm";

  public matches(path: string): boolean {
    const files = ["/pnpm-lock.yaml", "/pnpm-workspace.yaml", "/.pnpm"];

    // Check if at least one of these files exists in the current path.
    return files.some((file) => existsSync(path + file));
  }
}
