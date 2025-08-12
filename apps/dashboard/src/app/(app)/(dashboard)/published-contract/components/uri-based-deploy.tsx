import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { getUserThirdwebClient } from "@/api/auth-token";
import { getProjects } from "@/api/project/projects";
import { getTeams } from "@/api/team/get-team";
import { loginRedirect } from "@/utils/redirects";
import { CustomContractForm } from "./custom-contract";

type DeployFormForUriProps = {
  contractMetadata: FetchDeployMetadataResult | null;
  contractMetadataNoFee: FetchDeployMetadataResult | null;
  modules: FetchDeployMetadataResult[] | null;
  pathname: string;
};

export async function DeployFormForUri(props: DeployFormForUriProps) {
  const { contractMetadata, contractMetadataNoFee, modules, pathname } = props;

  if (!contractMetadata) {
    return <div>Could not fetch metadata</div>;
  }

  const [teams, client] = await Promise.all([
    getTeams(),
    getUserThirdwebClient({
      teamId: undefined,
    }),
  ]);

  if (!teams) {
    loginRedirect(pathname);
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: (await getProjects(team.slug)).map((x) => ({
        id: x.id,
        image: x.image,
        name: x.name,
        slug: x.slug,
      })),
      team: {
        id: team.id,
        image: team.image,
        name: team.name,
        slug: team.slug,
      },
    })),
  );

  return (
    <CustomContractForm
      client={client}
      isLoggedIn={true}
      metadata={contractMetadata}
      metadataNoFee={contractMetadataNoFee}
      modules={modules?.filter((m) => m !== null)}
      teamsAndProjects={teamsAndProjects}
    />
  );
}
