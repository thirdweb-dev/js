import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";

export default class CRADetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "cra";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const packageJsonContent = JSON.parse(packageJson.toString());
    const dependencies = packageJsonContent.dependencies || {};
    const devDependencies = packageJsonContent.devDependencies || {};

    const additionalFilesToCheck = ["/public", "/src"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["react-scripts"] || 
        devDependencies["react-scripts"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
