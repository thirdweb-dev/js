import { getCompositePluginABI } from "../../common/plugin";
import { PREBUILT_CONTRACTS_MAP } from "../../contracts";
import { SmartContract } from "../../contracts/smart-contract";
import { ContractPublisher } from "../../core/classes/contract-publisher";
import { getSignerAndProvider } from "../../core/classes/rpc-connection-handler";
import { ValidContractInstance } from "../../core/types";
import { AbiSchema } from "../../schema/contracts/custom";
import {
  cacheContract,
  getCachedContract,
  getCachedStorage,
  inContractCache,
} from "../core/cache";
import { GetContractFromAbiParams, GetContractParams } from "./types";
import { resolveContractType } from "./utils";

export async function getContractFromAbi(
  params: GetContractFromAbiParams,
): Promise<ValidContractInstance> {
  if (inContractCache(params.address)) {
    return getCachedContract(params.address);
  }

  // TODO: Remove support for SDKOptions
  const [signer, provider] = getSignerAndProvider(
    params.network,
    params.sdkOptions,
  );

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
    (await provider.getNetwork()).chainId,
  );

  cacheContract(params.address, contract);
  return contract;
}

export async function getContract(params: GetContractParams) {
  if (inContractCache(params.address)) {
    return getCachedContract(params.address);
  }

  const [signer, provider] = getSignerAndProvider(
    params.network,
    params.sdkOptions,
  );

  if (!params.contractTypeOrAbi || params.contractTypeOrAbi === "custom") {
    const contractType = await resolveContractType({
      address: params.address,
      provider,
    });
    if (contractType === "custom") {
      // Not even worth cacheing publisher since we would have to cache by network, which requires an RPC call
      const publisher = new ContractPublisher(
        params.network,
        params.sdkOptions,
        getCachedStorage(params.storage),
      );
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
    cacheContract(params.address, contract);
    return contract;
  } else {
    return getContractFromAbi({ ...params, abi: params.contractTypeOrAbi });
  }
}
