import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMapInput = z.object({
  functionSelector: BytesLikeSchema,
  functionSignature: z.string(),
  pluginAddress: AddressOrEnsSchema,
});
