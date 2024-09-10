import { Separator } from "@/components/ui/separator";
import { thirdwebClient } from "@/constants/client";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import {
  fetchPublishedContractVersion,
  fetchPublishedContractVersions,
} from "../../../../components/contract-components/fetch-contracts-with-versions";
import { DeployActions } from "./contract-actions-deploy.client";
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
        client: thirdwebClient,
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

  return (
    <>
      <DeployContractHeader
        {...props}
        allVersions={publishedContractVersions}
        activeVersion={publishedContract}
      >
        <DeployActions
          {...props}
          dispayName={publishedContract.displayName || publishedContract.name}
        />
      </DeployContractHeader>
      <Separator />
      <DeployFormForUri
        uri={publishedContract.publishMetadataUri}
        moduleUris={modules
          .filter((m) => m !== null)
          .map((m) => m.publishMetadataUri)}
      />
    </>
  );
}
