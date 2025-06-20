import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { isAddress } from "../address.js";
import type { Prettify } from "../type-utils.js";

/**
 * Represents the input data for creating an NFT (Non-Fungible Token).
 */
export type NFTInput = Prettify<
  {
    name?: string;
    description?: string;
    image?: FileOrBufferOrString;
    animation_url?: FileOrBufferOrString;
    external_url?: FileOrBufferOrString;
    background_color?: string;
    // TODO check if we truly need both of these?
    properties?: Record<string, unknown> | Array<Record<string, unknown>>;
  } & Record<string, unknown>
>;

export type NFTMetadata = {
  uri: string;
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  background_color?: string;
  properties?: Record<string, unknown> | Array<Record<string, unknown>>;
  attributes?: Record<string, unknown> | Array<Record<string, unknown>>;
  image_url?: string;
} & Record<string, unknown>;

export type NFT =
  | {
      metadata: NFTMetadata;
      owner: string | null;
      id: bigint;
      tokenURI: string;
      type: "ERC721";
      tokenAddress: string;
      chainId: number;
    }
  | {
      metadata: NFTMetadata;
      owner: string | null;
      id: bigint;
      tokenURI: string;
      type: "ERC1155";
      supply: bigint;
      tokenAddress: string;
      chainId: number;
    };

/**
 * @internal
 */
export type ParseNFTOptions =
  | {
      tokenId: bigint;
      tokenUri: string;
      type: "ERC721";
      owner?: string | null;
      tokenAddress: string;
      chainId: number;
    }
  | {
      tokenId: bigint;
      tokenUri: string;
      type: "ERC1155";
      owner?: string | null;
      supply: bigint;
      tokenAddress: string;
      chainId: number;
    };

/**
 * Parses the NFT metadata and options to create an NFT object.
 * @param base - The base NFT metadata.
 * @param options - The options for parsing the NFT.
 * @returns The parsed NFT object.
 * @internal
 */
export function parseNFT(base: NFTMetadata, options: ParseNFTOptions): NFT {
  switch (options.type) {
    case "ERC721":
      return {
        chainId: options.chainId,
        id: options.tokenId,
        metadata: base,
        owner: options?.owner ?? null,
        tokenAddress: options.tokenAddress,
        tokenURI: options.tokenUri,
        type: options.type,
      };
    case "ERC1155":
      return {
        chainId: options.chainId,
        id: options.tokenId,
        metadata: base,
        owner: options?.owner ?? null,
        supply: options.supply,
        tokenAddress: options.tokenAddress,
        tokenURI: options.tokenUri,
        type: options.type,
      };
    default:
      throw new Error("Invalid NFT type");
  }
}

/**
 * Parses an NFT URI.
 * @param options - The options for parsing an NFT URI.
 * @param options.client - The Thirdweb client.
 * @param options.uri - The NFT URI to parse.
 * @returns A promise that resolves to the NFT URI, or null if the URI could not be parsed.
 *
 * @example
 * ```ts
 * import { parseNftUri } from "thirdweb/utils/ens";
 * const nftUri = await parseNftUri({
 *    client,
 *    uri: "eip155:1/erc1155:0xb32979486938aa9694bfc898f35dbed459f44424/10063",
 * });
 *
 * console.log(nftUri); // ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/
 * ```
 *
 * @extension ENS
 *
 */
export async function parseNftUri(options: {
  client: ThirdwebClient;
  uri: string;
}): Promise<string | null> {
  let uri = options.uri;
  // parse valid nft spec (CAIP-22/CAIP-29)
  // @see: https://github.com/ChainAgnostic/CAIPs/tree/master/CAIPs
  if (uri.startsWith("did:nft:")) {
    // convert DID to CAIP
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }

  const [reference = "", asset_namespace = "", tokenID = ""] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");

  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155") {
    throw new Error(
      `Invalid EIP namespace, expected EIP155, got: "${eip_namespace}"`,
    );
  }
  if (!chainID) {
    throw new Error("Chain ID not found");
  }
  if (!contractAddress || !isAddress(contractAddress)) {
    throw new Error("Contract address not found");
  }
  if (!tokenID) {
    throw new Error("Token ID not found");
  }
  const chain = getCachedChain(Number(chainID));
  const contract = getContract({
    address: contractAddress,
    chain,
    client: options.client,
  });
  switch (erc_namespace) {
    case "erc721": {
      const { getNFT } = await import("../../extensions/erc721/read/getNFT.js");
      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenID),
      });
      return nft.metadata.image ?? null;
    }
    case "erc1155": {
      const { getNFT } = await import(
        "../../extensions/erc1155/read/getNFT.js"
      );
      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenID),
      });
      return nft.metadata.image ?? null;
    }

    default: {
      throw new Error(
        `Invalid ERC namespace, expected ERC721 or ERC1155, got: "${erc_namespace}"`,
      );
    }
  }
}
