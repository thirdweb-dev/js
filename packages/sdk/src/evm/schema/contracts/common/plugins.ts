import { BytesLikeSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const PluginMapInput = /* @__PURE__ */ (() =>
  z.object({
    functionSelector: BytesLikeSchema,
    functionSignature: z.string(),
    pluginAddress: AddressOrEnsSchema,
  }))();
