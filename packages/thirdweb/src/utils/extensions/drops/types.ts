import type { Address } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";

export type ShardedMerkleTreeInfo = {
  merkleRoot: string;
  baseUri: string;
  originalEntriesUri: string;
  shardNybbles: number;
  tokenDecimals: number;
  isShardedMerkleTree: true;
};

export type ShardData = {
  proofs: Hex[];
  entries: OverrideEntry[];
};

export type OverrideEntry = {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
};

export type OverrideProof = {
  proof: Hex[];
  quantityLimitPerWallet: bigint;
  pricePerToken: bigint;
  currency: Address;
};

export type ClaimConditionsInput = {
  startTime?: Date;
  currencyAddress?: string;
  price?: number | string;
  maxClaimableSupply?: bigint;
  maxClaimablePerWallet?: bigint;
  merkleRootHash?: string;
  overrideList?: OverrideEntry[];
  metadata?: string | Record<string, unknown>;
} & (
  | {
      price?: string | number;
    }
  | { priceInWei?: bigint }
);

export type ClaimCondition = {
  startTimestamp: bigint;
  maxClaimableSupply: bigint;
  supplyClaimed: bigint;
  quantityLimitPerWallet: bigint;
  merkleRoot: string;
  pricePerToken: bigint;
  currency: string;
  metadata: string;
};
