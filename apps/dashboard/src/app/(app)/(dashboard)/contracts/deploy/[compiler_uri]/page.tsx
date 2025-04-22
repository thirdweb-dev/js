import { notFound } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";
import { getUserThirdwebClient } from "../../../../api/lib/getAuthToken";
import { DeployContractInfo } from "../../../published-contract/components/contract-info";
import { DeployFormForUri } from "../../../published-contract/components/uri-based-deploy";

type DirectDeployPageProps = {
  params: Promise<{
    compiler_uri: string;
  }>;
};

export default async function DirectDeployPage(props: DirectDeployPageProps) {
  const params = await props.params;
  const parsedUri = decodeURIComponent(params.compiler_uri);
  const client = await getUserThirdwebClient();

  const metadata = await fetchDeployMetadata({
    client,
    // force `ipfs://` prefix
    uri: parsedUri.startsWith("ipfs://") ? parsedUri : `ipfs://${parsedUri}`,
  }).catch(() => null);

  if (!metadata) {
    notFound();
  }

  return (
    <div className="container flex flex-col gap-4 py-8">
      <DeployContractInfo
        name={metadata.name}
        displayName={metadata.displayName}
        description={metadata.description}
        logo={metadata.logo}
        client={client}
      />
      <DeployFormForUri
        contractMetadata={metadata}
        contractMetadataNoFee={metadata}
        modules={null}
        pathname={`/contracts/deploy/${params.compiler_uri}`}
      />
    </div>
  );
}
