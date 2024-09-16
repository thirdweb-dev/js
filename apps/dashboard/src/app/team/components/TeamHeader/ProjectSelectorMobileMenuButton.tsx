"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { ProjectSelectorUI } from "./ProjectSelectorUI";

type ProjectSelectorMobileMenuButtonProps = {
  currentProject: Project;
  projects: Project[];
  team: Team;
  createProject: () => void;
};

export function ProjectSelectorMobileMenuButton(
  props: ProjectSelectorMobileMenuButtonProps,
) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <ProjectSelectorUI
            currentProject={props.currentProject}
            projects={props.projects}
            team={props.team}
            createProject={() => {
              props.createProject();
              setOpen(false);
            }}
          />
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
}
