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
  const metadata = await fetchDeployMetadata({
    client: thirdwebClient,
    // force `ipfs://` prefix
    uri: props.params.compiler_uri.startsWith("ipfs://")
      ? props.params.compiler_uri
      : `ipfs://${props.params.compiler_uri}`,
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
