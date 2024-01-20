type NFTMetadata = {
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
    supply: options.supply || 1n,
  };
}
