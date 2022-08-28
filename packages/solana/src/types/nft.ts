import {
  FileBufferOrStringSchema,
  HexColor,
  JsonSchema,
  OptionalPropertiesInput,
} from "./common";
import { z } from "zod";

/**
 * @internal
 */
export const CommonTokenInput = z
  .object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    image: FileBufferOrStringSchema.nullable().optional(),
    external_url: FileBufferOrStringSchema.nullable().optional(),
  })
  .catchall(z.lazy(() => JsonSchema));

/**
 * @internal
 */
export const CommonTokenOutput = CommonTokenInput.extend({
  id: z.string(),
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
