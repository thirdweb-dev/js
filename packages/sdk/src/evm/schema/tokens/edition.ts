import {
  CommonNFTInput,
  CommonNFTOutput,
  NFTInputOrUriSchema,
} from "../../../core/schema/nft";
import { BigNumberishSchema, BigNumberSchema } from "../shared/BigNumberSchema";
import { z } from "zod";

/**
 * @internal
 */
export const EditionMetadataOutputSchema = /* @__PURE__ */ (() =>
  z.object({
    supply: BigNumberSchema,
    metadata: CommonNFTOutput,
  }))();

/**
 * @internal
 */
export const EditionMetadataWithOwnerOutputSchema = /* @__PURE__ */ (() =>
  EditionMetadataOutputSchema.extend({
    owner: z.string(),
    quantityOwned: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const EditionMetadataInputSchema = /* @__PURE__ */ (() =>
  z.object({
    supply: BigNumberishSchema,
    metadata: CommonNFTInput,
  }))();

/**
 * @internal
 */
export const EditionMetadataInputOrUriSchema = /* @__PURE__ */ (() =>
  z.object({
    supply: BigNumberishSchema,
    metadata: NFTInputOrUriSchema,
  }))();

/**
 * @public
 */
export type EditionMetadataInput = z.input<typeof EditionMetadataInputSchema>;

/**
 * @public
 */
export type EditionMetadataOrUri = z.input<
  typeof EditionMetadataInputOrUriSchema
>;
