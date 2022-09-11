import { sol, toBigNumber, toDateTime } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

/**
 * @internal
 */
export const NFTDropContractSchema = z.object({
  price: z
    .number()
    .default(0)
    .transform((p) => sol(p)),
  sellerFeeBasisPoints: z.number().default(0),
  itemsAvailable: z
    .number()
    .default(0)
    .transform((bn) => toBigNumber(bn)),
  goLiveDate: z
    .date()
    .transform((d) => toDateTime(d))
    .optional(),
  splToken: z
    .string()
    .transform((a) => new PublicKey(a))
    .optional(),
  solTreasuryAccount: z
    .string()
    .transform((a) => new PublicKey(a))
    .optional(),
  splTokenAccount: z
    .string()
    .transform((a) => new PublicKey(a))
    .optional(),
});

export type NFTDropMetadataInput = z.input<typeof NFTDropContractSchema>;

/**
 * @internal
 */
// TODO add whitelist options and end settings
export const NFTDropClaimSchema = NFTDropContractSchema.extend({
  price: z
    .number()
    .transform((p) => sol(p))
    .optional(),
  sellerFeeBasisPoints: z.number().optional(),
  itemsAvailable: z
    .number()
    .transform((bn) => toBigNumber(bn))
    .optional(),
});

/**
 * @internal
 */
export const NFTDropOutputSchema = z.object({
  price: z.bigint(),
  sellerFeeBasisPoints: z.bigint(),
  itemsAvailable: z.bigint(),
  goLiveDate: z.date().optional(),
});

export type NFTDropClaimInput = z.input<typeof NFTDropClaimSchema>;

export type NFTDropOutput = z.output<typeof NFTDropOutputSchema>;
