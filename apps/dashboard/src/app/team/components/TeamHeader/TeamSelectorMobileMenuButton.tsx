"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronsUpDownIcon } from "lucide-react";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSelectorMobileMenuButtonProps = {
  currentTeam: Team | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  upgradeTeamLink: string | undefined;
};

export function TeamSelectorMobileMenuButton(
  props: TeamSelectorMobileMenuButtonProps,
) {
  const { currentTeam, teamsAndProjects } = props;

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="!h-auto w-auto rounded-xl px-1 py-2"
          variant="ghost"
          aria-label="Select Project"
        >
          <ChevronsUpDownIcon
            className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
            strokeWidth={1.5}
          />
        </Button>
      </DialogTrigger>

      <DialogContent dialogCloseClassName="hidden" className="p-0">
        <DynamicHeight>
          <TeamSelectionUI
            currentTeam={currentTeam}
            setHoveredTeam={() => {}} // don't care on mobile
            teamsAndProjects={teamsAndProjects}
            upgradeTeamLink={props.upgradeTeamLink}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
