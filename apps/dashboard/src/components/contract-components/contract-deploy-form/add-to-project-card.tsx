"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlertIcon, ExternalLinkIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { Fieldset } from "./common";

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

type TeamAndProjectSelectorProps = {
  teamsAndProjects: MinimalTeamsAndProjects;
  selection: TeamAndProjectSelection;
  enabled: boolean;
  onSelectionChange: (selection: TeamAndProjectSelection) => void;
  client: ThirdwebClient;
  onSetEnabled: (enabled: boolean) => void;
};

export function AddToProjectCardUI(props: TeamAndProjectSelectorProps) {
  const selectedTeam = props.teamsAndProjects.find(
    (t) => t.team.id === props.selection.team?.id,
  );

  const isProjectSelected = props.selection.project && props.enabled;

  return (
    <Fieldset
      legend="Add To Project"
      description="Save the deployed contract in a project's contract list on thirdweb dashboard"
      headerClassName="pr-14"
      headerChildren={
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <Checkbox
            className="size-5"
            checked={props.enabled}
            onCheckedChange={(checked) => {
              props.onSetEnabled(!!checked);
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Team & Project selectors */}
        {props.enabled && (
          <AddToProjectSelector
            selection={props.selection}
            onSelectionChange={props.onSelectionChange}
            teamsAndProjects={props.teamsAndProjects}
            client={props.client}
          />
        )}

        {/* No projects alert */}
        {selectedTeam?.projects.length === 0 && (
          <Alert variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle> Selected team has no projects </AlertTitle>
            <AlertDescription>
              <UnderlineLink
                href={`/team/${selectedTeam.team.slug}`}
                className="inline-flex items-center gap-2"
                target="_blank"
              >
                Create Project <ExternalLinkIcon className="size-3.5" />
              </UnderlineLink>
            </AlertDescription>
          </Alert>
        )}

        {/* No project selected alert */}
        {!isProjectSelected && (
          <Alert variant="warning">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>No Project Selected</AlertTitle>
            <AlertDescription>
              Deployed contract will not be saved in thirdweb dashboard
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Fieldset>
  );
}

function SlashSeparator() {
  return <div className="mx-2 h-5 w-[2px] rotate-[25deg] bg-foreground/20" />;
}

export function AddToProjectSelector(props: {
  selection: TeamAndProjectSelection;
  onSelectionChange: (selection: TeamAndProjectSelection) => void;
  teamsAndProjects: MinimalTeamsAndProjects;
  client: ThirdwebClient;
}) {
  const selectedTeam = props.teamsAndProjects.find(
    (t) => t.team.id === props.selection.team?.id,
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-2">
      {/* Team */}
      <div>
        <Label htmlFor="team-select" className="mb-2 inline-block">
          Team
        </Label>
        <Select
          value={props.selection.team?.id}
          onValueChange={(v) => {
            const teamAndProjects = props.teamsAndProjects.find(
              (t) => t.team.id === v,
            );

            if (teamAndProjects) {
              props.onSelectionChange({
                team: teamAndProjects.team,
                project: teamAndProjects.projects?.[0],
              });
            }
          }}
        >
          <SelectTrigger id="team-select" className="min-w-[200px]">
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {props.teamsAndProjects.map(({ team }) => (
              <SelectItem key={team.id} value={team.id} className="py-2.5">
                <div className="flex items-center gap-2">
                  <GradientAvatar
                    src={team.image || ""}
                    className="size-5"
                    id={team.id}
                    client={props.client}
                  />

                  <span>{team.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Slash */}
      <div className="hidden flex-none self-end pb-3 lg:block">
        <SlashSeparator />
      </div>

      {/* Project */}
      <div>
        <Label htmlFor="project-select" className="mb-2 inline-block">
          Project
        </Label>
        <Select
          value={props.selection.project?.id}
          onValueChange={(v) => {
            const project = selectedTeam?.projects?.find((p) => p.id === v);
            if (project) {
              props.onSelectionChange({
                ...props.selection,
                project: project,
              });
            }
          }}
        >
          <SelectTrigger id="project-select" className="min-w-[200px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {/* If no projects  */}
            {selectedTeam?.projects.length === 0 && (
              <div className="flex items-center justify-start px-3 py-3 text-destructive-text text-sm">
                No projects
              </div>
            )}

            {selectedTeam?.projects.map((project) => (
              <SelectItem
                key={project.id}
                value={project.id}
                className="py-2.5"
              >
                <div className="flex items-center gap-2">
                  <ProjectAvatar
                    src={project.image || ""}
                    className="size-5"
                    client={props.client}
                  />
                  <span>{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
