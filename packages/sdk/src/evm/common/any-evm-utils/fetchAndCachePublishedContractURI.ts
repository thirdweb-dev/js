import { ThirdwebSDK } from "../../core/sdk";
import { THIRDWEB_DEPLOYER } from "./constants";
import { caches } from "./caches";

export async function fetchAndCachePublishedContractURI(
  contractName: string,
): Promise<string> {
  if (caches.uriCache[contractName]) {
    return caches.uriCache[contractName];
  }
  // fetch the publish URI from the ContractPublisher contract
  const publishedContract = await new ThirdwebSDK("polygon")
    .getPublisher()
    .getVersion(THIRDWEB_DEPLOYER, contractName);
  if (!publishedContract) {
    throw new Error(
      `No published contract found for ${contractName} at version by '${THIRDWEB_DEPLOYER}'`,
    );
  }
  const uri = publishedContract.metadataUri;
  caches.uriCache[contractName] = uri;

  return uri;
}
