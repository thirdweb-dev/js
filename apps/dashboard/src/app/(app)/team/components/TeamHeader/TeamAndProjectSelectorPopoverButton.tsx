"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Account } from "@/hooks/useApi";
import { ProjectSelectorUI } from "./ProjectSelectorUI";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSwitcherProps = {
  currentTeam: Team | undefined;
  currentProject: Project | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  focus: "project-selection" | "team-selection";
  createProject: (team: Team) => void;
  createTeam: () => void;
  account: Pick<Account, "email" | "id"> | undefined;
  client: ThirdwebClient;
};

export function TeamAndProjectSelectorPopoverButton(props: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { currentTeam, teamsAndProjects } = props;
  const [hoveredTeam, setHoveredTeam] = useState<Team>();
  const projectsToShowOfTeam =
    hoveredTeam || currentTeam || teamsAndProjects[0]?.team;

  // if we can't find a single team associated with this user - something is really wrong
  if (!projectsToShowOfTeam) {
    return null;
  }

  const teamProjects = teamsAndProjects.find(
    (x) => x.team.slug === projectsToShowOfTeam.slug,
  )?.projects;

  // @TODO: HACK hide Engine projects from the list.
  const projectsToShow = teamProjects?.filter(
    (project) => !project.name.startsWith("Cloud-hosted Engine ("),
  );

  return (
    <Popover
      onOpenChange={(_open) => {
        setOpen(_open);
        if (!_open) {
          setHoveredTeam(undefined);
        }
      }}
      open={open}
    >
      {/* Trigger */}
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-label={`Select a ${props.focus === "project-selection" ? "project" : "team"}`}
          className="!h-auto w-auto rounded-xl px-1 py-2"
          // biome-ignore lint/a11y/useSemanticElements: EXPECTED
          role="combobox"
          size="icon"
          variant="ghost"
        >
          <ChevronsUpDownIcon
            className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
            strokeWidth={1.5}
          />
        </Button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent
        align={props.focus === "project-selection" ? "center" : "start"}
        className="w-auto rounded-xl p-0 shadow-xl"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setOpen(false);
          }
        }}
        sideOffset={5}
      >
        <DynamicHeight>
          <div className="no-scrollbar flex [&>div]:min-w-[280px]">
            {/* Left */}
            <TeamSelectionUI
              account={props.account}
              client={props.client}
              createTeam={() => {
                setOpen(false);
                props.createTeam();
              }}
              currentTeam={currentTeam}
              isOnProjectPage={!!props.currentProject}
              setHoveredTeam={setHoveredTeam}
              teamsAndProjects={teamsAndProjects}
              upgradeTeamLink={
                currentTeam
                  ? `/team/${currentTeam.slug}/~/settings/billing`
                  : undefined
              }
            />

            {/* Right */}
            {projectsToShow && (
              <ProjectSelectorUI
                client={props.client}
                createProject={() => {
                  setOpen(false);
                  props.createProject(projectsToShowOfTeam);
                }}
                currentProject={props.currentProject}
                projects={projectsToShow}
                team={projectsToShowOfTeam}
              />
            )}
          </div>
        </DynamicHeight>
      </PopoverContent>
    </Popover>
  );
}
