import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class YarnDetector implements Detector {
  public projectType: ProjectType = "yarn";

  public matches(path: string): boolean {
    return existsSync(path + "/yarn.lock");
  }
}
