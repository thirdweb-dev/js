import { ThirdwebSDK } from "../core";
import {
  Abi,
  PublishedMetadata,
  AbiSchema,
  ContractInfoSchema,
  ContractSource,
} from "../schema";
import { resolveContractUriFromAddress } from "./feature-detection";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";

// Internal static cache
const metadataCache: Record<string, PublishedMetadata> = {};
// polygonSDK to fetch metadata from the multichain registry
const polygonSDK = new ThirdwebSDK("polygon");

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
  address: string,
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
    try {
      // try from multichain registry
      const importedUri =
        await polygonSDK.multiChainRegistry.getContractMetadataURI(
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
    throw new Error(`Could not resolve metadata for contract at ${address}`);
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
  address: string,
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

/**
 * @internal
 * @param compilerMetadataUri
 * @param storage
 */
export async function fetchContractMetadata(
  compilerMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PublishedMetadata> {
  const metadata = await storage.downloadJSON(compilerMetadataUri);
  if (!metadata || !metadata.output) {
    throw new Error(
      `Could not resolve metadata for contract at ${compilerMetadataUri}`,
    );
  }
  const abi = AbiSchema.parse(metadata.output.abi);
  const compilationTarget = metadata.settings.compilationTarget;
  const targets = Object.keys(compilationTarget);
  const name = compilationTarget[targets[0]];
  const info = ContractInfoSchema.parse({
    title: metadata.output.devdoc.title,
    author: metadata.output.devdoc.author,
    details: metadata.output.devdoc.detail,
    notice: metadata.output.userdoc.notice,
  });
  const licenses: string[] = [
    ...new Set(
      Object.entries(metadata.sources).map(([, src]) => (src as any).license),
    ),
  ];
  return {
    name,
    abi,
    metadata,
    info,
    licenses,
  };
}

/**
 * @internal
 * @param publishedMetadata
 * @param storage
 */
export async function fetchSourceFilesFromMetadata(
  publishedMetadata: PublishedMetadata,
  storage: ThirdwebStorage,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = (info as any).urls as string[];
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 3 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_r, rej) =>
            setTimeout(() => rej("timeout"), 3000),
          );
          const source = await Promise.race([
            (await storage.download(`ipfs://${ipfsHash}`)).text(),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        } else {
          return {
            filename: path,
            source:
              (info as any).content ||
              "Could not find source for this contract",
          };
        }
      },
    ),
  );
}
