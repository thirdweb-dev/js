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
import fetch from "cross-fetch";

const RESOLVER_URL = "https://contract-importer.nftlabs.co";
// const RESOLVER_URL = "http://localhost:3000";

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
  let bytecode: string | undefined;

  const url = `${RESOLVER_URL}/fetch/${chainId}/${address}`;
  console.log("fetching abi from chainsaw", url);
  console.time("chainsaw time");
  const res = await fetch(url);
  if (res.ok) {
    const abiJson = await res.json();
    if (abiJson) {
      // TODO chainsaw endpoint with full metadata?
      console.log("got abi from chainsaw");
      metadata = abiJson;
    }
  }
  console.timeEnd("chainsaw time");

  if (metadata) {
    putInCache(address, chainId, metadata);
    return metadata;
  }

  // if (!metadata) {
  // console.log("Couldn't find ABI on chainsaw, resolving from IPFS");
  try {
    console.time("resolve Uri");
    const [ipfsData, registryData] = await Promise.all([
      resolveContractUriAndBytecode(address, provider).catch(() => undefined),
      getMetadataUriFromMultichainRegistry(address, chainId, sdkOptions).then(
        (uri) => {
          if (!uri) {
            return undefined;
          }
          return {
            uri,
            bytecode: "",
          };
        },
      ),
    ]);
    bytecode = ipfsData?.bytecode;
    console.log("ipfsData", ipfsData?.uri);
    console.log("registryData", registryData?.uri);
    const metadataUri = registryData?.uri || ipfsData?.uri;
    console.timeEnd("resolve Uri");
    if (!metadataUri) {
      throw new Error(`Could not resolve metadata for contract at ${address}`);
    }
    metadata = await fetchContractMetadata(metadataUri, storage);
  } catch (e) {
    if (bytecode) {
      const abi = constructAbiFromBytecode(bytecode);
      if (abi && abi.length > 0) {
        // return partial ABI
        metadata = {
          name: "Unknown Contract",
          abi: abi as Abi,
          metadata: {},
          info: {},
          licenses: [],
          isPartialAbi: true,
        };
      } else {
        throw new Error(
          `Could not resolve metadata for contract at ${address}`,
        );
      }
    } else {
      throw new Error(`Could not resolve metadata for contract at ${address}`);
    }
  }
  // }
  if (!metadata) {
    throw new Error(
      `No ABI found for this contract. Try importing it by visiting: https://thirdweb.com/${chainId}/${address}`,
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
    // TODO enforce always passing sdk options for clientId/secretKey
    multichainRegistry = new Contract(
      getMultichainRegistryAddress(),
      TWRegistryABI,
      getChainProvider("polygon", sdkOptions),
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
