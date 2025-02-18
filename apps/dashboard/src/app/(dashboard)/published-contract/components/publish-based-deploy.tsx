import { getThirdwebClient } from "@/constants/thirdweb.server";
import {
  fetchPublishedContractVersion,
  fetchPublishedContractVersions,
} from "components/contract-components/fetch-contracts-with-versions";
import { isAddress } from "thirdweb";
import { fetchDeployMetadata } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import { DeployContractHeader } from "./contract-header";
import { DeployFormForUri } from "./uri-based-deploy";

type PublishBasedDeployProps = {
  publisher: string;
  contract_id: string;
  version?: string;
  modules?: Array<{ publisher: string; moduleId: string; version?: string }>;
};

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

export async function DeployFormForPublishInfo(props: PublishBasedDeployProps) {
  const client = getThirdwebClient();
  // resolve ENS if required
  const publisherAddress = isAddress(props.publisher)
    ? props.publisher
    : await resolveAddress({
        client,
        name: mapThirdwebPublisher(props.publisher),
      });

  // get all the published versions of the contract
  const [publishedContractVersions, ...modules] = await Promise.all([
    fetchPublishedContractVersions(publisherAddress, props.contract_id),
    ...(props.modules || []).map((m) =>
      fetchPublishedContractVersion(m.publisher, m.moduleId, m.version),
    ),
  ]);

  // determine the "active" version of the contract based on the version that is passed
  const publishedContract =
    publishedContractVersions.find((v) => v.version === props.version) ||
    publishedContractVersions[0];

  if (!publishedContract) {
    return null;
  }

  const moduleUris = modules
    .filter((m) => m !== null && m !== undefined)
    .map((m) => m.publishMetadataUri);
  const [contractMetadata, ...fetchedModules] = await Promise.all([
    fetchDeployMetadata({
      client,
      // force `ipfs://` prefix
      uri: publishedContract.publishMetadataUri.startsWith("ipfs://")
        ? publishedContract.publishMetadataUri
        : `ipfs://${publishedContract.publishMetadataUri}`,
    }).catch(() => null),
    ...(moduleUris || []).map((uri) =>
      fetchDeployMetadata({
        client,
        // force `ipfs://` prefix
        uri: uri.startsWith("ipfs://") ? uri : `ipfs://${uri}`,
      }).catch(() => null),
    ),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 pb-20">
      <DeployContractHeader
        {...props}
        allVersions={publishedContractVersions}
        activeVersion={publishedContract}
      />
      <DeployFormForUri
        contractMetadata={contractMetadata}
        modules={fetchedModules.filter((m) => m !== null)}
        pathname={`/${props.publisher}/${props.contract_id}${props.version ? `/${props.version}` : ""}/deploy`}
      />
    </div>
  );
}
