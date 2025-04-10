import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { CustomContractForm } from "components/contract-components/contract-deploy-form/custom-contract";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { getAuthToken } from "../../../api/lib/getAuthToken";
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

  const [authToken, teams] = await Promise.all([getAuthToken(), getTeams()]);

  if (!teams || !authToken) {
    loginRedirect(pathname);
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        image: team.image,
      },
      projects: (await getProjects(team.slug)).map((x) => ({
        id: x.id,
        name: x.name,
        image: x.image,
      })),
    })),
  );

  // TODO: remove the `ChakraProviderSetup` wrapper once the form is updated to no longer use chakra
  return (
    <ChakraProviderSetup>
      <CustomContractForm
        metadata={contractMetadata}
        metadataNoFee={contractMetadataNoFee}
        modules={modules?.filter((m) => m !== null)}
        jwt={authToken}
        teamsAndProjects={teamsAndProjects}
      />
    </ChakraProviderSetup>
  );
}
