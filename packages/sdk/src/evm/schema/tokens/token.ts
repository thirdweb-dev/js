import { AddressSchema, AmountSchema } from "../shared";
import { z } from "zod";

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
