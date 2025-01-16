"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { LazyCreateAPIKeyDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SortById = "name" | "createdAt";

export function TeamProjectsPage(props: {
  projects: Project[];
  team: Team;
}) {
  const { projects } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortById>("createdAt");
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
    <div className="flex grow flex-col">
      {/* Filters + Add New */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <SearchInput value={searchTerm} onValueChange={setSearchTerm} />
        <div className="flex gap-4">
          <SelectBy value={sortBy} onChange={setSortBy} />
          <AddNewButton
            createProject={() => setIsCreateProjectDialogOpen(true)}
            teamMembersSettingsPath={`/team/${props.team.slug}/~/settings/members`}
          />
        </div>
      </div>

      <div className="h-6" />

      {/* Projects */}
      {projectsToShow.length === 0 ? (
        <div className="flex min-h-[450px] grow items-center justify-center rounded-lg border border-border">
          <div className="flex flex-col items-center">
            <p className="mb-5 text-center">No projects created</p>
            <Button
              className="gap-2"
              onClick={() => setIsCreateProjectDialogOpen(true)}
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Create a Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projectsToShow.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                project={project}
                team_slug={props.team.slug}
              />
            );
          })}
        </div>
      )}

      <LazyCreateAPIKeyDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        onCreateAndComplete={() => {
          // refresh projects
          router.refresh();
        }}
        enableNebulaServiceByDefault={props.team.enabledScopes.includes(
          "nebula",
        )}
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
      className="relative flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-active-border"
    >
      {/* TODO - set image */}
      <ProjectAvatar className="size-10 rounded-full" src="" />

      <div className="flex-grow flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <Link
            className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
            // remove /connect when we have overview page
            href={`/team/${team_slug}/${project.slug}`}
          >
            <h2 className="font-medium text-base">{project.name}</h2>
          </Link>
          <CopyButton
            text={project.publishableKey}
            iconClassName="z-10 size-3"
            className="!h-auto !w-auto -translate-x-1 p-2 hover:bg-secondary"
          />
        </div>

        <p className="flex items-center text-muted-foreground text-sm">
          {truncate(project.publishableKey, 32)}
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
        className="bg-card pl-9"
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
  value: SortById;
  onChange: (value: SortById) => void;
}) {
  const values: SortById[] = ["name", "createdAt"];
  const valueToLabel: Record<SortById, string> = {
    name: "Name",
    createdAt: "Creation Date",
  };

  return (
    <Select
      value={props.value}
      onValueChange={(v) => {
        props.onChange(v as SortById);
      }}
    >
      <SelectTrigger className="min-w-[200px] bg-card capitalize">
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
