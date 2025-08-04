import type { Project } from "@/api/project/projects";
import type { Team } from "@/api/team/get-team";

export type MinimalTeam = Pick<Team, "id" | "name" | "image" | "slug">;
export type MinimalProject = Pick<Project, "id" | "name" | "image" | "slug">;

export type TeamAndProjectSelection = {
  team: MinimalTeam | undefined;
  project: MinimalProject | undefined;
};

export type MinimalTeamsAndProjects = Array<{
  team: MinimalTeam;
  projects: MinimalProject[];
}>;
