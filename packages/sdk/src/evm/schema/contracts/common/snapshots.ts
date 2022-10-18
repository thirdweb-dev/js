import { AddressSchema, AmountSchema } from "../../shared";
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
export const SnapshotAddressInput = z.object({
  address: AddressSchema,
  maxClaimable: AmountSchema.default(0),
});

export type SnapshotEntry = z.output<typeof SnapshotAddressInput>;
export type ShardData = {
  proofs: string[];
  entries: SnapshotEntry[];
};
export type ShardedMerkleTreeInfo = {
  merkleRoot: string;
  baseUri: string;
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
      SnapshotAddressInput.parse({
        address,
      }),
    ),
  ),
  z.array(SnapshotAddressInput),
]);

const SnapshotEntryOutputSchema = SnapshotAddressInput.extend({
  proof: z.array(z.string()),
});
/**
 * @internal
 */
const SnapshotEntriesOutputSchema = z.array(SnapshotEntryOutputSchema);
/**
 * @internal
 */
export const SnapshotSchema = z.object({
  /**
   * The merkle root
   */
  merkleRoot: z.string(),
  claims: SnapshotEntriesOutputSchema,
});
/**
 * @internal
 */
export type SnapshotEntriesOutput = z.output<
  typeof SnapshotEntriesOutputSchema
>;
/**
 * @internal
 */
export type SnapshotEntryOutput = z.output<typeof SnapshotEntryOutputSchema>;

/**
 * @internal
 */
export const SnapshotInfoSchema = z.object({
  merkleRoot: z.string(),
  snapshotUri: z.string(),
  snapshot: SnapshotSchema.optional(), // TODO remove
});
