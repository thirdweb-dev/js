import { LanguageDetector } from "../detector";
import { readdirSync } from "fs";
import { LanguageType } from "../../types/ProjectType";

export default class TypescriptDetector implements LanguageDetector {
  public languageType: LanguageType = "typescript";

  public matches(path: string): boolean {
    // Check if some of these files are written in Go.
    const typescriptFileExtensionRegex = /\.ts$/;
    const dirFiles = readdirSync(path);
    return dirFiles.some((file) => file.match(typescriptFileExtensionRegex));
  }
}
