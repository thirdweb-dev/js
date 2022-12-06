import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class NPMDetector implements Detector {
  public projectType: ProjectType = "npm";

  public matches(path: string): boolean {
    return existsSync(path + "/package-lock.json");
  }
}
