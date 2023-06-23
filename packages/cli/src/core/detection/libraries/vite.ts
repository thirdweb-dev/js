import { LibraryDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ViteDetector implements LibraryDetector {
  public libraryType: LibraryType = "vite";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);
    const viteDependencyExists =
      dependencies["vite"] || devDependencies["vite"] || false;

    return viteDependencyExists;
  }
}
