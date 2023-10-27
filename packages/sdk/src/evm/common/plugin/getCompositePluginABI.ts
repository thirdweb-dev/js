import {
  getAllExtensionsAbi,
  getAllPluginsAbi,
} from "../../constants/thirdweb-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { isExtensionEnabled } from "../feature-detection/isFeatureEnabled";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import { joinABIs } from "./joinABIs";
import { getPluginABI } from "./getPluginABI";

/**
 * @internal
 */
export async function getCompositeABI(
  address: string,
  abi: Abi,
  provider: providers.Provider,
  options: SDKOptions,
  storage: ThirdwebStorage,
): Promise<Abi> {
  let pluginABIs: Abi[] = [];

  try {
    // check if contract is plugin-pattern
    const isPluginRouter: boolean = isExtensionEnabled(
      AbiSchema.parse(abi),
      "PluginRouter",
    );
    const isbaseRouter: boolean = isExtensionEnabled(
      AbiSchema.parse(abi),
      "DynamicContract",
    );
    if (isbaseRouter) {
      const contract = new ContractWrapper(
        provider,
        address,
        getAllExtensionsAbi,
        options,
        storage,
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
        storage,
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
