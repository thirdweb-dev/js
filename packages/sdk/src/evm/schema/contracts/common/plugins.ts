import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMetadataInput = z.object({
  name: z.string(),
  metadataURI: z.string(),
  implementation: AddressSchema,
});

/**
 * @internal
 */
export const PluginFunctionInput = z.object({
  functionSelector: BytesLikeSchema,
  functionSignature: z.string(),
});

/**
 * @internal
 */
export const PluginInput = z.object({
  metadata: PluginMetadataInput,
  functions: z.array(PluginFunctionInput),
});
