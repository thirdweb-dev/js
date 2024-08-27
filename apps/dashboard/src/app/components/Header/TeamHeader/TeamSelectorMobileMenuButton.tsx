"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronsUpDownIcon } from "lucide-react";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSwitcherProps = {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
};

export function TeamSelectorMobileMenuButton(props: TeamSwitcherProps) {
  const { currentTeam, teamsAndProjects } = props;

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="px-1 w-auto !h-auto py-2 rounded-xl"
          variant="ghost"
          aria-label="Select Project"
        >
          <ChevronsUpDownIcon className="shrink-0 text-muted-foreground hover:text-foreground size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent dialogCloseClassName="hidden" className="p-0">
        <DynamicHeight>
          <TeamSelectionUI
            currentTeam={currentTeam}
            setHoveredTeam={() => {}} // don't care on mobile
            teamsAndProjects={teamsAndProjects}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
