import {
  AmountSchema,
  FileOrBufferOrStringSchema,
  PercentSchema,
} from "../../../core/schema/shared";
import { Creator } from "@metaplex-foundation/js";
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
  share: PercentSchema,
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
  initialSupply: AmountSchema.superRefine((val, context) => {
    // TODO remove this limitation when metaplex fixes https://github.com/metaplex-foundation/js/issues/421
    if (Number(val) > 9999999) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Initial supply must less than 10M, additional supply can be minted after deployment.`,
        path: ["initialSupply"],
      });
    }
  }),
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
 * @public
 */
export type UpdateCreatorInput = {
  creators: CreatorInput[];
  updateAll: boolean;
};

/**
 * @public
 */
export type UpdateRoyaltySettingsInput = {
  sellerFeeBasisPoints: number;
  updateAll: boolean;
};

/**
 * @public
 */
export type CreatorOutput = Omit<Creator, "address"> & {
  readonly address: string;
};

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
