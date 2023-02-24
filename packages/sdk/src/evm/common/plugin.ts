import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Abi, AbiSchema, SDKOptions } from "../schema";
import { isFeatureEnabled } from "./feature-detection";
import { fetchContractMetadataFromAddress } from "./metadata-resolver";
import { unique } from "./utils";
import type { ITWRouter } from "@thirdweb-dev/contracts-js";
import RouterABI from "@thirdweb-dev/contracts-js/dist/abis/ITWRouter.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

/**
 * @internal
 */
export async function getCompositePluginABI(
  address: string,
  abi: Abi,
  provider: ethers.providers.Provider,
  options: SDKOptions,
  storage: ThirdwebStorage,
): Promise<Abi> {
  let pluginABIs: Abi[] = [];

  try {
    // check if contract is plugin-pattern
    const isPluginRouter: boolean = isFeatureEnabled(
      AbiSchema.parse(abi),
      "PluginRouter",
    );
    if (isPluginRouter) {
      const contract = new ContractWrapper<ITWRouter>(
        provider,
        address,
        RouterABI,
        options,
      );

      const plugins = await contract.readContract.getAllExtensions();

      // get extension addresses
      const pluginAddresses = plugins.map(
        (item) => item.metadata.implementation,
      );

      // get ABIs of extension contracts
      pluginABIs = await getPluginABI(pluginAddresses, provider, storage);
    }
  } catch (err) {}

  return pluginABIs.length > 0 ? joinABIs([abi, ...pluginABIs]) : abi;
}

/**
 * @internal
 */
async function getPluginABI(
  addresses: string[],
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
): Promise<Abi[]> {
  return (
    await Promise.all(
      addresses.map((address) =>
        fetchContractMetadataFromAddress(address, provider, storage).catch(
          (err) => {
            console.error(`Failed to fetch plug-in for ${address}`, err);
            return { abi: [] };
          },
        ),
      ),
    )
  ).map((metadata) => metadata.abi);
}

/**
 * @internal
 */
export function joinABIs(abis: Abi[]): Abi {
  const parsedABIs = abis.map((abi) => AbiSchema.parse(abi)).flat();

  const filteredABIs = unique(parsedABIs, (a, b): boolean => {
    return (
      a.name === b.name &&
      a.type === b.type &&
      a.inputs.length === b.inputs.length
    );
  });

  const finalABIs = filteredABIs.filter((item) => item.type !== "constructor");

  return AbiSchema.parse(finalABIs);
}
