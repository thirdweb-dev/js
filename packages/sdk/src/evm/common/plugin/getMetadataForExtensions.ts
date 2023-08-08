import { getAllExtensionsAbi } from "../../constants/thirdweb-features";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import {
  AbiSchema,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { isFeatureEnabled } from "../feature-detection/isFeatureEnabled";
import { fetchContractMetadataFromAddress } from "../metadata-resolver";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { getChainProvider } from "../../constants/urls";
import { fetchAndCachePublishedContractURI } from "../any-evm-utils/fetchAndCachePublishedContractURI";
import { fetchAndCacheDeployMetadata } from "../any-evm-utils/fetchAndCacheDeployMetadata";
import { Extension } from "../../types/extensions";

export async function getMetadataForExtensions(
  publishedMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PreDeployMetadataFetched[]> {
  let extensionMetadata: PreDeployMetadataFetched[] = [];

  const { compilerMetadata, extendedMetadata } =
    await fetchAndCacheDeployMetadata(publishedMetadataUri, storage);
  // check if contract is extension-pattern
  const isExtensionRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(compilerMetadata.abi),
    "ExtensionRouter",
  );

  if (isExtensionRouter) {
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
            getAllExtensionsAbi,
            {},
            storage,
          );

          const extensions = await contract.call("getAllExtensions");

          const extensionNames: string[] = Array.from(
            new Set(extensions.map((item: Extension) => item.metadata.name)),
          );

          const extensionUris = await Promise.all(
            extensionNames.map((name) => {
              return fetchAndCachePublishedContractURI(name);
            }),
          );
          extensionMetadata = (
            await Promise.all(
              extensionUris.map(async (uri) => {
                return fetchAndCacheDeployMetadata(uri, storage);
              }),
            )
          ).map((fetchedMetadata) => fetchedMetadata.compilerMetadata);
        }
      } catch {}
    }
  }
  return extensionMetadata;
}
