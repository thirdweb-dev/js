"use server";

import assert from "node:assert";
import type { NFTDetails } from "../hooks/useGetNFTs";

interface Previews {
  image_small_url: string;
  image_medium_url: string;
  image_large_url: string;
  image_opengraph_url: string;
  blurhash: string;
  predominant_color: string;
}

interface Owner {
  owner_address: string;
  quantity: number;
  quantity_string: string;
  first_acquired_date: string;
  last_acquired_date: string;
}

interface Contract {
  type: string;
  name: string;
  symbol: string;
  deployed_by: string;
  deployed_via_contract: null | string;
  owned_by: string;
  has_multiple_collections: boolean;
  has_erc5643_subscription_standard: boolean;
}

interface MarketplacePage {
  marketplace_id: string;
  marketplace_name: string;
  marketplace_collection_id: string;
  nft_url?: string;
  collection_url: string;
  verified: boolean | null;
}

interface PaymentToken {
  payment_token_id: string;
  name: string;
  symbol: string;
  address: null | string;
  decimals: number;
}

interface FloorPrice {
  marketplace_id: string;
  marketplace_name: string;
  value: string;
  payment_token: PaymentToken;
  value_usd_cents: number;
}

interface RoyaltyRecipient {
  address: string;
  percentage: number;
  basis_points: number;
}

interface Royalty {
  source: string;
  total_creator_fee_basis_points: number;
  recipients: RoyaltyRecipient[];
}

interface Collection {
  collection_id: string;
  name: string;
  description: string;
  image_url: string;
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
  floor_prices: FloorPrice[];
  top_bids: unknown[];
  distinct_owner_count: number;
  distinct_nft_count: number;
  total_quantity: number;
  chains: string[];
  top_contracts: string[];
  collection_royalties: Royalty[];
}

interface Sale {
  from_address: string | null;
  to_address: string;
  quantity: number;
  quantity_string: string;
  timestamp: string;
  transaction: string;
  marketplace_id: string;
  marketplace_name: string;
  is_bundle_sale: boolean;
  payment_token: PaymentToken;
  unit_price: string;
  total_price: string;
  unit_price_usd_cents: number;
}

interface Attribute {
  trait_type: string;
  value: string;
  display_type: null | string;
}

interface ExtraMetadata {
  attributes: Attribute[];
  tokenId: number;
  image_original_url: string;
  animation_original_url: null | string;
  metadata_original_url: string;
}

interface NFT {
  nft_id: string;
  chain: string;
  contract_address: string;
  token_id: string;
  name: string;
  description: string;
  previews: Previews;
  image_url: string;
  background_color: null | string;
  external_url: null | string;
  created_date: string;
  status: string;
  token_count: number;
  owner_count: number;
  owners: Owner[];
  contract: Contract;
  collection: Collection;
  last_sale: Sale | null;
  primary_sale: Sale | null;
  royalty: Royalty[];
  extra_metadata: ExtraMetadata;
  queried_wallet_balances: Owner[];
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
      contractAddress: token.contract_address,
      tokenId: token.token_id,
      imageUrl: token.previews.image_medium_url,
      blurHash: token.previews.blurhash,
    }));
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}
