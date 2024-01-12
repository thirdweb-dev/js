import { FileOrBufferOrStringSchema } from "./shared";
import { z } from "zod";

/**
 * @internal
 */
const CommonTokenInputSchema = /* @__PURE__ */ (() =>
  z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    description: z.string().optional(),
    image: FileOrBufferOrStringSchema.optional(),
    external_link: z.string().url().optional(),
  }))();

/**
 * @internal
 */
const CurrencyValueSchema = /* @__PURE__ */ (() =>
  z.object({
    value: z.string(),
    displayValue: z.string(),
  }))();

/**
 * Currency value and display value
 * @public
 */
export type CurrencyValue = z.input<typeof CurrencyValueSchema>;

/**
 * @internal
 */
const CommonTokenOutputSchema = /* @__PURE__ */ (() =>
  CommonTokenInputSchema.extend({
    image: z.string().optional(),
    supply: CurrencyValueSchema,
  }).catchall(z.unknown()))();

/**
 * Metadata for a token
 * @public
 */
export type TokenMetadata = z.output<typeof CommonTokenOutputSchema>;
