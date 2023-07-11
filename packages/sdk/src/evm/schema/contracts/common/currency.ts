import { BigNumberSchema } from "../../shared/BigNumberSchema";
import { z } from "zod";

/**
 * @internal
 */
export const CurrencySchema = /* @__PURE__ */ (() =>
  z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }))();

/**
 * @internal
 */
export const CurrencyValueSchema = /* @__PURE__ */ (() =>
  CurrencySchema.extend({
    value: BigNumberSchema,
    displayValue: z.string(),
  }))();
