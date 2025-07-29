import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";
import { getUserThirdwebClient } from "@/api/auth-token";
import { ContractPublishForm } from "@/components/contract-components/contract-publish-form";
import { getActiveAccountCookie, getJWTCookie } from "@/constants/cookie";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { getLatestPublishedContractsWithPublisherMapping } from "../../../published-contract/[publisher]/[contract_id]/utils/getPublishedContractsWithPublisherMapping";

type DirectDeployPageProps = {
  params: Promise<{
    publish_uri: string;
  }>;
};

export default async function PublishContractPage(
  props: DirectDeployPageProps,
) {
  const params = await props.params;
  const decodedPublishUri = decodeURIComponent(params.publish_uri);
  const publishUri = decodedPublishUri.startsWith("ipfs://")
    ? decodedPublishUri
    : `ipfs://${decodedPublishUri}`;

  const publishMetadataFromUri = await fetchDeployMetadata({
    client: serverThirdwebClient,
    uri: publishUri,
  }).catch(() => null);

  if (!publishMetadataFromUri) {
    notFound();
  }

  let publishMetadata = publishMetadataFromUri;

  const pathname = `/contracts/publish/${params.publish_uri}`;

  const address = await getActiveAccountCookie();
  if (!address) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  // Deploying the next version of a contract scenario:
  // check if this is a pre-deployed metadata ( doesn't have a version )
  // If that's the case:
  // - get the publish metadata with name+publisher address
  // - merge the two objects with publishMetadataFromUri taking higher precedence
  if (!publishMetadataFromUri.version) {
    const publishedContract =
      await getLatestPublishedContractsWithPublisherMapping({
        client: serverThirdwebClient,
        contract_id: publishMetadataFromUri.name,
        publisher: address,
      });

    if (publishedContract) {
      publishMetadata = {
        ...publishedContract,
        ...publishMetadataFromUri,
        version: publishedContract.version,
      };
    }
  }

  const token = await getJWTCookie(address);
  if (!token) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  const userThirdwebClient = await getUserThirdwebClient({
    teamId: undefined,
  });

  return (
    <div className="container flex max-w-[1130px] flex-col gap-8 py-8">
      <ContractPublishForm
        client={userThirdwebClient}
        isLoggedIn={!!token}
        onPublishSuccess={async () => {
          "use server";
          // we are pretty brutal here and simply invalidate ALL published contracts (for everyone!) and versions no matter what
          // TODO: we can be more granular here and only invalidate the specific contract and version etc
          revalidatePath(
            "/(dashboard)/published-contract/[publisher]/[contract_id]",
            "layout",
          );
        }}
        publishMetadata={publishMetadata}
      />
    </div>
  );
}
