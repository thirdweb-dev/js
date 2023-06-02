import { getAllPluginsAbi } from "../../constants/thirdweb-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import {
  AbiSchema,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { isFeatureEnabled } from "../feature-detection/isFeatureEnabled";
import { fetchContractMetadataFromAddress } from "../metadata-resolver";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Plugin } from "../../types/plugins";
import { getChainProvider } from "../../constants/urls";
import { fetchAndCachePublishedContractURI } from "../any-evm-utils/fetchAndCachePublishedContractURI";
import { fetchAndCacheDeployMetadata } from "../any-evm-utils/fetchAndCacheDeployMetadata";

export async function getMetadataForPlugins(
  publishedMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PreDeployMetadataFetched[]> {
  let pluginMetadata: PreDeployMetadataFetched[] = [];

  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishedMetadataUri, storage);
  // check if contract is plugin-pattern
  const isPluginRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(compilerMetadata.abi),
    "PluginRouter",
  );

  if (isPluginRouter) {
    if (
      extendedMetadata &&
      extendedMetadata.factoryDeploymentData?.implementationAddresses
    ) {
      const implementationsAddresses = Object.entries(
        extendedMetadata.factoryDeploymentData.implementationAddresses,
      );

      try {
        const entry = implementationsAddresses.find(
          ([, implementation]) => implementation !== "",
        );
        const [network, implementation] = entry ? entry : [];
        if (network && implementation) {
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
              return fetchAndCachePublishedContractURI(name);
            }),
          );
          pluginMetadata = (
            await Promise.all(
              pluginUris.map(async (uri) => {
                return fetchAndCacheDeployMetadata(uri, storage);
              }),
            )
          ).map((fetchedMetadata) => fetchedMetadata.compilerMetadata);
        }
      } catch {}
    }
  }
  return pluginMetadata;
}
