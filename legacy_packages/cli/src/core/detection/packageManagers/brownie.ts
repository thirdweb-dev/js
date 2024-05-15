import { PackageManagerDetector } from "../detector";
import { existsSync } from "fs";
import { PackageManagerType } from "../../types/ProjectType";

export default class BrownieDetector implements PackageManagerDetector {
  public packageManagerType: PackageManagerType = "brownie";

  public matches(path: string): boolean {
    const additionalFilesToCheck = [
      "/brownie-config.yaml",
      "/brownie-config.json",
    ];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    // Check that all of these exist.
    const additionalDirectoriesToCheck = ["/build", "/contracts", "/reports"];
    const additionalDirectoriesExist = additionalDirectoriesToCheck.every(
      (dir) => {
        return existsSync(path + dir);
      },
    );

    return additionalFilesExist || additionalDirectoriesExist || false;
  }
}
