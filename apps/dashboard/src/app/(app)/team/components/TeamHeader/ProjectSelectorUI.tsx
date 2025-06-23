"use client";

import { CheckIcon, CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ProjectAvatar } from "@/components/blocks/avatar/project-avatar";
import { Button } from "@/components/ui/button";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

export function ProjectSelectorUI(props: {
  projects: Project[];
  currentProject: Project | undefined;
  team: Team;
  createProject: () => void;
  client: ThirdwebClient;
}) {
  const { projects, currentProject, team } = props;
  const [searchProjectTerm, setSearchProjectTerm] = useState("");
  const filteredProjects = searchProjectTerm
    ? projects.filter((project) =>
        project.name.toLowerCase().includes(searchProjectTerm.toLowerCase()),
      )
    : projects;

  return (
    <div className="fade-in-0 flex animate-in flex-col border-border border-l duration-300">
      <SearchInput
        onValueChange={setSearchProjectTerm}
        placeholder="Search Projects"
        value={searchProjectTerm}
      />

      <Separator />

      <ScrollShadow
        className="grow"
        scrollableClassName="max-h-[400px] lg:max-h-[600px]"
      >
        <div className="flex flex-col p-2">
          <h2 className="mx-2 mt-2 mb-2 font-medium text-muted-foreground text-xs">
            Projects
          </h2>

          <ul className="flex flex-col gap-1">
            {filteredProjects.map((project) => {
              const isSelected = project.slug === currentProject?.slug;
              return (
                <li key={project.slug}>
                  <Button
                    asChild
                    className={cn(
                      "!opacity-100 w-full justify-between gap-2 pl-2 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100",
                      isSelected && "bg-accent",
                    )}
                    variant="ghost"
                  >
                    <Link href={`/team/${team.slug}/${project.slug}`}>
                      <div className="flex items-center gap-2">
                        <ProjectAvatar
                          className="size-6"
                          client={props.client}
                          src={project.image || ""}
                        />
                        <span className="truncate"> {project.name}</span>
                      </div>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollShadow>

      <div className="border-border border-t p-2">
        <Button
          className="w-full justify-start gap-2 px-2 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100"
          onClick={props.createProject}
          variant="ghost"
        >
          <CirclePlusIcon className="size-4 text-link-foreground" />
          Create Project
        </Button>
      </div>
    </div>
  );
}
