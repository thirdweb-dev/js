import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { getActiveAccountCookie, getJWTCookie } from "@/constants/cookie";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { ContractPublishForm } from "components/contract-components/contract-publish-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";

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
    client: getThirdwebClient(),
  });

  const pathname = `/contracts/publish/${props.params.publish_uri}`;

  const address = getActiveAccountCookie();
  if (!address) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  const token = getJWTCookie(address);
  if (!token) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="container py-8 flex flex-col gap-8">
      <ChakraProviderSetup>
        <ContractPublishForm
          jwt={token}
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
