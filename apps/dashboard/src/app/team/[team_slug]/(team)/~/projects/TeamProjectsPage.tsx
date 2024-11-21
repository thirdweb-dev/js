"use client";

import type { Project } from "@/api/projects";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { LazyCreateAPIKeyDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";

type SortyById = "name" | "createdAt";

export function TeamProjectsPage(props: {
  projects: Project[];
  team_slug: string;
}) {
  const { projects } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortyById>("createdAt");
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const router = useDashboardRouter();

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <SearchInput value={searchTerm} onValueChange={setSearchTerm} />
        <div className="flex gap-4">
          <SelectBy value={sortBy} onChange={setSortBy} />
          <AddNewButton
            createProject={() => setIsCreateProjectDialogOpen(true)}
            teamMembersSettingsPath={`/team/${props.team_slug}/~/settings/members`}
          />
        </div>
      </div>

      <div className="h-6" />

      {/* Projects */}
      {projectsToShow.length === 0 ? (
        <div className="flex h-[450px] items-center justify-center rounded-lg border border-border ">
          No projects found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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

      <LazyCreateAPIKeyDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        onCreateAndComplete={() => {
          // refresh projects
          router.refresh();
        }}
      />
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
      className="relative flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70"
    >
      {/* TODO - set image */}
      <ProjectAvatar className="size-10 rounded-full" src="" />

      <div>
        <Link
          className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
          // remove /connect when we have overview page
          href={`/team/${team_slug}/${project.slug}`}
        >
          <h2 className="font-medium text-base">{project.name}</h2>
        </Link>

        <p className="mb-1 flex items-center gap-0.5 text-muted-foreground text-xs">
          {truncate(project.publishableKey, 32)}
          <CopyButton
            text={project.publishableKey}
            iconClassName="z-10 size-3"
            className="!h-auto !w-auto -translate-x-1 p-2 hover:bg-background"
          />
        </p>

        <p className="my-1 text-muted-foreground/70 text-xs">
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
        className="bg-muted/50 pl-9"
      />
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
    </div>
  );
}

function AddNewButton(props: {
  createProject: () => void;
  teamMembersSettingsPath: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          Add New
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px] p-2" sideOffset={12}>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-between px-2"
            onClick={props.createProject}
          >
            Project
          </Button>
          <Button variant="ghost" className="justify-between px-2" asChild>
            <Link href={props.teamMembersSettingsPath}>Team Member</Link>
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
      <SelectTrigger className="min-w-[200px] bg-muted/50 capitalize">
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
