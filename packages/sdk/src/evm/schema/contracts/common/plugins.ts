import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMapInput = z.object({
  functionSelector: BytesLikeSchema,
  functionSignature: z.string(),
  pluginAddress: AddressSchema,
});
