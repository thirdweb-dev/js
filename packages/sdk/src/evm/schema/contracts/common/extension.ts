import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared/AddressSchema";
import { z } from "zod";

/**
 * @internal
 */
export const ExtensionMetadataInput = /* @__PURE__ */ (() =>
  z.object({
    name: z.string(),
    metadataURI: z.string(),
    implementation: AddressSchema,
  }))();

/**
 * @internal
 */
export const ExtensionFunctionInput = /* @__PURE__ */ (() =>
  z.object({
    functionSelector: BytesLikeSchema,
    functionSignature: z.string(),
  }))();

/**
 * @internal
 */
export const ExtensionInput = /* @__PURE__ */ (() =>
  z.object({
    metadata: ExtensionMetadataInput,
    functions: z.array(ExtensionFunctionInput),
  }))();
