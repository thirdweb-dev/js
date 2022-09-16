import { NFTCollectionMetadataInputSchema } from ".";
import { sol, toBigNumber, toDateTime } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

/**
 * @internal
 */
// TODO: Handle allow lists and end times
export const NFTDropConditionsInputSchema = z.object({
  price: z.number().default(0),
  sellerFeeBasisPoints: z.number().default(0),
  itemsAvailable: z.number().default(0),
  goLiveDate: z.date().optional(),
  splToken: z.string().optional(),
  solTreasuryAccount: z.string().optional(),
  splTokenAccount: z.string().optional(),
});

export const NFTDropConditionsOutputSchema = z.object({
  price: z
    .number()
    .transform((p) => sol(p))
    .optional(),
  sellerFeeBasisPoints: z.number().optional(),
  itemsAvailable: z
    .number()
    .transform((bn) => toBigNumber(bn))
    .optional(),
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

export const NFTDropContractInputSchema =
  NFTCollectionMetadataInputSchema.merge(NFTDropConditionsInputSchema);

export type NFTDropMetadataInput = z.input<typeof NFTDropConditionsInputSchema>;
