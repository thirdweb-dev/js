import { LibraryDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactDetector implements LibraryDetector {
  public libraryType: LibraryType = "react";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);
    const reactDependencyExists =
      dependencies["react"] || devDependencies["react"] || false;

    return reactDependencyExists;
  }
}
