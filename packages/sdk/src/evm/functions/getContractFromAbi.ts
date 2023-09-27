import { resolveAddress } from "../common/ens/resolveAddress";
import { getCompositePluginABI } from "../common/plugin/getCompositePluginABI";
import { SmartContract } from "../contracts/smart-contract";
import { NetworkInput } from "../core/types";
import { AddressOrEns } from "../schema/shared/AddressOrEnsSchema";
import { AbiSchema } from "../schema/contracts/custom";
import { SDKOptions } from "../schema/sdk-options";
import { getSignerAndProvider } from "../constants/urls";
import {
  cacheContract,
  getCachedContract,
  getCachedStorage,
  inContractCache,
} from "./utils/cache";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { ContractInterface } from "ethers";

export type GetContractFromAbiParams = {
  address: AddressOrEns;
  abi: ContractInterface;
  network: NetworkInput;
  storage?: ThirdwebStorage;
  sdkOptions?: SDKOptions;
};

export async function getContractFromAbi(
  params: GetContractFromAbiParams,
): Promise<SmartContract> {
  const [signer, provider] = getSignerAndProvider(
    params.network,
    params.sdkOptions,
  );
  const [resolvedAddress, {chainId}] = await Promise.all([
    resolveAddress(params.address),
    provider.getNetwork()
  ]);

  if (inContractCache(resolvedAddress, chainId)) {
    return getCachedContract(resolvedAddress, chainId) as SmartContract;
  }

  const parsedAbi =
    typeof params.abi === "string" ? JSON.parse(params.abi) : params.abi;
  const contract = new SmartContract(
    signer || provider,
    resolvedAddress,
    await getCompositePluginABI(
      resolvedAddress,
      AbiSchema.parse(parsedAbi),
      provider,
      params.sdkOptions,
      getCachedStorage(params.storage),
    ),
    getCachedStorage(params.storage),
    params.sdkOptions,
    chainId,
  );

  cacheContract(contract, resolvedAddress, chainId);
  return contract;
}
