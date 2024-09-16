import { thirdwebClient } from "@/constants/client";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { fetchPublishedContractVersions } from "../../../../../../components/contract-components/fetch-contracts-with-versions";

function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }
  return publisher;
}

export async function getPublishedContractsWithPublisherMapping(options: {
  publisher: string;
  contract_id: string;
}) {
  const { publisher, contract_id } = options;

  // resolve ENS
  const publisherAddress = isAddress(publisher)
    ? publisher
    : await resolveAddress({
        client: thirdwebClient,
        name: mapThirdwebPublisher(publisher),
      });

  // get all the published versions of the contract
  const publishedContractVersions = await fetchPublishedContractVersions(
    publisherAddress,
    contract_id,
  );

  return publishedContractVersions;
}
