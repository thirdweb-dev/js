import { OptionalPropertiesInput } from "./properties";
import {
  BigNumberTransformSchema,
  FileOrBufferOrStringSchema,
  HexColor,
} from "./shared";
import { z } from "zod";

/**
 * @internal
 */
export const CommonNFTInput = z
  .object({
    name: z.union([z.string(), z.number()]).optional(),
    description: z.string().nullable().optional(),
    image: FileOrBufferOrStringSchema.nullable().optional(),
    external_url: FileOrBufferOrStringSchema.nullable().optional(),
    animation_url: FileOrBufferOrStringSchema.optional(),
    background_color: HexColor.optional(),
    properties: OptionalPropertiesInput,
    attributes: OptionalPropertiesInput,
  })
  .catchall(z.union([BigNumberTransformSchema, z.unknown()]));

/**
 * @internal
 */
export const NFTInputOrUriSchema = z.union([CommonNFTInput, z.string()]);

/**
 * @internal
 */
export const CommonNFTOutput = CommonNFTInput.extend({
  id: z.string(),
  uri: z.string(),
  image: z.string().nullable().optional(),
  external_url: z.string().nullable().optional(),
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
export type NFT = {
  metadata: NFTMetadata;
  owner: string;
  type: "ERC1155" | "ERC721" | "metaplex";
  supply: number;
  quantityOwned?: number;
};
