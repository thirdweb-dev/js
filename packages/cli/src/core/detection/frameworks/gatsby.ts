import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class GatsbyDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "gatsby";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/gatsby.config.js", "/gatsby-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    const gatsbyDependencyExists =
      !!dependencies["gatsby"] ||
      !!devDependencies["gatsby"] ||
      additionalFilesExist ||
      false;

    return gatsbyDependencyExists;
  }
}
