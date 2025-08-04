"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProjectSelectorUI } from "./ProjectSelectorUI";

type ProjectSelectorMobileMenuButtonProps = {
  currentProject: Project;
  projects: Project[];
  team: Team;
  createProject: (team: Team) => void;
  client: ThirdwebClient;
};

export function ProjectSelectorMobileMenuButton(
  props: ProjectSelectorMobileMenuButtonProps,
) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          aria-label="Select Project"
          className="!h-auto w-auto rounded-xl px-1 py-2"
          size="icon"
          variant="ghost"
        >
          <ChevronsUpDownIcon className="size-5 shrink-0 text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="p-0"
        dialogCloseClassName="hidden"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setOpen(false);
          }
        }}
      >
        <DynamicHeight>
          <ProjectSelectorUI
            client={props.client}
            createProject={() => {
              props.createProject(props.team);
              setOpen(false);
            }}
            currentProject={props.currentProject}
            projects={props.projects}
            team={props.team}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
