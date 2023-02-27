import { PREBUILT_CONTRACTS_MAP } from "../contracts";
import { ContractPublisher } from "../core/classes/contract-publisher";
import { getSignerAndProvider } from "../core/classes/rpc-connection-handler";
import { NetworkInput, PrebuiltContractType } from "../core/types";
import { SDKOptions } from "../schema/sdk-options";
import { getContractFromAbi } from "./getContractFromAbi";
import {
  cacheContract,
  cachePublisher,
  getCachedContract,
  getCachedPublisher,
  getCachedStorage,
  inContractCache,
  inPublisherCache,
} from "./utils/cache";
import { resolveContractType } from "./utils/contract";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ContractInterface } from "ethers";

export type GetContractParams = {
  address: string;
  contractTypeOrAbi?: PrebuiltContractType | ContractInterface;
  network: NetworkInput;
  storage?: ThirdwebStorage;
  sdkOptions?: SDKOptions;
};

export async function getContract(params: GetContractParams) {
  const [signer, provider] = getSignerAndProvider(
    params.network,
    params.sdkOptions,
  );
  const chainId = (await provider.getNetwork()).chainId;

  if (inContractCache(params.address, chainId)) {
    return getCachedContract(params.address, chainId);
  }

  if (!params.contractTypeOrAbi || params.contractTypeOrAbi === "custom") {
    const contractType = await resolveContractType({
      address: params.address,
      provider,
    });
    if (contractType === "custom") {
      let publisher: ContractPublisher;
      if (inPublisherCache(chainId)) {
        publisher = getCachedPublisher(chainId);
      } else {
        publisher = new ContractPublisher(
          params.network,
          params.sdkOptions,
          getCachedStorage(params.storage),
        );
        cachePublisher(publisher, chainId);
      }

      const metadata = await publisher.fetchCompilerMetadataFromAddress(
        params.address,
      );
      return getContractFromAbi({ ...params, abi: metadata.abi });
    } else {
      const abi = await PREBUILT_CONTRACTS_MAP[contractType].getAbi(
        params.address,
        provider,
        getCachedStorage(params.storage),
      );
      return getContractFromAbi({ ...params, abi });
    }
  } else if (
    typeof params.contractTypeOrAbi === "string" &&
    params.contractTypeOrAbi in PREBUILT_CONTRACTS_MAP
  ) {
    const contract = await PREBUILT_CONTRACTS_MAP[
      params.contractTypeOrAbi as keyof typeof PREBUILT_CONTRACTS_MAP
    ].initialize(
      signer || provider,
      params.address,
      getCachedStorage(params.storage),
      params.sdkOptions,
    );
    cacheContract(contract, params.address, chainId);
    return contract;
  } else {
    return getContractFromAbi({ ...params, abi: params.contractTypeOrAbi });
  }
}
