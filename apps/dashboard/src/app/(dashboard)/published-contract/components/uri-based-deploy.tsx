import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { CustomContractForm } from "components/contract-components/contract-deploy-form/custom-contract";
import type { FetchDeployMetadataResult } from "thirdweb/contract";

type DeployFormForUriProps = {
  contractMetadata: FetchDeployMetadataResult | null;
  modules: FetchDeployMetadataResult[] | null;
};

export async function DeployFormForUri(props: DeployFormForUriProps) {
  const { contractMetadata, modules } = props;

  if (!contractMetadata) {
    return <div>Could not fetch metadata</div>;
  }

  // TODO: remove the `ChakraProviderSetup` wrapper once the form is updated to no longer use chrakra
  return (
    <ChakraProviderSetup>
      <CustomContractForm
        metadata={contractMetadata}
        modules={modules?.filter((m) => m !== null)}
      />
    </ChakraProviderSetup>
  );
}
