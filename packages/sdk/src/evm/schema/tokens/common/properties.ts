import { BigNumberTransformSchema } from "../../shared/BigNumberSchema";
import { z } from "zod";

const PropertiesInput = /* @__PURE__ */ (() =>
  z.object({}).catchall(z.union([BigNumberTransformSchema, z.unknown()])))();

/**
 * @internal
 */
export const OptionalPropertiesInput = /* @__PURE__ */ (() =>
  z.union([z.array(PropertiesInput), PropertiesInput]).optional())();
