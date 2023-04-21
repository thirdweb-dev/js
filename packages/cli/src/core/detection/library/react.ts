import { LibraryDetector } from "../detector";
import { readFileSync } from "fs";
import { LibraryType } from "../../types/ProjectType";

export default class ReactDetector implements LibraryDetector {
  public libraryType: LibraryType = "react";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const packageJsonContent = JSON.parse(packageJson.toString());
    const dependencies = packageJsonContent.dependencies;

    return dependencies && dependencies.react;
  }
}
