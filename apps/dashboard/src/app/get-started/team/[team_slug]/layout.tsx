import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { notFound } from "next/navigation";
import { getThirdwebClient } from "../../../../@/constants/thirdweb.server";
import { getValidAccount } from "../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
import { TeamHeaderLoggedIn } from "../../../team/components/TeamHeader/team-header-logged-in.client";

export default async function Layout(props: {
  params: Promise<{ team_slug: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const [team, account, accountAddress, authToken, teams] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getValidAccount(`/team/${params.team_slug}`),
    getAuthTokenWalletAddress(),
    getAuthToken(),
    getTeams(),
  ]);

  if (!accountAddress || !account || !teams || !authToken) {
    loginRedirect(`/get-started/team/${params.team_slug}`);
  }

  if (!team) {
    notFound();
  }

  // Note:
  // Do not check that team is already onboarded or not and redirect away from /get-started pages
  // because the team is marked as onboarded in the first step- instead of after completing all the steps

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const client = getThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex min-h-dvh grow flex-col">
      <div className="border-b bg-card">
        <TeamHeaderLoggedIn
          client={client}
          account={account}
          accountAddress={accountAddress}
          currentProject={undefined}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
      </div>
      {props.children}
      <AppFooter />
    </div>
  );
}
