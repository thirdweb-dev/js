import type { Address } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";

export type ShardedMerkleTreeInfo = {
  merkleRoot: Hex;
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
};

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

// Modular Drops

/**
 * Represents the input data for creating a claim condition for a Modular Drop contract.
 * @modules ClaimableERC20
 * @modules ClaimableERC721
 * @modules ClaimableERC1155
 */
export type ClaimConditionInput = {
  /**
   * The start time of the claim condition, defaults to now.
   */
  startTime?: Date;
  /**
   * The end time of the claim condition, defaults to 10 years from now.
   */
  endTime?: Date;
  /**
   * The currency address to pay with, defaults to native currency.
   */
  currencyAddress?: string;
  /**
   * The price per token to pay, defaults to 0.
   */
  pricePerToken?: number | string;
  /**
   * The maximum amount of tokens that can be claimed, defaults to unlimited.
   */
  maxClaimableSupply?: number | string;
  /**
   * The maximum amount of tokens that can be claimed per wallet, defaults to unlimited.
   */
  maxClaimablePerWallet?: number | string;
  /**
   * List of overrides per wallet address.
   */
  allowList?: string[];
};
