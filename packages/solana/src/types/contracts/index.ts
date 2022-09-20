import { AmountSchema } from "../common";
import { FileOrBufferOrStringSchema, JsonSchema } from "@thirdweb-dev/storage";
import { z } from "zod";

/**
 * @internal
 */
export const CommonContractSchema = z.object({
  name: z.string(),
  symbol: z.string().optional(),
  description: z.string().optional(),
  image: FileOrBufferOrStringSchema.optional(),
  external_link: z.string().url().optional(),
});

/**
 * @internal
 */
export const CommonContractOutputSchema = CommonContractSchema.extend({
  image: z.string().optional(),
}).catchall(z.lazy(() => JsonSchema));

/// NFT ///

/**
 * @internal
 */
export const NFTCollectionCreatorInputSchema = z.object({
  address: z.string(),
  share: z.number(),
  verified: z.boolean().default(false),
});

/**
 * @internal
 */
export const NFTCollectionMetadataInputSchema = CommonContractSchema.extend({
  creators: z.array(NFTCollectionCreatorInputSchema).default([]),
});

/**
 * @internal
 */
export type NFTCollectionMetadataInput = z.input<
  typeof NFTCollectionMetadataInputSchema
>;

/// TOKEN ///

/**
 * @internal
 */
export const TokenMetadataInputSchema = CommonContractSchema.extend({
  decimals: z.number().default(9),
  initialSupply: AmountSchema,
});

/**
 * @internal
 */
export type TokenMetadataInput = z.input<typeof TokenMetadataInputSchema>;
