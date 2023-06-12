import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactNativeCLIDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "react-native-cli";

  public matches(path: string): boolean {
    const packageJsonPath = path + "/package.json";

    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = readFileSync(packageJsonPath);
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck: string[] = [];
    const additionalFilesExist = additionalFilesToCheck.some((file) =>
      existsSync(path + file),
    );

    return (
      !!dependencies["react-native"] ||
      !!devDependencies["react-native"] ||
      additionalFilesExist ||
      false
    );
  }
}
