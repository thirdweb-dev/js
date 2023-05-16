import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";

export default class FoundryDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "foundry";

  public matches(path: string): boolean {
    const additionalFilesToCheck = ["/foundry.toml", "/lib/forge-std/"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return additionalFilesExist || false;
  }
}
