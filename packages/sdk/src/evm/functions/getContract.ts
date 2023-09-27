import { resolveAddress } from "../common/ens/resolveAddress";
import { PREBUILT_CONTRACTS_MAP } from "../contracts";
import { SmartContract } from "../contracts/smart-contract";
import { ContractPublisher } from "../core/classes/contract-publisher";
import { NetworkInput } from "../core/types";
import {
  ContractForPrebuiltContractType,
  PrebuiltContractType,
} from "../contracts";
import { AddressOrEns } from "../schema/shared/AddressOrEnsSchema";
import { SDKOptions } from "../schema/sdk-options";
import { getContractFromAbi } from "./getContractFromAbi";
import { getSignerAndProvider } from "../constants/urls";
import {
  cacheContract,
  getCachedContract,
  getCachedStorage,
  inContractCache,
} from "./utils/cache";
import { resolveContractType } from "./utils/contract";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { ContractInterface } from "ethers";

export type GetContractParams<TContractType extends PrebuiltContractType> = {
  address: AddressOrEns;
  contractTypeOrAbi?: PrebuiltContractType | ContractInterface | TContractType;
  network: NetworkInput;
  storage?: ThirdwebStorage;
  sdkOptions?: SDKOptions;
};

type ReturnedContractType<TContractType extends PrebuiltContractType> =
  TContractType extends PrebuiltContractType
    ? ContractForPrebuiltContractType<TContractType>
    : SmartContract;

export async function getContract<TContractType extends PrebuiltContractType>(
  params: GetContractParams<TContractType>,
): Promise<ReturnedContractType<TContractType>> {
  const [signer, provider] = getSignerAndProvider(
    params.network,
    params.sdkOptions,
  );
  const [resolvedAddress, { chainId }] = await Promise.all([
    resolveAddress(params.address),
    provider.getNetwork(),
  ]);

  if (inContractCache(resolvedAddress, chainId)) {
    return getCachedContract(
      resolvedAddress,
      chainId,
    ) as ReturnedContractType<TContractType>;
  }

  if (!params.contractTypeOrAbi || params.contractTypeOrAbi === "custom") {
    const contractType = await resolveContractType({
      address: resolvedAddress,
      provider,
    });
    if (contractType === "custom") {
      const publisher = new ContractPublisher(
        params.network,
        params.sdkOptions,
        getCachedStorage(params.storage),
      );

      try {
        const metadata = await publisher.fetchCompilerMetadataFromAddress(
          resolvedAddress,
        );
        return getContractFromAbi({
          ...params,
          address: resolvedAddress,
          abi: metadata.abi,
        }) as ReturnedContractType<TContractType>;
      } catch {
        throw new Error(
          `No ABI found for this contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${resolvedAddress}`,
        );
      }
    } else {
      const abi = await PREBUILT_CONTRACTS_MAP[contractType].getAbi(
        resolvedAddress,
        provider,
        getCachedStorage(params.storage),
      );
      return getContractFromAbi({
        ...params,
        address: resolvedAddress,
        abi,
      }) as ReturnedContractType<TContractType>;
    }
  } else if (
    typeof params.contractTypeOrAbi === "string" &&
    params.contractTypeOrAbi in PREBUILT_CONTRACTS_MAP
  ) {
    const contract = await PREBUILT_CONTRACTS_MAP[
      params.contractTypeOrAbi as keyof typeof PREBUILT_CONTRACTS_MAP
    ].initialize(
      signer || provider,
      resolvedAddress,
      getCachedStorage(params.storage),
      params.sdkOptions,
    );
    cacheContract(contract, resolvedAddress, chainId);
    return contract as ReturnedContractType<TContractType>;
  } else {
    return getContractFromAbi({
      ...params,
      address: resolvedAddress,
      abi: params.contractTypeOrAbi,
    }) as ReturnedContractType<TContractType>;
  }
}
