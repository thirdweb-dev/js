import { AmountSchema } from "../../../core/schema/shared";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const TokenMintInputSchema = z.object({
  toAddress: AddressOrEnsSchema,
  amount: AmountSchema,
});

/**
 * @public
 */
export type TokenMintInput = z.input<typeof TokenMintInputSchema>;
