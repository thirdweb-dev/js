import { ChevronRightIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTeams, type Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { AppFooter } from "@/components/blocks/app-footer";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
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

  // if the teams.length is ever 0, redirect to the account page (where the user can create a team then)
  if (teams.length === 0) {
    redirect("/account");
  }

  // if there is a single team, redirect to the team page directly

  if (teams.length === 1 && teams[0]) {
    redirect(
      createTeamLink({
        paths: params.paths,
        searchParams: searchParamsString,
        team: teams[0],
      }),
    );
  }

  const client = getClientThirdwebClient({
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
                    className="group relative flex items-center gap-3 px-4 py-4 hover:bg-accent/50 lg:px-6"
                    key={team.id}
                  >
                    <GradientAvatar
                      className="size-8 rounded-full border"
                      client={client}
                      id={team.id}
                      src={team.image || ""}
                    />
                    <Link
                      className="before:absolute before:inset-0"
                      href={createTeamLink({
                        paths: params.paths,
                        searchParams: searchParamsString,
                        team,
                      })}
                    >
                      {team.name}
                    </Link>
                    <TeamPlanBadge
                      plan={team.billingPlan}
                      teamSlug={team.slug}
                    />
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
