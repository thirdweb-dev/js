import { LibraryDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactNativeDetector implements LibraryDetector {
  public libraryType: LibraryType = "react-native";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);
    const reactNativeDependencyExists =
      dependencies["react-native"] || devDependencies["react-native"] || false;

    return reactNativeDependencyExists;
  }
}
