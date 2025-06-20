"use client";

import { CircleAlertIcon, ExternalLinkIcon } from "lucide-react";
import { useId } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
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
import { UnderlineLink } from "@/components/ui/UnderlineLink";
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
      description="Save the deployed contract in a project's contract list on thirdweb dashboard"
      headerChildren={
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <Checkbox
            checked={props.enabled}
            className="size-5"
            onCheckedChange={(checked) => {
              props.onSetEnabled(!!checked);
            }}
          />
        </div>
      }
      headerClassName="pr-14"
      legend="Add To Project"
    >
      <div className="flex flex-col gap-5">
        {/* Team & Project selectors */}
        {props.enabled && (
          <AddToProjectSelector
            client={props.client}
            onSelectionChange={props.onSelectionChange}
            selection={props.selection}
            teamsAndProjects={props.teamsAndProjects}
          />
        )}

        {/* No projects alert */}
        {selectedTeam?.projects.length === 0 && (
          <Alert variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle> Selected team has no projects </AlertTitle>
            <AlertDescription>
              <UnderlineLink
                className="inline-flex items-center gap-2"
                href={`/team/${selectedTeam.team.slug}`}
                rel="noopener noreferrer"
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

  const teamSelectId = useId();
  const projectSelectId = useId();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-2">
      {/* Team */}
      <div>
        <Label className="mb-2 inline-block" htmlFor={teamSelectId}>
          Team
        </Label>
        <Select
          onValueChange={(v) => {
            const teamAndProjects = props.teamsAndProjects.find(
              (t) => t.team.id === v,
            );

            if (teamAndProjects) {
              props.onSelectionChange({
                project: teamAndProjects.projects?.[0],
                team: teamAndProjects.team,
              });
            }
          }}
          value={props.selection.team?.id}
        >
          <SelectTrigger className="min-w-[200px]" id={teamSelectId}>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {props.teamsAndProjects.map(({ team }) => (
              <SelectItem className="py-2.5" key={team.id} value={team.id}>
                <div className="flex items-center gap-2">
                  <GradientAvatar
                    className="size-5"
                    client={props.client}
                    id={team.id}
                    src={team.image || ""}
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
        <Label className="mb-2 inline-block" htmlFor={projectSelectId}>
          Project
        </Label>
        <Select
          onValueChange={(v) => {
            const project = selectedTeam?.projects?.find((p) => p.id === v);
            if (project) {
              props.onSelectionChange({
                ...props.selection,
                project: project,
              });
            }
          }}
          value={props.selection.project?.id}
        >
          <SelectTrigger className="min-w-[200px]" id={projectSelectId}>
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
                className="py-2.5"
                key={project.id}
                value={project.id}
              >
                <div className="flex items-center gap-2">
                  <ProjectAvatar
                    className="size-5"
                    client={props.client}
                    src={project.image || ""}
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
