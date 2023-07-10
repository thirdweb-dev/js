import { QuantitySchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { constants } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const MerkleSchema = /* @__PURE__ */ (() =>
  z.object({
    merkle: z.record(z.string()).default({}),
  }))();

export const SnapshotEntryInput = /* @__PURE__ */ (() =>
  z.object({
    address: AddressOrEnsSchema,
    maxClaimable: QuantitySchema.default(0), // defaults to 0
    price: QuantitySchema.optional(), // defaults to unlimited, but can be undefined in old snapshots
    currencyAddress: AddressOrEnsSchema.default(
      constants.AddressZero,
    ).optional(), // defaults to AddressZero, but can be undefined for old snapshots
  }))();

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
export const SnapshotInputSchema = /* @__PURE__ */ (() =>
  z.union([
    z.array(z.string()).transform(
      async (strings) =>
        await Promise.all(
          strings.map((address) =>
            SnapshotEntryInput.parseAsync({
              address,
            }),
          ),
        ),
    ),
    z.array(SnapshotEntryInput),
  ]))();

export const SnapshotEntryWithProofSchema = /* @__PURE__ */ (() =>
  SnapshotEntryInput.extend({
    proof: z.array(z.string()),
  }))();

/**
 * @internal
 */
export const SnapshotSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * The merkle root
     */
    merkleRoot: z.string(),
    claims: z.array(SnapshotEntryWithProofSchema),
  }))();

/**
 * @internal
 */
export type SnapshotEntryWithProof = z.output<
  typeof SnapshotEntryWithProofSchema
>;

/**
 * @internal
 */
export const SnapshotInfoSchema = /* @__PURE__ */ (() =>
  z.object({
    merkleRoot: z.string(),
    snapshotUri: z.string(),
  }))();
