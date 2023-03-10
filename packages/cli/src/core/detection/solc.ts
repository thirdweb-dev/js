import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import fs from "fs";

export default class SolcDetector implements Detector {
  public projectType: ProjectType = "solc";

  public matches(path: string): boolean {
    const packageJson = JSON.parse(
      fs.readFileSync(path + "/package.json", "utf8"),
    );

    return (
      !!packageJson.dependencies?.["solc"] ||
      !!packageJson.devDependencies?.["solc"]
    );
  }
}
