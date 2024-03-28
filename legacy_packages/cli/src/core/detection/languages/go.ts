import { LanguageDetector } from "../detector";
import { readdirSync } from "fs";
import { LanguageType } from "../../types/ProjectType";

export default class GoDetector implements LanguageDetector {
  public languageType: LanguageType = "go";

  public matches(path: string): boolean {
    // Check if some of these files are written in Go.
    const goFileExtensionRegex = /\.go$/;
    const dirFiles = readdirSync(path);
    return dirFiles.some((file) => file.match(goFileExtensionRegex));
  }
}
