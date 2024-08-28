"use client";

import type { Project } from "@/api/projects";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type SortyById = "name" | "createdAt";

export function TeamOverviewPage(props: {
  projects: Project[];
  team_slug: string;
}) {
  const { projects } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortyById>("createdAt");

  let projectsToShow = !searchTerm
    ? projects
    : projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.publishableKey
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );

  if (sortBy === "name") {
    projectsToShow = projectsToShow.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  } else if (sortBy === "createdAt") {
    projectsToShow = projectsToShow.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return (
    <div className="container ">
      <div className="h-10" />

      {/* Filters + Add New */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <SearchInput value={searchTerm} onValueChange={setSearchTerm} />
        <div className="flex gap-4">
          <SelectBy value={sortBy} onChange={setSortBy} />
          <AddNewButton />
        </div>
      </div>

      <div className="h-6" />

      {/* Projects */}
      {projectsToShow.length === 0 ? (
        <div className="border rounded-lg h-[450px] flex items-center justify-center ">
          No projects found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ">
          {projectsToShow.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                project={project}
                team_slug={props.team_slug}
              />
            );
          })}
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

function ProjectCard(props: {
  project: Project;
  team_slug: string;
}) {
  const { project, team_slug } = props;
  return (
    <div
      key={project.id}
      className="border rounded-lg p-4 relative hover:bg-muted flex items-center gap-4 bg-muted/20 transition-colors"
    >
      {/* TODO - replace with project image */}
      <div className="size-10 rounded-full bg-border shrink-0" />

      <div>
        <Link
          className="static group before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
          // remove /connect when we have overview page
          href={`/team/${team_slug}/${project.slug}/connect`}
        >
          <h2 className="text-base">{project.name}</h2>
        </Link>

        <CopyTextButton
          copyIconPosition="right"
          textToCopy={project.publishableKey}
          textToShow={truncate(project.publishableKey, 32)}
          tooltip="Copy Client ID"
          variant="ghost"
          className="px-2 -translate-x-2 text-muted-foreground text-xs"
        />

        <p className="text-xs text-muted-foreground my-1">
          Created on {format(new Date(project.createdAt), "MMM dd, yyyy")}
        </p>
      </div>
    </div>
  );
}

function truncate(str: string, stringLimit: number) {
  return str.length > stringLimit ? `${str.slice(0, stringLimit)}...` : str;
}

function SearchInput(props: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative grow">
      <Input
        placeholder="Search Projects by name or Client ID"
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="pl-9"
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function AddNewButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" className="gap-2">
          Add New
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 min-w-[220px]" sideOffset={12}>
        <div className="flex flex-col gap-1">
          {/* TODO - remove soon when we have it */}
          <Button variant="ghost" className="justify-between px-2" disabled>
            Project
            <Badge variant="outline"> Soon</Badge>
          </Button>
          {/* TODO - remove soon when we have it */}
          <Button variant="ghost" className="justify-between px-2" disabled>
            Team Member
            <Badge variant="outline"> Soon</Badge>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectBy(props: {
  value: SortyById;
  onChange: (value: SortyById) => void;
}) {
  const values: SortyById[] = ["name", "createdAt"];
  const valueToLabel: Record<SortyById, string> = {
    name: "Name",
    createdAt: "Creation Date",
  };

  return (
    <Select
      value={props.value}
      onValueChange={(v) => {
        props.onChange(v as SortyById);
      }}
    >
      <SelectTrigger className="min-w-[200px] capitalize">
        Sort by {valueToLabel[props.value]}
      </SelectTrigger>
      <SelectContent>
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {valueToLabel[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
