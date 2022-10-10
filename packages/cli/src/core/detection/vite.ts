import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import { existsSync } from "fs";

export default class ViteDetector implements Detector {
  public projectType: ProjectType = "vite";

  public matches(path: string): boolean {
    return (
      existsSync(path + "/vite.config.js") ||
      existsSync(path + "/vite.config.ts")
    );
  }
}
