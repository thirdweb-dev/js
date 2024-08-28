import { thirdwebClient } from "@/constants/client";
import { fetchDeployMetadata } from "thirdweb/contract";
import CustomContractForm from "../../../../components/contract-components/contract-deploy-form/custom-contract";

type DeployFormForUriProps = {
  uri: string;
};

export async function DeployFormForUri(props: DeployFormForUriProps) {
  const contractMetadata = await fetchDeployMetadata({
    client: thirdwebClient,
    // force `ipfs://` prefix
    uri: props.uri.startsWith("ipfs://") ? props.uri : `ipfs://${props.uri}`,
  }).catch(() => null);

  if (!contractMetadata) {
    return <div>Could not fetch metadata</div>;
  }

  return <CustomContractForm metadata={contractMetadata} />;
}
