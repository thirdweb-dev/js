import { getCompositePluginABI } from "../common/plugin";
import { SmartContract } from "../contracts/smart-contract";
import { getSignerAndProvider } from "../core/classes/rpc-connection-handler";
import { NetworkInput } from "../core/types";
import { AbiSchema } from "../schema/contracts/custom";
import { SDKOptions } from "../schema/sdk-options";
import {
  cacheContract,
  getCachedContract,
  getCachedStorage,
  inContractCache,
} from "./utils/cache";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ContractInterface } from "ethers";

export type GetContractFromAbiParams = {
  address: string;
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
  const chainId = (await provider.getNetwork()).chainId;

  if (inContractCache(params.address, chainId)) {
    return getCachedContract(params.address, chainId) as SmartContract;
  }

  const parsedAbi =
    typeof params.abi === "string" ? JSON.parse(params.abi) : params.abi;
  const contract = new SmartContract(
    signer || provider,
    params.address,
    await getCompositePluginABI(
      params.address,
      AbiSchema.parse(parsedAbi),
      provider,
      params.sdkOptions,
      getCachedStorage(params.storage),
    ),
    getCachedStorage(params.storage),
    params.sdkOptions,
    chainId,
  );

  cacheContract(contract, params.address, chainId);
  return contract;
}
