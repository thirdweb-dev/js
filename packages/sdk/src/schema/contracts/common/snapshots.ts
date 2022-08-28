import { z } from "zod";
import { AddressSchema, AmountSchema } from "../../shared";

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

/**
 * @internal
 */
export const SnapshotSchema = z.object({
  /**
   * The merkle root
   */
  merkleRoot: z.string(),
  claims: z.array(
    SnapshotAddressInput.extend({
      proof: z.array(z.string()),
    }),
  ),
});

/**
 * @internal
 */
export const SnapshotInfoSchema = z.object({
  merkleRoot: z.string(),
  snapshotUri: z.string(),
  snapshot: SnapshotSchema,
});
