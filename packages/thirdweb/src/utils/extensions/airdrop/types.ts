import type { Address } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";

export type ShardedMerkleTreeInfo = {
  merkleRoot: string;
  baseUri: string;
  originalEntriesUri: string;
  shardNybbles: number;
  tokenDecimals?: number;
  isShardedMerkleTree: true;
};

export type ShardDataERC20 = {
  proofs: Hex[];
  entries: SnapshotEntryERC20[];
};

export type SnapshotEntryERC20 = {
  recipient: string;
  amount: number | string;
};

export type ClaimProofERC20 = {
  proof: Hex[];
  recipient: Address;
  quantity: bigint;
};

export type ShardDataERC721 = {
  proofs: Hex[];
  entries: SnapshotEntryERC721[];
};

export type SnapshotEntryERC721 = {
  recipient: string;
  tokenId: number | string;
};

export type ClaimProofERC721 = {
  proof: Hex[];
  recipient: Address;
  tokenId: bigint;
};
