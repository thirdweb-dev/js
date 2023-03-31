import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMetadataInput = z.object({
  name: z.string(),
  metadataURI: z.string(),
  implementation: AddressOrEnsSchema,
});

/**
 * @internal
 */
export const PluginFunctionInput = z.object({
  functionSelector: BytesLikeSchema,
  functionSignature: z.string(),
  pluginAddress: AddressOrEnsSchema,
});
