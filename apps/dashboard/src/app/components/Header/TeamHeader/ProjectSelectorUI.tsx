import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchInput } from "./SearchInput";

export function ProjectSelectorUI(props: {
  projects: Project[];
  currentProject: Project | undefined;
  team: Team;
}) {
  const { projects, currentProject, team } = props;
  const [searchProjectTerm, setSearchProjectTerm] = useState("");
  const filteredProjects = searchProjectTerm
    ? projects.filter((project) => project.name.includes(searchProjectTerm))
    : projects;

  return (
    <div className="flex flex-col border-l fade-in-0 animate-in duration-300">
      <SearchInput
        placeholder="Search Projects"
        value={searchProjectTerm}
        onValueChange={setSearchProjectTerm}
      />

      <Separator />

      <ScrollShadow
        scrollableClassName="max-h-[400px] lg:max-h-[600px]"
        className="grow"
      >
        <div className="flex flex-col p-2">
          <h2 className="text-muted-foreground text-xs mx-2 mb-2 mt-2 font-medium">
            Projects
          </h2>

          <ul className="flex flex-col gap-1">
            {filteredProjects.map((project) => {
              const isSelected = project.slug === currentProject?.slug;
              return (
                <li key={project.slug}>
                  <Button
                    className={cn(
                      "gap-2 pl-2 w-full justify-between !opacity-100 disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed",
                      isSelected && "bg-accent",
                    )}
                    variant="ghost"
                    asChild
                  >
                    {/* TODO - when we have overview page, remove /connect */}
                    <Link href={`/team/${team.slug}/${project.slug}/connect`}>
                      <span className="truncate"> {project.name} </span>
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

      <div className="p-2 border-t">
        <Button
          className="px-2 w-full gap-2 justify-start disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed"
          variant="ghost"
          disabled
        >
          <CirclePlusIcon className="size-4 text-link-foreground" />
          Create Project
          <Badge className="ml-auto" variant="secondary">
            Soon{"™️"}
          </Badge>
        </Button>
      </div>
    </div>
  );
}
