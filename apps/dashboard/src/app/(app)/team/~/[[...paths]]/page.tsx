import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeams } from "@/api/team";
import { AppFooter } from "@/components/footers/app-footer";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TeamHeader } from "../../components/TeamHeader/team-header";
import { createTeamLink, TeamSelectorCard } from "./components/team-selector";

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
          <TeamSelectorCard
            client={client}
            paths={params.paths}
            searchParams={searchParamsString}
            teams={teams}
          />
        </div>
      </div>

      <AppFooter className="relative z-10" />
    </div>
  );
}
