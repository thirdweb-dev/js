import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class ReactNativeCLIDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "react-native-cli";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/android", "/ios"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["react-native"] || 
        devDependencies["react-native"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
