import { CustomContractForm } from "components/contract-components/contract-deploy-form/custom-contract";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { getUserThirdwebClient } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";

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

  // TODO: remove the `ChakraProviderSetup` wrapper once the form is updated to no longer use chakra
  return (
    <ChakraProviderSetup>
      <CustomContractForm
        client={client}
        isLoggedIn={true}
        metadata={contractMetadata}
        metadataNoFee={contractMetadataNoFee}
        modules={modules?.filter((m) => m !== null)}
        teamsAndProjects={teamsAndProjects}
      />
    </ChakraProviderSetup>
  );
}
