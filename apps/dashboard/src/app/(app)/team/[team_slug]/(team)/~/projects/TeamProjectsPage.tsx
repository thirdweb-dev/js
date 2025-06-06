"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { LazyCreateProjectDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { format } from "date-fns";
import { ArrowDownNarrowWideIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";

type SortById = "name" | "createdAt" | "monthlyActiveUsers";

export type ProjectWithAnalytics = Project & {
  monthlyActiveUsers: number;
};

export function TeamProjectsPage(props: {
  projects: ProjectWithAnalytics[];
  team: Team;
  client: ThirdwebClient;
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

    // @TODO: HACK hide Engine projects from the list.
    _projectsToShow = _projectsToShow.filter(
      (project) => !project.name.startsWith("Cloud-hosted Engine ("),
    );

    return _projectsToShow;
  }, [searchTerm, sortBy, projects]);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const paginatedProjects = sortedProjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const showPagination = sortedProjects.length > pageSize;
  const totalPages = Math.ceil(sortedProjects.length / pageSize);

  return (
    <div className="flex grow flex-col">
      <div className="relative flex flex-col gap-5 rounded-t-lg pb-4 lg:flex-row lg:items-center lg:justify-between lg:border lg:border-b-0 lg:bg-card lg:px-6 lg:py-6">
        <h2 className="font-semibold text-2xl tracking-tight">Projects</h2>

        {/* Filters + Add New */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchInput
            value={searchTerm}
            onValueChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
          />
          <div className="flex gap-3">
            <SelectBy
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
            />
            <AddNewButton
              createProject={() => setIsCreateProjectDialogOpen(true)}
              teamMembersSettingsPath={`/team/${props.team.slug}/~/settings/members`}
            />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {paginatedProjects.length === 0 ? (
        <>
          {searchTerm !== "" ? (
            <div className="flex min-h-[450px] grow items-center justify-center border border-border bg-card">
              <div className="flex flex-col items-center">
                <p className="mb-5 text-center">No projects found</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[450px] grow items-center justify-center rounded-b-lg border border-border bg-card">
              <div className="flex flex-col items-center">
                <p className="mb-5 text-center font-semibold text-lg">
                  No projects created
                </p>
                <Button
                  className="gap-2 bg-background"
                  onClick={() => setIsCreateProjectDialogOpen(true)}
                  variant="outline"
                >
                  <PlusIcon className="size-4" />
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <TableContainer
            className={cn(
              "lg:rounded-t-none",
              showPagination && "rounded-b-none",
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[300px]">Project</TableHead>
                  <TableHead>Monthly Active Users</TableHead>
                  <TableHead className="w-[250px]">Client ID</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    linkBox
                    className="hover:bg-accent/50"
                  >
                    <TableCell>
                      <Link
                        className="flex items-center gap-3 before:absolute before:inset-0"
                        href={`/team/${props.team.slug}/${project.slug}`}
                      >
                        <ProjectAvatar
                          className="size-8 rounded-full"
                          src={project.image || ""}
                          client={props.client}
                        />
                        <span className="font-medium text-sm">
                          {project.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {project.monthlyActiveUsers === 0 ? (
                        <span className="text-muted-foreground">No Users</span>
                      ) : (
                        project.monthlyActiveUsers
                      )}
                    </TableCell>
                    <TableCell>
                      <CopyTextButton
                        textToCopy={project.publishableKey}
                        textToShow={`${project.publishableKey.slice(0, 4)}...${project.publishableKey.slice(-4)}`}
                        copyIconPosition="right"
                        tooltip={undefined}
                        variant="ghost"
                        className="-translate-x-2 z-10 font-mono text-muted-foreground"
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(project.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {showPagination && (
            <div className="rounded-b-lg border border-t-0 bg-card p-4">
              <PaginationButtons
                activePage={page}
                onPageClick={setPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      )}

      <LazyCreateProjectDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        teamSlug={props.team.slug}
        teamId={props.team.id}
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

function SearchInput(props: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative grow">
      <Input
        placeholder="Project name or Client ID"
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="bg-background pl-9 lg:w-[320px]"
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
    <Button
      variant="default"
      className="absolute top-0 right-0 gap-2 lg:static"
      onClick={props.createProject}
    >
      <PlusIcon className="size-4" />
      <span>
        <span className="hidden lg:inline">Create</span> Project
      </span>
    </Button>
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
      <SelectTrigger className="min-w-[200px] bg-background capitalize">
        <div className="flex items-center gap-2">
          <ArrowDownNarrowWideIcon className="size-4 text-muted-foreground" />
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
