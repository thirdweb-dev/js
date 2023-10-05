import { LanguageDetector } from "../detector";
import { readdirSync } from "fs";
import { LanguageType } from "../../types/ProjectType";

export default class PythonDetector implements LanguageDetector {
  public languageType: LanguageType = "python";

  public matches(path: string): boolean {
    // Check if some of these files are written in Go.
    const pythonFileExtensionRegex = /\.py$/;
    const dirFiles = readdirSync(path);
    return dirFiles.some((file) => file.match(pythonFileExtensionRegex));
  }
}
