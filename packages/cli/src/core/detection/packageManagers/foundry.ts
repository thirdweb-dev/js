import { PackageManagerType } from "../../types/ProjectType";
import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";

export default class FoundryDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "foundry";

  public matches(path: string): boolean {
    const additionalFilesToCheck = ["/foundry.toml", "/lib/forge-std/"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return additionalFilesExist || false;
  }
}
