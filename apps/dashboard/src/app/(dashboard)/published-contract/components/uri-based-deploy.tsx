import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { thirdwebClient } from "@/constants/client";
import { CustomContractForm } from "components/contract-components/contract-deploy-form/custom-contract";
import { fetchDeployMetadata } from "thirdweb/contract";

type DeployFormForUriProps = {
  uri: string;
  moduleUris?: string[];
};

export async function DeployFormForUri(props: DeployFormForUriProps) {
  const [contractMetadata, ...modules] = await Promise.all([
    fetchDeployMetadata({
      client: thirdwebClient,
      // force `ipfs://` prefix
      uri: props.uri.startsWith("ipfs://") ? props.uri : `ipfs://${props.uri}`,
    }).catch(() => null),
    ...(props.moduleUris || []).map((uri) =>
      fetchDeployMetadata({
        client: thirdwebClient,
        // force `ipfs://` prefix
        uri: uri.startsWith("ipfs://") ? uri : `ipfs://${uri}`,
      }).catch(() => null),
    ),
  ]);

  if (!contractMetadata) {
    return <div>Could not fetch metadata</div>;
  }

  // TODO: remove the `ChakraProviderSetup` wrapper once the form is updated to no longer use chrakra
  return (
    <ChakraProviderSetup>
      <CustomContractForm
        metadata={contractMetadata}
        modules={modules.filter((m) => m !== null)}
      />
    </ChakraProviderSetup>
  );
}
