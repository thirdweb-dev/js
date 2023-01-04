import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { utils } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMapInput = z.object({
  functionSelector: BytesLikeSchema.default(utils.hexZeroPad([0], 4)),
  functionSignature: z.string(),
  pluginAddress: AddressSchema,
});
