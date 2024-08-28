import { thirdwebClient } from "@/constants/client";
import { isAddress } from "thirdweb";
import { fetchPublishedContract } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import { DeployFormForUri } from "./uri-based-deploy";

type PublishBasedDeployProps = {
  publisher: string;
  contract_id: string;
  version?: string;
};

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

export async function DeployFormForPublishInfo(props: PublishBasedDeployProps) {
  const { publishMetadataUri } = await fetchPublishedContract({
    client: thirdwebClient,
    contractId: props.contract_id,
    publisherAddress: isAddress(props.publisher)
      ? props.publisher
      : await resolveAddress({
          client: thirdwebClient,
          name: mapThirdwebPublisher(props.publisher),
        }),
    version: props.version,
  });

  return <DeployFormForUri uri={publishMetadataUri} />;
}
