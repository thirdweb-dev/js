import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class GatsbyDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "gatsby";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/gatsby.config.js", "/gatsby-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["gatsby"] ||
        devDependencies["gatsby"] ||
        additionalFilesExist
      ) || false
    );
  }
}
