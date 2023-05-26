import { ThirdwebSDK } from "../../core/sdk";

const uriCache: Record<string, string> = {};

const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

export async function fetchAndCachePublishedContractURI(
  contractName: string,
): Promise<string> {
  if (uriCache[contractName]) {
    return uriCache[contractName];
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
  uriCache[contractName] = uri;

  return uri;
}
