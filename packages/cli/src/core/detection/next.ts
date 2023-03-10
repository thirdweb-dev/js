import { ProjectType } from "../types/ProjectType";
import { Detector } from "./detector";
import fs from "fs";

export default class NextDetector implements Detector {
  public projectType: ProjectType = "next";

  public matches(path: string): boolean {
    const packageJson = JSON.parse(
      fs.readFileSync(path + "/package.json", "utf8"),
    );

    return !!packageJson.dependencies?.next;
  }
}
