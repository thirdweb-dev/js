import {
  getAllExtensionsAbi,
  getAllPluginsAbi,
} from "../constants/thirdweb-features";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import {
  Abi,
  AbiSchema,
  Address,
  PreDeployMetadataFetched,
  SDKOptions,
} from "../schema";
import {
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
  isFeatureEnabled,
} from "./feature-detection";
import { fetchContractMetadataFromAddress } from "./metadata-resolver";
import { unique } from "./utils";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import { Plugin } from "../types/plugins";
import { getChainProvider } from "../constants";
import { fetchPublishedContractURI } from "./any-evm-utils";

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

export async function getMetadataForPlugins(
  publishedMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PreDeployMetadataFetched[]> {
  const extendedMetadata = await fetchExtendedReleaseMetadata(
    publishedMetadataUri,
    storage,
  );

  let pluginMetadata: PreDeployMetadataFetched[] = [];

  if (extendedMetadata.factoryDeploymentData?.implementationAddresses) {
    const implementationsAddresses = Object.entries(
      extendedMetadata.factoryDeploymentData.implementationAddresses,
    );

    try {
      for (const [network, implementation] of implementationsAddresses) {
        if (implementation !== "") {
          const provider = getChainProvider(parseInt(network), {});
          const contract = new ContractWrapper(
            provider,
            implementation,
            getAllPluginsAbi,
            {},
          );

          const pluginMap = await contract.call("getAllPlugins");

          // get extension addresses
          const allPlugins = pluginMap.map(
            (item: Plugin) => item.pluginAddress,
          );
          const pluginAddresses = Array.from(new Set(allPlugins));

          const pluginNames = (
            await Promise.all(
              pluginAddresses.map(async (address) => {
                const metadata = fetchContractMetadataFromAddress(
                  address as string,
                  provider,
                  storage,
                );
                return metadata;
              }),
            )
          ).map((metadata) => metadata.name);

          const pluginUris = await Promise.all(
            pluginNames.map((name) => {
              return fetchPublishedContractURI(name);
            }),
          );
          pluginMetadata = await Promise.all(
            pluginUris.map((uri) => {
              return fetchPreDeployMetadata(uri, storage);
            }),
          );

          break;
        }
      }
    } catch {}
  }
  return pluginMetadata;
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

const getFunctionSignature = (fnInputs: any): string => {
  return (
    "(" +
    fnInputs
      .map((i: any) => {
        return i.type === "tuple" ? getFunctionSignature(i.components) : i.type;
      })
      .join(",") +
    ")"
  );
};

export const generatePluginFunctions = (
  pluginAddress: string,
  pluginAbi: Abi,
): Plugin[] => {
  const pluginInterface = new ethers.utils.Interface(pluginAbi);
  const pluginFunctions: Plugin[] = [];
  // TODO - filter out common functions like _msgSender(), contractType(), etc.
  for (const fnFragment of Object.values(pluginInterface.functions)) {
    const fn = pluginInterface.getFunction(fnFragment.name);
    if (fn.name.includes("_")) {
      continue;
    }
    pluginFunctions.push({
      functionSelector: pluginInterface.getSighash(fn),
      functionSignature: fn.name + getFunctionSignature(fn.inputs),
      pluginAddress: pluginAddress,
    });
  }
  return pluginFunctions;
};
