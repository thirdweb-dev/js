import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";

export default class NextDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "next";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const packageJsonContent = JSON.parse(packageJson.toString());
    const dependencies = packageJsonContent.dependencies;
    const devDependencies = packageJsonContent.devDependencies;

    const additionalFilesToCheck = ["/next.config.js", "/next-config.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["next"] || 
        devDependencies["next"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
