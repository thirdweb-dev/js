import { Abi, PublishedMetadata } from "../schema/contracts/custom";
import { Address } from "../schema/shared/Address";
import { resolveContractUriAndBytecode } from "./feature-detection/resolveContractUriFromAddress";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Contract, providers } from "ethers";
import { fetchContractMetadata } from "./fetchContractMetadata";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryLogic.json";
import { getMultichainRegistryAddress } from "../constants/addresses/getMultichainRegistryAddress";
import { getChainProvider } from "../constants/urls";
import type { TWMultichainRegistryLogic } from "@thirdweb-dev/contracts-js";
import { constructAbiFromBytecode } from "./feature-detection/getAllDetectedFeatures";
import { SDKOptions } from "../schema";
import { Polygon } from "@thirdweb-dev/chains";

// Internal static cache
const metadataCache: Record<string, PublishedMetadata> = {};
let multichainRegistry: Contract | undefined = undefined;

function getCacheKey(address: string, chainId: number) {
  return `${address}-${chainId}`;
}

function putInCache(
  address: string,
  chainId: number,
  metadata: PublishedMetadata,
) {
  metadataCache[getCacheKey(address, chainId)] = metadata;
}

function getFromCache(address: string, chainId: number) {
  return metadataCache[getCacheKey(address, chainId)];
}

/**
 * @internal
 * @param address
 * @param provider
 * @param storage
 */
export async function fetchContractMetadataFromAddress(
  address: Address,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  sdkOptions: SDKOptions = {},
): Promise<PublishedMetadata> {
  const chainId = (await provider.getNetwork()).chainId; // TODO resolve from sdk network
  const cached = getFromCache(address, chainId);
  if (cached) {
    return cached;
  }
  let metadata: PublishedMetadata | undefined;

  // we can't race here, because the contract URI might resolve first with a non pinned URI
  const [ipfsData, registryData] = await Promise.all([
    resolveContractUriAndBytecode(address, provider).catch(() => undefined),
    getMetadataUriFromMultichainRegistry(address, chainId, sdkOptions)
      .then((uri) => {
        if (!uri) {
          return undefined;
        }
        return {
          uri,
          bytecode: "",
        };
      })
      .catch(() => undefined),
  ]);
  const bytecode = ipfsData?.bytecode;
  const metadataUri = registryData?.uri || ipfsData?.uri;
  if (!metadataUri && !bytecode) {
    throw new Error(
      `Could not fetch bytecode for contract at ${address} on chain ${chainId}, double check that the address and chainId are correct.`,
    );
  }
  try {
    metadata = await fetchContractMetadata(metadataUri, storage);
  } catch (e) {
    // Don't warn here, its common to not have IPFS metadata for a contract, fallback to bytecode
  }

  if (!metadata && bytecode) {
    const abi = constructAbiFromBytecode(bytecode);
    if (abi && abi.length > 0) {
      console.warn(
        `Contract metadata could only be partially resolved, some contract functions might be unavailable. Try importing the contract by visiting: https://thirdweb.com/${chainId}/${address}`,
      );
      // return partial ABI
      metadata = {
        name: "Unimported Contract",
        abi: abi as Abi,
        metadata: {},
        info: {},
        licenses: [],
        isPartialAbi: true,
      };
      // return without caching
      return metadata;
    }
  }

  if (!metadata) {
    throw new Error(
      `Could not resolve contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${address}`,
    );
  }
  putInCache(address, chainId, metadata);
  return metadata;
}

async function getMetadataUriFromMultichainRegistry(
  address: string,
  chainId: number,
  sdkOptions: SDKOptions,
) {
  if (!multichainRegistry) {
    const polygonChain = sdkOptions?.supportedChains?.find(
      (c) => c.chainId === 137,
    );
    const chain = polygonChain || Polygon;
    multichainRegistry = new Contract(
      getMultichainRegistryAddress(),
      TWRegistryABI,
      getChainProvider(chain, sdkOptions),
    ) as TWMultichainRegistryLogic;
  }

  const importedUri = await multichainRegistry.getMetadataUri(chainId, address);
  return importedUri;
}

/**
 * @internal
 * @param address
 * @param provider
 * @param storage
 * @returns
 */
export async function fetchAbiFromAddress(
  address: Address,
  provider: providers.Provider,
  storage: ThirdwebStorage,
): Promise<Abi | undefined> {
  try {
    const metadata = await fetchContractMetadataFromAddress(
      address,
      provider,
      storage,
    );
    if (metadata && metadata.abi) {
      return metadata.abi;
    }
  } catch (e) {
    // ignore and return undefined
    // will fallback to embedded ABIs for prebuilts
  }
  return undefined;
}
