import { isAddress, type ThirdwebClient } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import {
  fetchLatestPublishedContractVersion,
  fetchPublishedContractVersions,
} from "@/api/contract/fetch-contracts-with-versions";

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

export async function getPublishedContractsWithPublisherMapping(options: {
  publisher: string;
  contract_id: string;
  client: ThirdwebClient;
}) {
  const { publisher, contract_id, client } = options;

  try {
    // resolve ENS
    const publisherAddress = isAddress(publisher)
      ? publisher
      : await resolveAddress({
          client,
          name: mapThirdwebPublisher(publisher),
        });

    // get all the published versions of the contract
    const publishedContractVersions = await fetchPublishedContractVersions(
      publisherAddress,
      contract_id,
      client,
    );

    return publishedContractVersions;
  } catch {
    return undefined;
  }
}

export async function getLatestPublishedContractsWithPublisherMapping(options: {
  publisher: string;
  contract_id: string;
  client: ThirdwebClient;
}) {
  const { publisher, contract_id, client } = options;

  try {
    // resolve ENS
    const publisherAddress = isAddress(publisher)
      ? publisher
      : await resolveAddress({
          client,
          name: mapThirdwebPublisher(publisher),
        });

    return fetchLatestPublishedContractVersion(
      publisherAddress,
      contract_id,
      client,
    );
  } catch {
    return undefined;
  }
}
