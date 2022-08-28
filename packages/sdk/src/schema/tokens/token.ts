import { z } from "zod";
import { AddressSchema, AmountSchema } from "../shared";

/**
 * @internal
 */
export const TokenMintInputSchema = z.object({
  toAddress: AddressSchema,
  amount: AmountSchema,
});

/**
 * @public
 */
export type TokenMintInput = z.input<typeof TokenMintInputSchema>;
