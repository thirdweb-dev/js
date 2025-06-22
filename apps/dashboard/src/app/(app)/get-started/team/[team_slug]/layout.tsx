import { differenceInDays } from "date-fns";
import { InfoIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { AppFooter } from "@/components/footers/app-footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../../@/api/auth-token";
import { getValidAccount } from "../../../account/settings/getAccount";
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

  // show the banner only if the team was created more than 3 days ago
  const shouldShowOnboardingBanner =
    differenceInDays(new Date(), new Date(team.createdAt)) > 3;

  // Note:
  // Do not check that team is already onboarded or not and redirect away from /get-started pages
  // because the team is marked as onboarded in the first step- instead of after completing all the steps

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex min-h-dvh grow flex-col">
      <div className="border-b bg-card">
        <TeamHeaderLoggedIn
          account={account}
          accountAddress={accountAddress}
          client={client}
          currentProject={undefined}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
      </div>
      {shouldShowOnboardingBanner && (
        <div className="container mt-10">
          <Alert variant="info">
            <InfoIcon className="size-5" />
            <AlertTitle>Finish setting up your team</AlertTitle>
            <AlertDescription>
              Your team predates our latest onboarding flow, so a few steps
              might still be pending.
              <br />
              Completing this updated guide takes less than a minute and ensures
              everything is set up correctly.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {props.children}
      <AppFooter />
    </div>
  );
}
