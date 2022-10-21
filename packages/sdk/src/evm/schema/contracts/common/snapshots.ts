import { QuantitySchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { ethers } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const MerkleSchema = z.object({
  merkle: z.record(z.string()).default({}),
});

/**
 * @internal
 */
export const SnapshotEntryInput = z.object({
  address: AddressSchema,
  maxClaimable: QuantitySchema, // TODO (cc) this can't be 0 by default anymore
  price: QuantitySchema, // TODO (cc) max uint is default
  currencyAddress: AddressSchema.default(ethers.constants.AddressZero), // TODO (cc) addr zero is default
});

export type SnapshotEntry = z.output<typeof SnapshotEntryInput>;
export type ShardData = {
  proofs: string[];
  entries: SnapshotEntry[];
};
export type ShardedMerkleTreeInfo = {
  merkleRoot: string;
  baseUri: string;
  originalEntriesUri: string;
  shardNybbles: number;
  tokenDecimals: number;
  isShardedMerkleTree: true;
};

export type ShardedSnapshot = {
  shardedMerkleInfo: ShardedMerkleTreeInfo;
  uri: string;
};

/**
 * @internal
 */
export const SnapshotInputSchema = z.union([
  z.array(z.string()).transform((strings) =>
    strings.map((address) =>
      SnapshotEntryInput.parse({
        address,
      }),
    ),
  ),
  z.array(SnapshotEntryInput),
]);

const SnapshotEntryWithProofSchema = SnapshotEntryInput.extend({
  proof: z.array(z.string()),
});
/**
 * @internal
 */
export const SnapshotSchema = z.object({
  /**
   * The merkle root
   */
  merkleRoot: z.string(),
  claims: z.array(SnapshotEntryWithProofSchema),
});
/**
 * @internal
 */
export type SnapshotEntryWithProof = z.output<
  typeof SnapshotEntryWithProofSchema
>;

/**
 * @internal
 */
export const SnapshotInfoSchema = z.object({
  merkleRoot: z.string(),
  snapshotUri: z.string(),
});
