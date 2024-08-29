"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { ProjectSelectorUI } from "./ProjectSelectorUI";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSwitcherProps = {
  currentTeam: Team;
  currentProject: Project | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  focus: "project-selection" | "team-selection";
};

export function TeamAndProjectSelectorPopoverButton(props: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { currentTeam, teamsAndProjects } = props;
  const [hoveredTeam, setHoveredTeam] = useState<Team>();
  const projectsToShowOfTeam = hoveredTeam || currentTeam;

  const projectsToShow = teamsAndProjects.find(
    (x) => x.team.slug === projectsToShowOfTeam.slug,
  )?.projects;

  return (
    <Popover
      open={open}
      onOpenChange={(_open) => {
        setOpen(_open);
        if (!_open) {
          setHoveredTeam(undefined);
        }
      }}
    >
      {/* Trigger */}
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="px-1 w-auto !h-auto py-2 rounded-xl"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label={`Select a ${props.focus === "project-selection" ? "project" : "team"}`}
        >
          <ChevronsUpDownIcon className="shrink-0 text-muted-foreground hover:text-foreground size-5" />
        </Button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent
        sideOffset={5}
        className="p-0 w-auto rounded-xl "
        align={props.focus === "project-selection" ? "center" : "start"}
      >
        <DynamicHeight>
          <div className="flex [&>div]:w-[280px] no-scrollbar">
            {/* Left */}
            <TeamSelectionUI
              currentTeam={currentTeam}
              setHoveredTeam={setHoveredTeam}
              teamsAndProjects={teamsAndProjects}
            />

            {/* Right */}
            {projectsToShow && (
              <ProjectSelectorUI
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
