import { ProjectType } from "../types/ProjectType";

export interface Detector {
  projectType: ProjectType;

  matches(path: string): boolean;
}
