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

type NFTType = "ERC1155" | "ERC721";

type ERC1155Options = {
  tokenId: bigint;
  tokenUri: string;
  type: "ERC1155";
  owner?: string | null;
  supply: bigint;
};

type ERC721Options = {
  tokenId: bigint;
  tokenUri: string;
  type: "ERC721";
  owner?: string | null;
};

type ParseNFTOptions<type extends NFTType> = type extends "ERC1155" ? ERC1155Options : ERC721Options;

type BaseNFT = {
  metadata: NFTMetadata;
  id: bigint;
  tokenURI: string;
  owner: string | null;
};

type ERC1155NFT = BaseNFT & {
  type: "ERC1155";
  supply: bigint;
};

type ERC721NFT = BaseNFT & {
  type: "ERC721";
};

export type NFT<type extends NFTType = NFTType> = type extends "ERC1155" ? ERC1155NFT : ERC721NFT;

/**
 * Parses the NFT metadata and options to create an NFT object.
 * @param base - The base NFT metadata.
 * @param options - The options for parsing the NFT.
 * @returns The parsed NFT object.
 * @internal
 */
export function parseNFT<type extends NFTType>(
  base: NFTMetadata,
  options: ParseNFTOptions<type>,
): NFT<type> {
  return {
    metadata: base,
    owner: options?.owner ?? null,
    id: options.tokenId,
    tokenURI: options.tokenUri,
    type: options.type,
    ...("supply" in options && { supply: options.supply || 0n })
  } as NFT<type>;
}