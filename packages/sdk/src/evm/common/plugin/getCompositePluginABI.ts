import {
  fallbackAbi,
  getAllExtensionsAbi,
  getAllPluginsAbi,
} from "../../constants/thirdweb-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { SDKOptions } from "../../schema/sdk-options";
import { isExtensionEnabled } from "../feature-detection/isFeatureEnabled";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Contract, providers } from "ethers";
import { joinABIs } from "./joinABIs";
import { getPluginABI } from "./getPluginABI";
import { hasMatchingAbi } from "../feature-detection/hasMatchingAbi";

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
    } else {
      // check if the contract has fallback function - in that case we'll further check for diamond pattern
      if (hasMatchingAbi(abi, [fallbackAbi])) {
        // check if diamond pattern
        const dimaondAbi = [
          "function facets() external view returns (tuple(address,bytes4[])[])",
        ];
        const contract = new Contract(address, dimaondAbi, provider);

        // get facets
        const facets = await contract.facets();

        // filter facet addresses
        const facetAddresses = facets.map((item: any) => item[0]);

        // get ABI of facets
        pluginABIs = await getPluginABI(facetAddresses, provider, storage);
      }
    }
  } catch (err) {}

  return pluginABIs.length > 0 ? joinABIs([abi, ...pluginABIs]) : abi;
}
