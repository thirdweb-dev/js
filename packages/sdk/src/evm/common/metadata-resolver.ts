import { Abi, PublishedMetadata } from "../schema/contracts/custom";
import { Address } from "../schema/shared/Address";
import { resolveContractUriFromAddress } from "./feature-detection/resolveContractUriFromAddress";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Contract, providers } from "ethers";
import { fetchContractMetadata } from "./fetchContractMetadata";
import TWRegistryABI from "@thirdweb-dev/contracts-js/dist/abis/TWMultichainRegistryLogic.json";
import { getChainProvider, getMultichainRegistryAddress } from "../constants";
import type { TWMultichainRegistryLogic } from "@thirdweb-dev/contracts-js";

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
) {
  const chainId = (await provider.getNetwork()).chainId;
  const cached = getFromCache(address, chainId);
  if (cached) {
    return cached;
  }
  let metadata: PublishedMetadata | undefined;
  try {
    const compilerMetadataUri = await resolveContractUriFromAddress(
      address,
      provider,
    );
    if (!compilerMetadataUri) {
      throw new Error(`Could not resolve metadata for contract at ${address}`);
    }
    metadata = await fetchContractMetadata(compilerMetadataUri, storage);
  } catch (e) {
    console.debug(
      "Failed to get Contract Metadata from IPFS, defaulting to onchain registry",
      e,
    );
    try {
      // try from multichain registry
      if (!multichainRegistry) {
        multichainRegistry = new Contract(
          getMultichainRegistryAddress(),
          TWRegistryABI,
          getChainProvider("polygon", {}),
        ) as TWMultichainRegistryLogic;
      }

      const importedUri = await multichainRegistry.getMetadataUri(
        chainId,
        address,
      );
      if (!importedUri) {
        throw new Error(
          `Could not resolve metadata for contract at ${address}`,
        );
      }
      metadata = await fetchContractMetadata(importedUri, storage);
    } catch (err) {
      throw new Error(`Could not resolve metadata for contract at ${address}`);
    }
  }
  if (!metadata) {
    throw new Error(
      `No ABI found for this contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${address}`,
    );
  }
  putInCache(address, chainId, metadata);
  return metadata;
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
