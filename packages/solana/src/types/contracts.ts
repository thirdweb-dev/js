import { FileBufferOrStringSchema, JsonSchema } from "./common";
import { z } from "zod";

/**
 * @internal
 */
export const CommonContractSchema = z.object({
  name: z.string(),
  symbol: z.string().optional(),
  description: z.string().optional(),
  image: FileBufferOrStringSchema.optional(),
  external_link: z.string().url().optional(),
});

/**
 * @internal
 */
export const CommonContractOutputSchema = CommonContractSchema.extend({
  image: z.string().optional(),
}).catchall(z.lazy(() => JsonSchema));

// TODO add royalties input (creator <> share array)
export type NFTCollectionMetadataInput = z.input<typeof CommonContractSchema>;
