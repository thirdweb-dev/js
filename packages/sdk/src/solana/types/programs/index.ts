import { AmountSchema, FileOrBufferOrStringSchema } from "../common";
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
}).catchall(z.unknown());

/// NFT ///

/**
 * @internal
 */
export const CreatorInputSchema = z.object({
  address: z.string(),
  sharePercentage: z.number(),
  verified: z.boolean().default(false),
});

/**
 * @internal
 */
export const NFTCollectionMetadataInputSchema = CommonContractSchema.extend({
  creators: z.array(CreatorInputSchema).default([]),
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
 * @public
 */
export type TokenMetadataInput = z.input<typeof TokenMetadataInputSchema>;

/**
 * @public
 */
export type CreatorInput = z.input<typeof CreatorInputSchema>;

/**
 * @internal
 */
export type RegisteredProgram = {
  deployer: string;
  programAddress: string;
  programName: string;
  programType: string;
  visible: boolean;
};
