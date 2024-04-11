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
  entries: AllowlistEntry[];
};

export type AllowlistEntry = {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
};

export type ClaimConditionsInput = {
  startTime?: Date;
  currencyAddress?: string;
  price?: number | string;
  maxClaimableSupply?: bigint;
  maxClaimablePerWallet?: bigint;
  merkleRootHash?: string;
  allowlist?: string[] | AllowlistEntry[];
  metadata?: string | Record<string, unknown>;
} & (
  | {
      price?: string | number;
    }
  | { priceInWei?: bigint }
);
