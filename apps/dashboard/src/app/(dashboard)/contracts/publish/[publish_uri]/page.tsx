import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { thirdwebClient } from "@/constants/client";
import { ContractPublishForm } from "components/contract-components/contract-publish-form";
import { setOverrides } from "lib/vercel-utils";
import { fetchDeployMetadata } from "thirdweb/contract";

setOverrides();

type DirectDeployPageProps = {
  params: {
    publish_uri: string;
  };
};

export default async function PublishContractPage(
  props: DirectDeployPageProps,
) {
  const decodedPublishUri = decodeURIComponent(props.params.publish_uri);
  const publishUri = decodedPublishUri.startsWith("ipfs://")
    ? decodedPublishUri
    : `ipfs://${decodedPublishUri}`;

  const publishMetadata = await fetchDeployMetadata({
    uri: publishUri,
    client: thirdwebClient,
  });

  return (
    <div className="container py-8 flex flex-col gap-8">
      <ChakraProviderSetup>
        <ContractPublishForm publishMetadata={publishMetadata} />
      </ChakraProviderSetup>
    </div>
  );
}
