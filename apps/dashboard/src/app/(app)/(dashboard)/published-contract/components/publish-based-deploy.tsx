import { isAddress } from "thirdweb";
import { fetchDeployMetadata } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import {
  fetchPublishedContractVersion,
  fetchPublishedContractVersions,
} from "@/components/contract-components/fetch-contracts-with-versions";
import { ZERO_FEE_VERSIONS } from "@/constants/fee-config";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { PublishedContractBreadcrumbs } from "../[publisher]/[contract_id]/components/breadcrumbs.client";
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
  // resolve ENS if required
  const publisherAddress = isAddress(props.publisher)
    ? props.publisher
    : await resolveAddress({
        client: serverThirdwebClient,
        name: mapThirdwebPublisher(props.publisher),
      });

  // get all the published versions of the contract
  const [publishedContractVersions, ...modules] = await Promise.all([
    fetchPublishedContractVersions(
      publisherAddress,
      props.contract_id,
      serverThirdwebClient,
    ),
    ...(props.modules || []).map((m) =>
      fetchPublishedContractVersion(
        m.publisher,
        m.moduleId,
        serverThirdwebClient,
        m.version,
      ),
    ),
  ]);

  // determine the "active" version of the contract based on the version that is passed
  const publishedContract =
    publishedContractVersions.find((v) => v.version === props.version) ||
    publishedContractVersions[0];

  const publishedContractNoFee = publishedContractVersions.find(
    (v) => v.version === ZERO_FEE_VERSIONS[v.name],
  );

  if (!publishedContract) {
    return null;
  }

  const moduleUris = modules
    .filter((m) => m !== null && m !== undefined)
    .map((m) => m.publishMetadataUri);
  const [contractMetadata, contractMetadataNoFee, ...fetchedModules] =
    await Promise.all([
      fetchDeployMetadata({
        client: serverThirdwebClient,
        // force `ipfs://` prefix
        uri: publishedContract.publishMetadataUri.startsWith("ipfs://")
          ? publishedContract.publishMetadataUri
          : `ipfs://${publishedContract.publishMetadataUri}`,
      }).catch(() => null),
      fetchDeployMetadata({
        client: serverThirdwebClient,
        // force `ipfs://` prefix
        uri: publishedContractNoFee?.publishMetadataUri.startsWith("ipfs://")
          ? publishedContractNoFee.publishMetadataUri
          : `ipfs://${publishedContractNoFee?.publishMetadataUri}`,
      }).catch(() => null),
      ...(moduleUris || []).map((uri) =>
        fetchDeployMetadata({
          client: serverThirdwebClient,
          // force `ipfs://` prefix
          uri: uri.startsWith("ipfs://") ? uri : `ipfs://${uri}`,
        }).catch(() => null),
      ),
    ]);

  return (
    <div>
      <div className="border-border border-b border-dashed">
        <PublishedContractBreadcrumbs className="container max-w-5xl" />
      </div>

      <div className="border-b">
        <DeployContractHeader
          {...props}
          activeVersion={publishedContract}
          allVersions={publishedContractVersions}
          className="container max-w-5xl"
        />
      </div>

      <div className="container max-w-5xl py-8">
        <DeployFormForUri
          contractMetadata={contractMetadata}
          contractMetadataNoFee={contractMetadataNoFee}
          modules={fetchedModules.filter((m) => m !== null)}
          pathname={`/${props.publisher}/${props.contract_id}${props.version ? `/${props.version}` : ""}/deploy`}
        />
      </div>
    </div>
  );
}
