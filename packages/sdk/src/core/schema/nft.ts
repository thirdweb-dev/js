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
export const BasicNFTInput = /* @__PURE__ */ (() =>
  z.object({
    name: z.union([z.string(), z.number()]).optional().nullable(),
    description: z.string().nullable().optional().nullable(),
    image: FileOrBufferOrStringSchema.nullable().optional(),

    animation_url: FileOrBufferOrStringSchema.optional().nullable(),
  }))();

/**
 * @internal
 */
export const CommonNFTInput = /* @__PURE__ */ (() =>
  BasicNFTInput.extend({
    external_url: FileOrBufferOrStringSchema.nullable().optional(),
    background_color: HexColor.optional().nullable(),
    properties: OptionalPropertiesInput,
    attributes: OptionalPropertiesInput,
  }).catchall(z.union([BigNumberTransformSchema, z.unknown()])))();

/**
 * @internal
 */
export const NFTInputOrUriSchema = /* @__PURE__ */ (() =>
  z.union([CommonNFTInput, z.string()]))();

/**
 * @internal
 */
export const CommonNFTOutput = /* @__PURE__ */ (() =>
  CommonNFTInput.extend({
    id: z.string(),
    uri: z.string(),
    image: z.string().nullable().optional(),
    external_url: z.string().nullable().optional(),
    animation_url: z.string().nullable().optional(),
  }))();

/**
 * @public
 */
export type BasicNFTInput = /* @__PURE__ */ z.input<typeof BasicNFTInput>;

/**
 * @public
 */
export type NFTMetadataInput = /* @__PURE__ */ z.input<typeof CommonNFTInput>;
/**
 * @public
 */
export type NFTMetadataOrUri = /* @__PURE__ */ z.input<
  typeof NFTInputOrUriSchema
>;
/**
 * @public
 */
export type NFTMetadata = /* @__PURE__ */ z.output<typeof CommonNFTOutput>;
/**
 * @public
 */
export type NFT = {
  metadata: NFTMetadata;
  owner: string;
  type: "ERC1155" | "ERC721" | "metaplex";
  supply: string;
  quantityOwned?: string;
};

export type NFTWithoutMetadata = {
  metadata: Pick<NFTMetadata, "id">;
  owner: string;
  type: "ERC1155" | "ERC721" | "metaplex";
  supply: string;
  quantityOwned?: string;
};
