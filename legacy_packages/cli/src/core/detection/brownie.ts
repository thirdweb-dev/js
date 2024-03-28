import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class BrownieDetector implements Detector {
  public projectType: ProjectType = "brownie";

  public matches(path: string): boolean {
    return existsSync(path + "/brownie-config.yaml");
  }
}
