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

export type NFT<type extends NFTType = NFTType> = {
  metadata: NFTMetadata;
  id: bigint;
  tokenURI: string;
  owner: string | null;
  type: type;
  supply: bigint;
};

type ParseNFTOptions<type extends NFTType> = {
  tokenId: bigint;
  tokenUri: string;
  type: type;
  owner?: string | null;
  supply?: bigint;
};

/**
 * Parses the NFT metadata and options to create an NFT object.
 * @param base - The base NFT metadata.
 * @param options - The options for parsing the NFT.
 * @returns The parsed NFT object.
 * @internal
 */
export function parseNFT<const type extends NFTType>(
  base: NFTMetadata,
  options: ParseNFTOptions<type>,
): NFT<type> {
  return {
    metadata: base,
    owner: options?.owner ?? null,
    id: options.tokenId,
    tokenURI: options.tokenUri,
    type: options.type,
    supply: options.supply || 0n,
  };
}
