import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { parsePackageJson } from "../../../lib/utils";

export default class FastifyDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "fastify";

  public matches(path: string): boolean {
    const packageJson = readFileSync(path + "/package.json");
    const { dependencies, devDependencies } = parsePackageJson(packageJson);

    const additionalFilesToCheck = ["/server.js", "/app.js", "/server.ts", "/app.ts"];
    const additionalFilesExist = additionalFilesToCheck.some((file) => existsSync(path + file));

    return (
      (
        dependencies["fastify"] || 
        devDependencies["fastify"] ||
        additionalFilesExist
      ) ||
      false
    );
  }
}
