import { BigNumberSchema } from "../../shared/BigNumberSchema";
import { z } from "zod";

/**
 * @internal
 */
export const CurrencySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
});

/**
 * @internal
 */
export const CurrencyValueSchema = CurrencySchema.extend({
  value: BigNumberSchema,
  displayValue: z.string(),
});
