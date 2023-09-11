import {
  GenerateURLParams,
  SimpleHashSupportedChainId,
  WalletNFT,
  simpleHashSupportedChainIdsMap,
  simpleHashSupportedNetworks,
} from "./types";

export function isSimpleHashSupported(
  chainId: number,
): chainId is SimpleHashSupportedChainId {
  return simpleHashSupportedNetworks.includes(chainId.toString());
}

export function generateSimpleHashUrl({ chainId, owner }: GenerateURLParams) {
  const url = new URL("https://api.simplehash.com/api/v0/nfts/owners");

  url.searchParams.append("wallet_addresses", owner);
  url.searchParams.append("chains", simpleHashSupportedChainIdsMap[chainId]);

  return url.toString();
}

export async function transformSimpleHashResponseToNFT(
  simpleHashResponse: SimpleHashResponse,
  walletAddress: string,
): Promise<WalletNFT[]> {
  return (
    await Promise.all(
      simpleHashResponse.nfts.map(async (simpleHashNft) => {
        try {
          return {
            contractAddress: simpleHashNft.contract_address,
            tokenId: parseInt(simpleHashNft.token_id),
            metadata: {
              name: simpleHashNft.name,
              description: simpleHashNft.description,
              image: simpleHashNft.extra_metadata.image_original_url,
              external_url: simpleHashNft.external_url,
              attributes: simpleHashNft.extra_metadata.attributes,
              properties: simpleHashNft.extra_metadata.properties,
              id: simpleHashNft.token_id,
              uri: simpleHashNft.extra_metadata.metadata_original_url,
              animation_url:
                simpleHashNft.extra_metadata.animation_original_url,
              background_color: simpleHashNft.background_color,
            } as any,
            owner: walletAddress,
            supply: simpleHashNft.token_count.toString(),
            type: simpleHashNft.contract.type,
          } as WalletNFT;
        } catch (e) {
          return undefined as unknown as WalletNFT;
        }
      }),
    )
  ).filter(Boolean);
}

interface PreviewImages {
  image_small_url: string;
  image_medium_url: string;
  image_large_url: string;
  image_opengraph_url: string;
  blurhash: string;
  predominant_color: string;
}

interface ImageProperties {
  width: number;
  height: number;
  size: number;
  mime_type: string;
}

interface Owner {
  owner_address: string;
  quantity: number;
  first_acquired_date: string;
  last_acquired_date: string;
}

interface Contract {
  type: string;
  name: string;
  symbol: string;
  deployed_by: string;
  deployed_via_contract: string;
}

interface MarketplacePage {
  marketplace_id: string;
  marketplace_name: string;
  marketplace_collection_id: string;
  nft_url: string;
  collection_url: string;
  verified: boolean;
}

interface Collection {
  collection_id: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string | null;
  category: string | null;
  is_nsfw: boolean | null;
  external_url: string | null;
  twitter_username: string | null;
  discord_url: string | null;
  instagram_username: string | null;
  medium_username: string | null;
  telegram_url: string | null;
  marketplace_pages: MarketplacePage[];
  metaplex_mint: string | null;
  metaplex_first_verified_creator: string | null;
  floor_prices: any[];
  top_bids: any[];
  distinct_owner_count: number;
  distinct_nft_count: number;
  total_quantity: number;
  chains: string[];
  top_contracts: string[];
}

interface FirstCreated {
  minted_to: string;
  quantity: number;
  timestamp: string;
  block_number: number;
  transaction: string;
  transaction_initiator: string;
}

interface Rarity {
  rank: number;
  score: number;
  unique_attributes: number;
}

interface ExtraMetadataAttribute {
  trait_type: string;
  value: string;
  display_type: string | null;
}

interface ExtraMetadataProperties {
  number: number;
  name: string;
}

interface ExtraMetadata {
  attributes: ExtraMetadataAttribute[];
  properties: ExtraMetadataProperties;
  image_original_url: string;
  animation_original_url: string | null;
  metadata_original_url: string;
}

interface NFT {
  nft_id: string;
  chain: string;
  contract_address: string;
  token_id: string;
  name: string;
  description: string;
  previews: PreviewImages;
  image_url: string;
  image_properties: ImageProperties;
  video_url: string | null;
  video_properties: any;
  audio_url: string | null;
  audio_properties: any;
  model_url: string | null;
  model_properties: any;
  other_url: string | null;
  other_properties: any;
  background_color: string | null;
  external_url: string | null;
  created_date: string;
  status: string;
  token_count: number;
  owner_count: number;
  owners: Owner[];
  contract: Contract;
  collection: Collection;
  last_sale: any;
  first_created: FirstCreated;
  rarity: Rarity;
  royalty: any[];
  extra_metadata: ExtraMetadata;
}

interface SimpleHashResponse {
  nfts: NFT[];
}
