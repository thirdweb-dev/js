import { LibraryDetector } from "../detector";
import { readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactNativeDetector implements LibraryDetector {
  public libraryType: LibraryType = "react-native";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    return (
      dependencies["react-native"] ||
      devDependencies["react-native"] ||
      false
    )
  }
}
