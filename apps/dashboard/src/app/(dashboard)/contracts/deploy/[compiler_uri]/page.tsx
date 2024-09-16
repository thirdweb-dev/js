import { setOverrides } from "lib/vercel-utils";
import { fetchDeployMetadata } from "thirdweb/contract";
import { thirdwebClient } from "../../../../../@/constants/client";
import { DeployContractInfo } from "../../../published-contract/components/contract-info";
import { DeployFormForUri } from "../../../published-contract/components/uri-based-deploy";

setOverrides();

type DirectDeployPageProps = {
  params: {
    compiler_uri: string;
  };
};

export default async function DirectDeployPage(props: DirectDeployPageProps) {
  const parsedUri = decodeURIComponent(props.params.compiler_uri);
  const metadata = await fetchDeployMetadata({
    client: thirdwebClient,
    // force `ipfs://` prefix
    uri: parsedUri.startsWith("ipfs://") ? parsedUri : `ipfs://${parsedUri}`,
  });
  return (
    <div className="container py-8 flex flex-col gap-4">
      <DeployContractInfo
        name={metadata.name}
        displayName={metadata.displayName}
        description={metadata.description}
        logo={metadata.logo}
      />
      <DeployFormForUri contractMetadata={metadata} modules={null} />
    </div>
  );
}
