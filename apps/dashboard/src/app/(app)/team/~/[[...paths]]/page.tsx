import { type Team, getTeams } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { AppFooter } from "@/components/blocks/app-footer";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { ChevronRightIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { TeamPlanBadge } from "../../../components/TeamPlanBadge";
import { TeamHeader } from "../../components/TeamHeader/team-header";

export default async function Page(props: {
  params: Promise<{
    paths?: string[];
  }>;
  searchParams: Promise<Record<string, string | undefined | string[]>>;
}) {
  const [params, searchParams, teams, authToken] = await Promise.all([
    props.params,
    props.searchParams,
    getTeams(),
    getAuthToken(),
  ]);

  if (!teams || !authToken) {
    notFound();
  }

  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => `${key}=${encodeURIComponent(String(v))}`)
          .join("&");
      }
      return `${key}=${encodeURIComponent(String(value))}`;
    })
    .join("&");

  // if there is a single team, redirect to the team page directly
  if (teams.length === 1 && teams[0]) {
    redirect(
      createTeamLink({
        team: teams[0],
        paths: params.paths,
        searchParams: searchParamsString,
      }),
    );
  }

  const client = getThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  return (
    <div className="relative flex min-h-dvh flex-col ">
      <div className="border-b bg-card">
        <TeamHeader />
      </div>

      <div className="relative flex grow flex-col overflow-hidden">
        <DotsBackgroundPattern />
        <div className="container z-10 flex grow flex-col items-center justify-center py-20">
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
              {teams.map((team) => {
                return (
                  <div
                    key={team.id}
                    className="group relative flex items-center gap-3 px-4 py-4 hover:bg-accent/50 lg:px-6"
                  >
                    <GradientAvatar
                      src={team.image || ""}
                      id={team.id}
                      className="size-8 rounded-full border"
                      client={client}
                    />
                    <Link
                      href={createTeamLink({
                        team,
                        paths: params.paths,
                        searchParams: searchParamsString,
                      })}
                      className="before:absolute before:inset-0"
                    >
                      {team.name}
                    </Link>
                    <TeamPlanBadge plan={team.billingPlan} />
                    <ChevronRightIcon className="ml-auto size-4 text-muted-foreground group-hover:text-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AppFooter className="relative z-10" />
    </div>
  );
}

function createTeamLink(params: {
  team: Team;
  paths: string[] | undefined;
  searchParams: string | undefined;
}) {
  return `/team/${params.team.slug}/${(params.paths || [])?.join("/") || ""}${params.searchParams ? `?${params.searchParams}` : ""}`;
}
