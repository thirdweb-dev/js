import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const ExtensionMetadataInput = z.object({
  name: z.string(),
  metadataURI: z.string(),
  implementation: AddressSchema,
});

/**
 * @internal
 */
export const ExtensionFunctionInput = z.object({
  functionSelector: BytesLikeSchema,
  functionSignature: z.string(),
});

/**
 * @internal
 */
export const ExtensionInput = z.object({
  metadata: ExtensionMetadataInput,
  functions: z.array(ExtensionFunctionInput),
});
