"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ChevronsUpDownIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TeamSelectionUI } from "./TeamSelectionUI";

type TeamSelectorMobileMenuButtonProps = {
  currentTeam: Team | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  upgradeTeamLink: string | undefined;
  account: Pick<Account, "email" | "id"> | undefined;
  client: ThirdwebClient;
  isOnProjectPage: boolean;
  createTeam: () => void;
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
          aria-label="Select Project"
          className="!h-auto w-auto rounded-xl px-0.5 py-2"
          size="icon"
          variant="ghost"
        >
          <ChevronsUpDownIcon
            className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
            strokeWidth={1.5}
          />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0" dialogCloseClassName="hidden">
        <DynamicHeight>
          <TeamSelectionUI
            account={props.account}
            client={props.client}
            createTeam={props.createTeam} // don't care on mobile
            currentTeam={currentTeam}
            isOnProjectPage={props.isOnProjectPage}
            setHoveredTeam={() => {}}
            teamsAndProjects={teamsAndProjects}
            upgradeTeamLink={props.upgradeTeamLink}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
