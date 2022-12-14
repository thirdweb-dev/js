import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class TruffleDetector implements Detector {
  public projectType: ProjectType = "truffle" as const;

  public matches(path: string): boolean {
    return existsSync(path + "/truffle-config.js");
  }
}
