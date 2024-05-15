import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import fs from "fs";

export default class CRADetector implements Detector {
  public projectType: ProjectType = "cra";

  public matches(path: string): boolean {
    const packageJson = JSON.parse(
      fs.readFileSync(path + "/package.json", "utf8"),
    );

    return !!packageJson.dependencies?.["react-scripts"];
  }
}
