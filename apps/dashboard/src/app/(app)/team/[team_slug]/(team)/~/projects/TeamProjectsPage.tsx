"use client";

import { format } from "date-fns";
import {
  ArrowUpDownIcon,
  CalendarIcon,
  CheckIcon,
  LetterTextIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { Team } from "@/api/team/get-team";
import { ProjectAvatar } from "@/components/blocks/avatar/project-avatar";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { LazyCreateProjectDialog } from "@/components/project/create-project-modal/LazyCreateAPIKeyDialog";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

  const pageSize = 5;
  const [page, setPage] = useState(1);
  const paginatedProjects = sortedProjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const showPagination = sortedProjects.length > pageSize;
  const totalPages = Math.ceil(sortedProjects.length / pageSize);

  const hasActiveFilters = searchTerm !== "" || sortBy !== "monthlyActiveUsers";

  return (
    <div>
      <div className="relative flex flex-col gap-5 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mb-1 font-semibold text-2xl tracking-tight">
            Projects
          </h2>
          <p className="text-muted-foreground text-sm">
            Create and manage your projects for your team
          </p>
        </div>

        {/* Filters + Add New */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="relative max-sm:grow lg:w-60">
              <Input
                className="rounded-full bg-card pl-10"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Name or Client ID"
                value={searchTerm}
              />
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-4 size-4 text-muted-foreground" />
            </div>
            <SortDropdown
              hasActiveFilters={hasActiveFilters}
              onSortChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              sortBy={sortBy}
            />
          </div>

          <Button
            className="gap-1.5 rounded-full"
            onClick={() => setIsCreateProjectDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      {paginatedProjects.length === 0 ? (
        searchTerm !== "" ? (
          <div className="flex min-h-[375px] grow items-center justify-center border border-dashed bg-card rounded-lg">
            <div className="flex flex-col items-center">
              <p className="mb-5 text-center">No projects found</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[375px] grow items-center justify-center border rounded-lg border-dashed bg-card">
            <div className="flex flex-col items-center">
              <p className="mb-5 text-center font-semibold text-lg">
                No projects created
              </p>
              <Button
                className="gap-2"
                onClick={() => setIsCreateProjectDialogOpen(true)}
                variant="default"
              >
                <PlusIcon className="size-4" />
                Create Project
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="flex grow flex-col">
          <TableContainer className={cn(showPagination && "rounded-b-none")}>
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
                    className="hover:bg-accent/50"
                    key={project.id}
                    linkBox
                  >
                    <TableCell>
                      <Link
                        className="flex items-center gap-3 before:absolute before:inset-0"
                        href={`/team/${props.team.slug}/${project.slug}`}
                      >
                        <ProjectAvatar
                          className="size-8 rounded-full"
                          client={props.client}
                          src={project.image || ""}
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
                        className="-translate-x-2 z-10 font-mono text-muted-foreground"
                        copyIconPosition="right"
                        textToCopy={project.publishableKey}
                        textToShow={`${project.publishableKey.slice(0, 4)}...${project.publishableKey.slice(-4)}`}
                        tooltip={undefined}
                        variant="ghost"
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
        enableNebulaServiceByDefault={props.team.enabledScopes.includes(
          "nebula",
        )}
        onCreateAndComplete={() => {
          // refresh projects
          router.refresh();
        }}
        onOpenChange={setIsCreateProjectDialogOpen}
        open={isCreateProjectDialogOpen}
        teamId={props.team.id}
        teamSlug={props.team.slug}
      />
    </div>
  );
}

const sortByIcon: Record<SortById, React.FC<{ className?: string }>> = {
  createdAt: CalendarIcon,
  monthlyActiveUsers: UsersIcon,
  name: LetterTextIcon,
};

function SortDropdown(props: {
  sortBy: SortById;
  onSortChange: (value: SortById) => void;
  hasActiveFilters: boolean;
}) {
  const values: SortById[] = ["name", "createdAt", "monthlyActiveUsers"];
  const valueToLabel: Record<SortById, string> = {
    createdAt: "Creation Date",
    monthlyActiveUsers: "Monthly Active Users",
    name: "Name",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5 rounded-full bg-card" variant="outline">
          <ArrowUpDownIcon className="size-4 text-muted-foreground" />
          <span className="hidden lg:inline">Sort by</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl p-1.5 shadow-lg"
        sideOffset={10}
      >
        <DropdownMenuRadioGroup
          className="flex flex-col gap-1"
          onValueChange={(v) => props.onSortChange(v as SortById)}
          value={props.sortBy}
        >
          {values.map((value) => {
            const Icon = sortByIcon[value];
            return (
              <DropdownMenuItem
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-lg py-2",
                  props.sortBy === value && "bg-accent",
                )}
                key={value}
                onClick={() => props.onSortChange(value)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  {valueToLabel[value]}
                </div>

                {props.sortBy === value ? (
                  <CheckIcon className="size-4 text-foreground" />
                ) : (
                  <div className="size-4" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
