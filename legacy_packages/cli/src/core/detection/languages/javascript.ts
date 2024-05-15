import { LanguageDetector } from "../detector";
import { readdirSync } from "fs";
import { LanguageType } from "../../types/ProjectType";

export default class JavascriptDetector implements LanguageDetector {
  public languageType: LanguageType = "javascript";

  public matches(path: string): boolean {
    // Check if some of these files are written in Go.
    const javascriptFileExtensionRegex = /\.js$/;
    const dirFiles = readdirSync(path);
    return dirFiles.some((file) => file.match(javascriptFileExtensionRegex));
  }
}
