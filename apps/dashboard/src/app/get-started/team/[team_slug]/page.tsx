import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
import { isTeamOnboardingComplete } from "../../../login/onboarding/isOnboardingRequired";
import { TeamOnboarding } from "../../../login/onboarding/team-onboarding/team-onboarding";
import { TeamHeaderLoggedIn } from "../../../team/components/TeamHeader/team-header-logged-in.client";

export default async function TeamOnboardingPage(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  const [team, account, accountAddress, teams] = await Promise.all([
    getTeamBySlug(team_slug),
    getValidAccount(`/team/${team_slug}`),
    getAuthTokenWalletAddress(),
    getTeams(),
  ]);

  if (!accountAddress || !account || !teams) {
    loginRedirect(`/team/${team_slug}`);
  }

  if (!team) {
    redirect("/team");
  }

  // if already onboarded
  if (isTeamOnboardingComplete(team)) {
    redirect(`/team/${team.slug}`);
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  return (
    <div className="flex min-h-dvh grow flex-col">
      {/* header */}
      <div className="border-b bg-card">
        <TeamHeaderLoggedIn
          account={account}
          accountAddress={accountAddress}
          currentProject={undefined}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
      </div>

      {/* content */}
      <TeamOnboarding teamId={team.id} teamSlug={team.slug} />

      <AppFooter />
    </div>
  );
}
