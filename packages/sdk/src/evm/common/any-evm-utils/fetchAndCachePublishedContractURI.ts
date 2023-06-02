import { Contract } from "ethers";
import ContractPublisherAbi from "@thirdweb-dev/contracts-js/dist/abis/ContractPublisher.json";
import type { ContractPublisher } from "@thirdweb-dev/contracts-js";
import { getContractPublisherAddress } from "../../constants/addresses/getContractPublisherAddress";
import { getChainProvider } from "../../constants/urls";

const uriCache: Record<string, string> = {};

const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

export async function fetchAndCachePublishedContractURI(
  contractName: string,
): Promise<string> {
  if (uriCache[contractName]) {
    return uriCache[contractName];
  }

  const contract = new Contract(
    getContractPublisherAddress(),
    ContractPublisherAbi,
    getChainProvider("polygon", {}),
  ) as ContractPublisher;

  const model = await contract.getPublishedContract(
    THIRDWEB_DEPLOYER,
    contractName,
  );

  if (!model) {
    throw new Error(
      `No published contract found for ${contractName} at version by '${THIRDWEB_DEPLOYER}'`,
    );
  }

  const uri = model.publishMetadataUri;
  uriCache[contractName] = uri;

  return uri;
}
