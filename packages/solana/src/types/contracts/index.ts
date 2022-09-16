import { AmountSchema, JsonSchema } from "../common";
import { FileOrBufferOrStringSchema } from "@thirdweb-dev/storage";
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

export const NFTCollectionCreatorInputSchema = z.object({
  address: z.string(),
  share: z.number(),
  verified: z.boolean().default(false),
});

export const NFTCollectionMetadataInputSchema = CommonContractSchema.extend({
  creators: z.array(NFTCollectionCreatorInputSchema).default([]),
});

export type NFTCollectionMetadataInput = z.input<
  typeof NFTCollectionMetadataInputSchema
>;

/// TOKEN ///

export const TokenMetadataInputSchema = CommonContractSchema.extend({
  decimals: z.number().default(9),
  initialSupply: AmountSchema,
});

export type TokenMetadataInput = z.input<typeof TokenMetadataInputSchema>;
