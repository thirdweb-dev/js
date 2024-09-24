import { getThirdwebClient } from "@/constants/thirdweb.server";
import { fetchDeployMetadata } from "thirdweb/contract";
import { DeployContractInfo } from "../../../published-contract/components/contract-info";
import { DeployFormForUri } from "../../../published-contract/components/uri-based-deploy";

type DirectDeployPageProps = {
  params: {
    compiler_uri: string;
  };
};

export default async function DirectDeployPage(props: DirectDeployPageProps) {
  const parsedUri = decodeURIComponent(props.params.compiler_uri);
  const metadata = await fetchDeployMetadata({
    client: getThirdwebClient(),
    // force `ipfs://` prefix
    uri: parsedUri.startsWith("ipfs://") ? parsedUri : `ipfs://${parsedUri}`,
  });
  return (
    <div className="container flex flex-col gap-4 py-8">
      <DeployContractInfo
        name={metadata.name}
        displayName={metadata.displayName}
        description={metadata.description}
        logo={metadata.logo}
      />
      <DeployFormForUri
        contractMetadata={metadata}
        modules={null}
        pathname={`/contracts/deploy/${props.params.compiler_uri}`}
      />
    </div>
  );
}
