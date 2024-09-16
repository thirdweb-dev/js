import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { thirdwebClient } from "@/constants/client";
import { ContractPublishForm } from "components/contract-components/contract-publish-form";
import { setOverrides } from "lib/vercel-utils";
import { revalidatePath } from "next/cache";
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
        <ContractPublishForm
          publishMetadata={publishMetadata}
          onPublishSuccess={async () => {
            "use server";
            // we are pretty brutal here and simply invalidate ALL published contracts (for everyone!) and versions no matter what
            // TODO: we can be more granular here and only invalidate the specific contract and version etc
            revalidatePath(
              "/(dashboard)/published-contract/[publisher]/[contract_id]",
              "layout",
            );
          }}
        />
      </ChakraProviderSetup>
    </div>
  );
}
