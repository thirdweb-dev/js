import { BigNumberTransformSchema } from "./shared";
import { z } from "zod";

const PropertiesInput = /* @__PURE__ */ (() =>
  z.object({}).catchall(z.union([BigNumberTransformSchema, z.unknown()])))();

/**
 * @internal
 */
export const OptionalPropertiesInput = /* @__PURE__ */ (() =>
  z
    .union([
      z.array(z.array(PropertiesInput)).transform((i) => i.flat()),
      z.array(PropertiesInput),
      PropertiesInput,
    ])
    .optional()
    .nullable())();
