import { z } from "zod";
import {
  BigNumberSchema,
  FileBufferOrStringSchema,
  HexColor,
  JsonSchema,
} from "../../shared";
import { OptionalPropertiesInput } from "./properties";

/**
 * @internal
 */
export const CommonTokenInput = z
  .object({
    name: z.union([z.string(), z.number()]).optional(),
    description: z.string().nullable().optional(),
    image: FileBufferOrStringSchema.nullable().optional(),
    external_url: FileBufferOrStringSchema.nullable().optional(),
  })
  .catchall(z.lazy(() => JsonSchema));

/**
 * @internal
 */
export const CommonTokenOutput = CommonTokenInput.extend({
  id: BigNumberSchema,
  uri: z.string(),
  image: z.string().nullable().optional(),
  external_url: z.string().nullable().optional(),
});

/**
 * @internal
 */
export const CommonNFTInput = CommonTokenInput.extend({
  animation_url: FileBufferOrStringSchema.optional(),
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
export type NFTMetadataOwner = { metadata: NFTMetadata; owner: string };
