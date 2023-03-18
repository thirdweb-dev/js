import {
  CommonNFTInput,
  CommonNFTOutput,
  NFTMetadata,
  NFTMetadataInput,
  NFTMetadataOrUri,
} from "../../core/schema/nft";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../constants/contract";
import type {
  IERC1155Metadata,
  IERC165,
  IERC721Metadata,
} from "@thirdweb-dev/contracts-js";
import ERC165MetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721MetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC721Metadata.json";
import ERC1155MetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155Metadata.json";
import type {
  ThirdwebStorage,
  UploadProgressEvent,
} from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, Contract, ethers, providers } from "ethers";

export const FALLBACK_METADATA = {
  name: "Failed to load NFT metadata",
};

/**
 * fetches the token metadata
 * @param tokenId - the id (to get it back in the output)
 * @param tokenUri - the uri to fetch
 * @param storage - which storage to fetch from
 *
 * @internal
 */
export async function fetchTokenMetadata(
  tokenId: BigNumberish,
  tokenUri: string,
  storage: ThirdwebStorage,
): Promise<NFTMetadata> {
  const parsedUri = tokenUri.replace(
    "{id}",
    ethers.utils.hexZeroPad(BigNumber.from(tokenId).toHexString(), 32).slice(2),
  );
  let jsonMetadata;
  try {
    jsonMetadata = await storage.downloadJSON(parsedUri);
  } catch (err) {
    const unparsedTokenIdUri = tokenUri.replace(
      "{id}",
      BigNumber.from(tokenId).toString(),
    );
    try {
      jsonMetadata = await storage.downloadJSON(unparsedTokenIdUri);
    } catch (e: any) {
      console.warn(
        `failed to get token metadata: ${JSON.stringify({
          tokenId: tokenId.toString(),
          tokenUri,
        })} -- falling back to default metadata`,
      );
      jsonMetadata = FALLBACK_METADATA;
    }
  }

  return CommonNFTOutput.parse({
    ...jsonMetadata,
    id: BigNumber.from(tokenId).toString(),
    uri: tokenUri,
  });
}

// Used for marketplace to fetch NFT metadata from contract address + tokenId
/**
 * @internal
 * @param contractAddress
 * @param provider
 * @param tokenId
 * @param storage
 */
export async function fetchTokenMetadataForContract(
  contractAddress: string,
  provider: providers.Provider,
  tokenId: BigNumberish,
  storage: ThirdwebStorage,
): Promise<NFTMetadata> {
  let uri: string | undefined;
  const erc165 = new Contract(
    contractAddress,
    ERC165MetadataAbi,
    provider,
  ) as IERC165;
  const isERC721 = await erc165.supportsInterface(InterfaceId_IERC721);
  const isERC1155 = await erc165.supportsInterface(InterfaceId_IERC1155);
  if (isERC721) {
    const erc721 = new Contract(
      contractAddress,
      ERC721MetadataAbi,
      provider,
    ) as IERC721Metadata;
    uri = await erc721.tokenURI(tokenId);
  } else if (isERC1155) {
    const erc1155 = new Contract(
      contractAddress,
      ERC1155MetadataAbi,
      provider,
    ) as IERC1155Metadata;
    uri = await erc1155.uri(tokenId);
  } else {
    throw Error("Contract must implement ERC 1155 or ERC 721.");
  }
  if (!uri) {
    // no uri found, return fallback metadata
    return CommonNFTOutput.parse({
      ...FALLBACK_METADATA,
      id: BigNumber.from(tokenId).toString(),
      uri: "",
    });
  }
  return fetchTokenMetadata(tokenId, uri, storage);
}

/**
 * @internal
 * @param metadata
 * @param storage
 */
export async function uploadOrExtractURI(
  metadata: NFTMetadataOrUri,
  storage: ThirdwebStorage,
): Promise<string> {
  if (typeof metadata === "string") {
    return metadata;
  } else {
    return await storage.upload(CommonNFTInput.parse(metadata));
  }
}

/**
 * @internal
 * @param metadatas
 * @param storage
 * @param startNumber
 * @param contractAddress
 * @param signerAddress
 * @param options
 */
export async function uploadOrExtractURIs(
  metadatas: NFTMetadataOrUri[],
  storage: ThirdwebStorage,
  startNumber?: number,
  options?: {
    onProgress: (event: UploadProgressEvent) => void;
  },
): Promise<string[]> {
  if (isUriList(metadatas)) {
    return metadatas;
  } else if (isMetadataList(metadatas)) {
    const uris = await storage.uploadBatch(
      metadatas.map((m) => CommonNFTInput.parse(m)),
      {
        rewriteFileNames: {
          fileStartNumber: startNumber || 0,
        },
        onProgress: options?.onProgress,
      },
    );
    return uris;
  } else {
    throw new Error(
      "NFT metadatas must all be of the same type (all URI or all NFTMetadataInput)",
    );
  }
}

export function getBaseUriFromBatch(uris: string[]): string {
  const baseUri = uris[0].substring(0, uris[0].lastIndexOf("/"));
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i].substring(0, uris[i].lastIndexOf("/"));
    if (baseUri !== uri) {
      throw new Error(
        `Can only create batches with the same base URI for every entry in the batch. Expected '${baseUri}' but got '${uri}'`,
      );
    }
  }

  // Ensure that baseUri ends with trailing slash
  return baseUri.replace(/\/$/, "") + "/";
}

function isUriList(metadatas: NFTMetadataOrUri[]): metadatas is string[] {
  return metadatas.find((m) => typeof m !== "string") === undefined;
}

function isMetadataList(
  metadatas: NFTMetadataOrUri[],
): metadatas is NFTMetadataInput[] {
  return metadatas.find((m) => typeof m !== "object") === undefined;
}
