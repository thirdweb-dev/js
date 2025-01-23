"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { LazyCreateAPIKeyDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortById = "name" | "createdAt" | "monthlyActiveUsers";

export type ProjectWithAnalytics = Project & {
  monthlyActiveUsers: number;
};

export function TeamProjectsPage(props: {
  projects: ProjectWithAnalytics[];
  team: Team;
}) {
  const { projects } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortById>("monthlyActiveUsers");
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const router = useDashboardRouter();

  const sortedProjects = useMemo(() => {
    let _projectsToShow = !searchTerm
      ? projects
      : projects.filter(
          (project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.publishableKey
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );

    if (sortBy === "name") {
      _projectsToShow = _projectsToShow.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (sortBy === "createdAt") {
      _projectsToShow = _projectsToShow.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "monthlyActiveUsers") {
      _projectsToShow = _projectsToShow.sort(
        (a, b) => b.monthlyActiveUsers - a.monthlyActiveUsers,
      );
    }

    return _projectsToShow;
  }, [searchTerm, sortBy, projects]);

  const pageSize = 8;
  const [page, setPage] = useState(1);
  const paginatedProjects = sortedProjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const showPagination = sortedProjects.length > pageSize;
  const totalPages = Math.ceil(sortedProjects.length / pageSize);

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
      {paginatedProjects.length === 0 ? (
        <>
          {searchTerm !== "" ? (
            <div className="flex min-h-[450px] grow items-center justify-center rounded-lg border border-border">
              <div className="flex flex-col items-center">
                <p className="mb-5 text-center">No projects found</p>
              </div>
            </div>
          ) : (
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
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {paginatedProjects.map((project) => {
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

      {showPagination && (
        <div className="py-6">
          <PaginationButtons
            activePage={page}
            onPageClick={setPage}
            totalPages={totalPages}
          />
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
  project: ProjectWithAnalytics;
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

      <div className="flex flex-grow flex-col gap-1">
        <Link
          className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
          // remove /connect when we have overview page
          href={`/team/${team_slug}/${project.slug}`}
        >
          <h2 className="font-medium text-base">{project.name}</h2>
        </Link>

        <p className="flex items-center gap-1 text-muted-foreground text-sm">
          <span>{project.monthlyActiveUsers}</span>
          Monthly Active Users
        </p>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button className="z-10 h-auto w-auto p-2" variant="ghost">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-1">
          <CopyTextButton
            textToCopy={project.publishableKey}
            textToShow="Copy Client ID"
            copyIconPosition="right"
            tooltip={undefined}
            variant="ghost"
            className="flex h-10 w-full justify-between gap-3 rounded-md px-4 py-2"
          />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            asChild
          >
            <Link href={`/team/${team_slug}/${project.slug}/settings`}>
              Settings
            </Link>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
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
  const values: SortById[] = ["name", "createdAt", "monthlyActiveUsers"];
  const valueToLabel: Record<SortById, string> = {
    name: "Name",
    createdAt: "Creation Date",
    monthlyActiveUsers: "Monthly Active Users",
  };

  return (
    <Select
      value={props.value}
      onValueChange={(v) => {
        props.onChange(v as SortById);
      }}
    >
      <SelectTrigger className="min-w-[200px] bg-card capitalize">
        <div className="flex items-center gap-1.5">
          <span className="!hidden lg:!inline text-muted-foreground">
            Sort by
          </span>
          {valueToLabel[props.value]}
        </div>
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
