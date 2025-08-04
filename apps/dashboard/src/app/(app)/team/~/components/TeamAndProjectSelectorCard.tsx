"use client";

import { BoxIcon, ChevronRightIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import type { PartialProject } from "@/api/project/getProjectContracts";
import type { Team } from "@/api/team/get-team";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { ProjectAvatar } from "@/components/blocks/avatar/project-avatar";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectAndTeamSelectorCard(props: {
  teamAndProjects: {
    team: Team;
    projects: PartialProject[];
  }[];
  client: ThirdwebClient;
  description: React.ReactNode;
  onSelect: (selected: { team: Team; project: PartialProject }) => void;
}) {
  const teamAndProjects = props.teamAndProjects.filter(
    ({ projects }) => projects.length > 0,
  );

  const showTeamHeader = teamAndProjects.length > 1;

  return (
    <div className="w-full max-w-lg rounded-xl border bg-card shadow-2xl">
      <div className="flex flex-col border-b p-4 lg:p-6">
        <div className="mb-2 self-start rounded-full border p-2">
          <BoxIcon className="size-5 text-muted-foreground" />
        </div>
        <h1 className="mb-0.5 font-semibold text-xl tracking-tight">
          Select a project
        </h1>
        <p className="text-muted-foreground text-sm">{props.description}</p>
      </div>

      <div
        className={cn("flex flex-col", showTeamHeader && "p-4 lg:p-6 gap-6")}
      >
        {teamAndProjects.map(({ team, projects }) => {
          // If multiple teams, show team name and then projects
          return (
            <div key={team.id}>
              <div
                className={cn(
                  showTeamHeader &&
                    "border rounded-xl overflow-hidden bg-background",
                )}
              >
                {showTeamHeader && (
                  <div className={cn("px-4 py-3 border-b bg-muted/50")}>
                    <div className="flex items-center gap-2">
                      <GradientAvatar
                        className="size-6 rounded-full border"
                        client={props.client}
                        id={team.id}
                        src={team.image || ""}
                      />
                      <span className="font-medium text-sm">{team.name}</span>
                      <TeamPlanBadge
                        plan={team.billingPlan}
                        teamSlug={team.slug}
                      />
                    </div>
                  </div>
                )}

                <div className="max-h-[320px] overflow-y-auto">
                  <div className="[&>*:not(:last-child)]:border-b">
                    {projects.map((project) => (
                      <Button
                        className={cn(
                          "h-auto group relative flex items-center gap-3 px-4 py-4 hover:bg-accent/50 lg:px-6 w-full rounded-none justify-start",
                          showTeamHeader && "lg:pl-5",
                        )}
                        key={project.slug}
                        onClick={() =>
                          props.onSelect({
                            project,
                            team,
                          })
                        }
                        variant="ghost"
                      >
                        <ProjectAvatar
                          className="size-6 rounded-full border"
                          client={props.client}
                          src={project.image || ""}
                        />
                        <span className="text-sm font-medium">
                          {project.name}
                        </span>

                        <ChevronRightIcon className="ml-auto size-3.5 text-muted-foreground/50 group-hover:text-foreground" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
