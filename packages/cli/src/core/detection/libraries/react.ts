import { LibraryDetector } from "../detector";
import { readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactDetector implements LibraryDetector {
  public libraryType: LibraryType = "react";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    return (
      dependencies["react"] ||
      devDependencies["react"] ||
      false
    )
  }
}
