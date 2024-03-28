import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const ExtensionMetadataInput = /* @__PURE__ */ (() =>
  z.object({
    name: z.string(),
    metadataURI: z.string(),
    implementation: AddressOrEnsSchema,
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
