import { redirect } from "next/navigation";
import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { ErrorProvider } from "../../../../../../../../contexts/error-handler";
import { SharedContractLayout } from "../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/shared-layout";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../../../../components/TeamHeader/team-header-logged-in.client";
import { SaveLastUsedProject } from "../../../(sidebar)/components/SaveLastUsedProject";
import type { ProjectContractPageParams } from "./types";

export default async function ContractLayout(props: {
  children: React.ReactNode;
  params: Promise<ProjectContractPageParams>;
}) {
  const params = await props.params;
  const [accountAddress, teams, account, authToken] = await Promise.all([
    getAuthTokenWalletAddress(),
    getTeams(),
    getValidAccount(`/team/${params.team_slug}/${params.project_slug}`),
    getAuthToken(),
  ]);

  if (!teams || !accountAddress || !authToken) {
    redirect("/login");
  }

  const team = teams.find(
    (t) => t.slug === decodeURIComponent(params.team_slug),
  );

  if (!team) {
    redirect("/team");
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  const project = teamsAndProjects
    .find((t) => t.team.slug === decodeURIComponent(params.team_slug))
    ?.projects.find((p) => p.slug === params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <ErrorProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <div className="border-border border-b bg-card">
          <TeamHeaderLoggedIn
            account={account}
            accountAddress={accountAddress}
            client={client}
            currentProject={project}
            currentTeam={team}
            teamsAndProjects={teamsAndProjects}
          />
        </div>
        <SharedContractLayout
          authToken={authToken}
          chainIdOrSlug={params.chainIdOrSlug}
          contractAddress={params.contractAddress}
          projectMeta={{
            projectSlug: params.project_slug,
            teamId: team.id,
            teamSlug: params.team_slug,
          }}
        >
          {props.children}
        </SharedContractLayout>
        <SaveLastUsedProject projectId={project.id} teamId={team.id} />
        <AppFooter />
      </div>
    </ErrorProvider>
  );
}
