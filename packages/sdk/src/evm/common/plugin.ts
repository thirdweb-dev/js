import {
  getAllExtensionsAbi,
  getAllPluginsAbi,
} from "../constants/thirdweb-features";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Abi, AbiSchema, Address, SDKOptions } from "../schema";
import { isFeatureEnabled } from "./feature-detection";
import { fetchContractMetadataFromAddress } from "./metadata-resolver";
import { unique } from "./utils";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils.js";

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
    const isExtensionRouter: boolean = isFeatureEnabled(
      AbiSchema.parse(abi),
      "ExtensionRouter",
    );
    if (isExtensionRouter) {
      const contract = new ContractWrapper(
        provider,
        address,
        getAllExtensionsAbi,
        options,
      );

      const plugins = await contract.call("getAllExtensions");

      // get extension addresses
      const pluginAddresses = plugins.map(
        (item: any) => item.metadata.implementation,
      );

      // get ABIs of extension contracts --
      pluginABIs = await getPluginABI(pluginAddresses, provider, storage);
    } else if (isPluginRouter) {
      const contract = new ContractWrapper(
        provider,
        address,
        getAllPluginsAbi,
        options,
      );

      const pluginMap = await contract.call("getAllPlugins");

      // get extension addresses
      const allPlugins = pluginMap.map((item: any) => item.pluginAddress);
      const plugins = Array.from(new Set(allPlugins));

      // get ABIs of extension contracts
      pluginABIs = await getPluginABI(plugins as any[], provider, storage);
    }
  } catch (err) {}

  return pluginABIs.length > 0 ? joinABIs([abi, ...pluginABIs]) : abi;
}

export function isRouterContract(abi: Abi) {
  const isPluginRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "PluginRouter",
  );
  const isExtensionRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "ExtensionRouter",
  );
  return isExtensionRouter || isPluginRouter;
}

/**
 * @internal
 */
async function getPluginABI(
  addresses: Address[],
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
