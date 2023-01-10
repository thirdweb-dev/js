import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Abi, AbiSchema, SDKOptions } from "../schema";
import {
  fetchContractMetadataFromAddress,
  isFeatureEnabled,
} from "./feature-detection";
import { unique } from "./utils";
import { IRouter } from "@thirdweb-dev/contracts-js";
import RouterABI from "@thirdweb-dev/contracts-js/dist/abis/Router.json";
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
      const contract = new ContractWrapper<IRouter>(
        provider,
        address,
        RouterABI,
        options,
      );

      const pluginMap = await contract.readContract.getAllPlugins();

      // get extension addresses
      const allPlugins = pluginMap.map((item) => item.pluginAddress);
      const plugins = Array.from(new Set(allPlugins));

      // get ABIs of extension contracts
      pluginABIs = await getPluginABI(plugins, provider, storage);
    }
  } catch (err) {}

  // join all ABIs -- entrypoint + extension
  let finalPlugins = await joinABIs([abi, ...pluginABIs]);

  return finalPlugins;
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

  return AbiSchema.parse(filteredABIs);
}
