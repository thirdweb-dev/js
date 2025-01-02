"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ChevronsUpDownIcon } from "lucide-react";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSelectorMobileMenuButtonProps = {
  currentTeam: Team | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  upgradeTeamLink: string | undefined;
  account: Pick<Account, "email" | "id"> | undefined;
};

const client = getThirdwebClient();

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
          className="!h-auto w-auto rounded-xl px-0.5 py-2"
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
            account={props.account}
            client={client}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
