"use server";

import assert from "node:assert";
import type { NFTDetails } from "../hooks/useGetNFTs";

interface NFT {
  nft_id: string;
  chain: string;
  contract_address: string;
  token_id: string;
  name: string;
  description: string;
  previews: NFTPreviews;
  image_url: string;
  image_properties: ImageProperties;
  video_url: string | null;
  video_properties: VideoProperties | null;
  audio_url: string | null;
  audio_properties: AudioProperties | null;
  model_url: string | null;
  model_properties: ModelProperties | null;
  other_url: string | null;
  other_properties: OtherProperties | null;
  background_color: string | null;
  external_url: string | null;
  created_date: string;
  status: string;
  token_count: number;
  owner_count: number;
  contract: NFTContract;
  collection: NFTCollection;
  first_created: FirstCreated;
  rarity: Rarity;
  royalty: Royalty[];
  extra_metadata: ExtraMetadata;
  queried_wallet_balances: QueriedWalletBalance[];
}

interface NFTPreviews {
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
  size?: number;
  mime_type: string;
  exif_orientation: number | null;
}

interface VideoProperties {
  width: number;
  height: number;
  size: number;
  mime_type: string;
  duration: number;
}

interface AudioProperties {
  size: number;
  mime_type: string;
  duration: number;
}

interface ModelProperties {
  format: string;
  size: number;
}

interface OtherProperties {
  format: string;
  size: number;
}

interface NFTContract {
  type: "ERC721" | "ERC1155";
  name: string;
  symbol: string;
  deployed_by: string;
  deployed_via_contract: string | null;
  owned_by: string | null;
  has_multiple_collections: boolean;
  has_erc5643_subscription_standard: boolean;
}

interface NFTCollection {
  collection_id: string;
  name: string;
  description: string;
  image_url: string;
  image_properties: ImageProperties;
  banner_image_url: string | null;
  category: string | null;
  is_nsfw: boolean;
  external_url: string | null;
  twitter_username: string | null;
  discord_url: string | null;
  instagram_username: string | null;
  medium_username: string | null;
  telegram_url: string | null;
  marketplace_pages: MarketplacePage[];
  metaplex_mint: string | null;
  metaplex_candy_machine: string | null;
  metaplex_first_verified_creator: string | null;
  mpl_core_collection_address: string | null;
  distinct_owner_count: number;
  distinct_nft_count: number;
  total_quantity: number;
  chains: string[];
  top_contracts: string[];
  collection_royalties: CollectionRoyalty[];
}

interface MarketplacePage {
  marketplace_id: string;
  marketplace_name: string;
  marketplace_collection_id: string;
  nft_url: string;
  collection_url: string;
  verified: boolean | null;
}

interface CollectionRoyalty {
  source: string;
  total_creator_fee_basis_points: number;
  recipients: any[];
}

interface FirstCreated {
  minted_to: string;
  quantity: number;
  quantity_string: string;
  timestamp: string;
  block_number: number;
  transaction: string;
  transaction_initiator: string;
}

interface Rarity {
  rank: number | null;
  score: number | null;
  unique_attributes: any | null;
}

interface Royalty {
  source: string;
  total_creator_fee_basis_points: number;
  recipients: string[];
}

interface ExtraMetadata {
  attributes: any[];
  image_original_url: string;
  animation_original_url: string | null;
  metadata_original_url: string;
}

interface QueriedWalletBalance {
  address: string;
  quantity: number;
  quantity_string: string;
  first_acquired_date: string;
  last_acquired_date: string;
}

interface SimpleHashResponse {
  next_cursor: null | string;
  next: null | string;
  previous: null | string;
  nfts: NFT[];
}

export async function fetchNFTs(args: {
  chainId: number;
  address: string;
}): Promise<NFTDetails[]> {
  try {
    const { SIMPLEHASH_API_KEY } = process.env;
    assert(SIMPLEHASH_API_KEY, "SIMPLEHASH_API_KEY is not set");
    const { chainId, address } = args;

    // @TODO: pagination
    const response = await fetch(
      `https://api.simplehash.com/api/v0/nfts/owners_v2?chains=eip155:${chainId}&wallet_addresses=${address}&queried_wallet_balances=1&filters=spam_score__lt%3D50&count=0&order_by=transfer_time__desc&limit=50`,
      {
        headers: { "X-API-KEY": SIMPLEHASH_API_KEY },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Unexpected status ${response.status}: ${await response.text()}`,
      );
    }

    const data: SimpleHashResponse = await response.json();
    return data.nfts.map((token) => ({
      name: token.name,
      description: token.description,
      contractAddress: token.contract_address,
      contractType: token.contract.type,
      tokenId: token.token_id,
      quantity: token.queried_wallet_balances[0]?.quantity ?? 1,
      firstAcquiredDate: token.queried_wallet_balances[0]?.first_acquired_date,
      lastAcquiredDate: token.queried_wallet_balances[0]?.last_acquired_date,
      imageUrl: token.previews.image_medium_url,
      createdAt: token.created_date ?? undefined,
      tokenCount: token.token_count,
      ownerCount: token.owner_count,
    }));
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}
