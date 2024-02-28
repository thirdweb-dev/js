export type NFTMetadata = {
  id: bigint;
  uri: string;
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  background_color?: string;
  properties?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
} & Record<string, unknown>;

export type NFT =
  | {
      metadata: NFTMetadata;
      owner: string | null;
      id: bigint;
      tokenURI: string;
      type: "ERC721";
    }
  | {
      metadata: NFTMetadata;
      owner: string | null;
      id: bigint;
      tokenURI: string;
      type: "ERC1155";
      supply: bigint;
    };

type ParseNFTOptions =
  | {
      tokenId: bigint;
      tokenUri: string;
      type: "ERC721";
      owner?: string | null;
    }
  | {
      tokenId: bigint;
      tokenUri: string;
      type: "ERC1155";
      owner?: string | null;
      supply: bigint;
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
        metadata: base,
        owner: options?.owner ?? null,
        id: options.tokenId,
        tokenURI: options.tokenUri,
        type: options.type,
      };
    case "ERC1155":
      return {
        metadata: base,
        owner: options?.owner ?? null,
        id: options.tokenId,
        tokenURI: options.tokenUri,
        type: options.type,
        supply: options.supply,
      };
    default:
      throw new Error("Invalid NFT type");
  }
}
