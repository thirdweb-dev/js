import { ChevronRightIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";

export function createTeamLink(params: {
  team: Team;
  paths: string[] | undefined;
  searchParams: string | undefined;
}) {
  const pathsSegment = params.paths?.length ? `/${params.paths.join("/")}` : "";
  const searchParamsSegment = params.searchParams
    ? `?${params.searchParams}`
    : "";
  return `/team/${params.team.slug}${pathsSegment}${searchParamsSegment}`;
}

export function TeamSelectorCard(props: {
  teams: Team[];
  client: ThirdwebClient;
  searchParams: string;
  paths: string[] | undefined;
}) {
  return (
    <div className="w-full max-w-lg rounded-xl border bg-card shadow-2xl">
      <div className="flex flex-col border-b p-4 lg:p-6">
        <div className="mb-2 self-start rounded-full border p-2">
          <UsersIcon className="size-5 text-muted-foreground" />
        </div>
        <h1 className="mb-0.5 font-semibold text-xl tracking-tight">
          Select a team
        </h1>
        <p className="text-muted-foreground text-sm">
          You are currently a member of multiple teams
          <br />
          Select a team to view this page
        </p>
      </div>

      <div className="flex flex-col [&>*:not(:last-child)]:border-b">
        {props.teams.map((team) => {
          return (
            <div
              className="group relative flex items-center gap-3 px-4 py-4 hover:bg-accent/50 lg:px-6"
              key={team.id}
            >
              <GradientAvatar
                className="size-8 rounded-full border"
                client={props.client}
                id={team.id}
                src={team.image || ""}
              />
              <Link
                className="before:absolute before:inset-0"
                href={createTeamLink({
                  paths: props.paths,
                  searchParams: props.searchParams,
                  team,
                })}
              >
                {team.name}
              </Link>
              <TeamPlanBadge plan={team.billingPlan} teamSlug={team.slug} />
              <ChevronRightIcon className="ml-auto size-4 text-muted-foreground group-hover:text-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
