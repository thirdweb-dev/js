import { AmountSchema } from "../../../core/schema/shared";
import { AddressSchema } from "../shared";
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
