import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class VueDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "vue";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/vue.config.js"];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      !!dependencies["vue"] ||
      !!devDependencies["vue"] ||
      additionalFilesExist ||
      false
    );
  }
}
