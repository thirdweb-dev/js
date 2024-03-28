import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class FoundryDetector implements Detector {
  public projectType: ProjectType = "foundry";

  public matches(path: string): boolean {
    return existsSync(path + "/foundry.toml");
  }
}
