import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const ExtensionMetadataInput = z.object({
  name: z.string(),
  metadataURI: z.string(),
  implementation: AddressOrEnsSchema,
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
