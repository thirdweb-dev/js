import {
  CurrencyValueSchema,
  FileOrBufferOrStringSchema,
  HexColor,
  OptionalPropertiesInput,
} from "./common";
import { z } from "zod";

/**
 * @internal
 */
export const CommonTokenInput = z
  .object({
    name: z.union([z.string(), z.number()]).optional(),
    symbol: z.string().optional(),
    description: z.string().nullable().optional(),
    image: FileOrBufferOrStringSchema.nullable().optional(),
    external_url: FileOrBufferOrStringSchema.nullable().optional(),
  })
  .catchall(z.unknown());

/**
 * @internal
 */
export const CommonTokenOutput = CommonTokenInput.extend({
  id: z.string().optional(),
  uri: z.string(),
  image: z.string().nullable().optional(),
  external_url: z.string().nullable().optional(),
});

/**
 * @internal
 */
export const CommonNFTInput = CommonTokenInput.extend({
  animation_url: FileOrBufferOrStringSchema.optional(),
  background_color: HexColor.optional(),
  properties: OptionalPropertiesInput,
  attributes: OptionalPropertiesInput,
});

/**
 * @internal
 */
export const NFTInputOrUriSchema = z.union([CommonNFTInput, z.string()]);

/**
 * @internal
 */
export const CommonNFTOutput = CommonTokenOutput.extend({
  animation_url: z.string().nullable().optional(),
});

/**
 * @internal
 */
export const CommonFungibleTokenOutput = CommonTokenOutput.extend({
  decimals: z.number(),
  supply: CurrencyValueSchema,
});

/**
 * @public
 */
export type TokenMetadata = z.output<typeof CommonFungibleTokenOutput>;
/**
 * @public
 */
export type NFTMetadataInput = z.input<typeof CommonNFTInput>;
/**
 * @public
 */
export type NFTMetadataOrUri = z.input<typeof NFTInputOrUriSchema>;
/**
 * @public
 */
export type NFTMetadata = z.output<typeof CommonNFTOutput>;
/**
 * @public
 */
export type NFTCollectionMetadata = NFTMetadata;
/**
 * @public
 */
export type NFTMetadataOwner = {
  metadata: NFTMetadata;
  owner: string;
};
