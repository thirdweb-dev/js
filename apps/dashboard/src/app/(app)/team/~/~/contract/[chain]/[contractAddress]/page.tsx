import { notFound, redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import {
  getContractImportedProjects,
  type PartialProject,
} from "@/api/project/getProjectContracts";
import { getProjects } from "@/api/project/projects";
import { getTeams, type Team } from "@/api/team/get-team";
import { AppFooter } from "@/components/footers/app-footer";
import { DotsBackgroundPattern } from "@/components/ui/background-patterns";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { fetchChain } from "@/utils/fetchChain";
import { loginRedirect } from "@/utils/redirects";
import { TeamHeader } from "../../../../../components/TeamHeader/team-header";
import {
  ImportAndSelectProjectForContract,
  SelectProjectForContract,
} from "../../../../_components/project-selector";

export default async function Page(props: {
  params: Promise<{
    chain: string;
    contractAddress: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/team/~/~/contract/${params.chain}/${params.contractAddress}`;

  const contractAddress = getAddress(params.contractAddress);

  const [authToken, chainMetadata, account, teams] = await Promise.all([
    getAuthToken(),
    fetchChain(params.chain),
    await getValidAccount(pagePath),
    getTeams(),
  ]);

  if (!chainMetadata) {
    notFound();
  }

  if (!authToken || !account || !teams) {
    loginRedirect(pagePath);
  }

  // get the list of projects in each team where this contract is imported
  // filter out teams with no projects
  const teamAndProjectWithContracts = (
    await Promise.all(
      teams.map(async (team) => {
        return {
          projects: await getContractImportedProjects({
            authToken,
            chainId: chainMetadata.chainId,
            contractAddress,
            teamId: team.id,
          }).catch(() => []),
          team,
        };
      }),
    )
  ).filter((x) => x.projects.length > 0);

  const projectImports: Array<{
    team: Team;
    project: PartialProject;
  }> = [];

  for (const teamAndProject of teamAndProjectWithContracts) {
    for (const project of teamAndProject.projects) {
      projectImports.push({
        project,
        team: teamAndProject.team,
      });
    }
  }

  // if contract imported in only one project, redirect to it directly
  if (projectImports.length === 1 && projectImports[0]) {
    redirect(
      `/team/${projectImports[0].team.slug}/${projectImports[0].project.slug}/contract/${chainMetadata.slug}/${contractAddress}`,
    );
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  // if contract imported in multiple projects
  // user needs to select one
  if (projectImports.length > 1) {
    return (
      <ProjectSelectionLayout>
        <SelectProjectForContract
          chainSlug={chainMetadata.slug}
          client={client}
          contractAddress={contractAddress}
          teamAndProjects={teamAndProjectWithContracts}
        />
      </ProjectSelectionLayout>
    );
  }

  // if contract not imported in any projects
  // user needs to select one from all projects, import the contract in the selected project and redirect
  const teamAndAllProjects = await Promise.all(
    teams.map(async (team) => {
      return {
        projects: await getProjects(team.slug).catch(() => []),
        team,
      };
    }),
  );

  return (
    <ProjectSelectionLayout>
      <ImportAndSelectProjectForContract
        chainId={chainMetadata.chainId}
        chainSlug={chainMetadata.slug}
        client={client}
        contractAddress={contractAddress}
        teamAndProjects={teamAndAllProjects}
      />
    </ProjectSelectionLayout>
  );
}

function ProjectSelectionLayout(props: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="border-b bg-card">
        <TeamHeader />
      </div>

      <div className="relative flex grow flex-col overflow-hidden">
        <DotsBackgroundPattern />
        <div className="container z-10 flex grow flex-col items-center justify-center py-20">
          {props.children}
        </div>
      </div>
      <AppFooter className="relative z-10" />
    </div>
  );
}
