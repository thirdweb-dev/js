import { BigNumberTransformSchema } from "../../shared/BigNumberSchema";
import { z } from "zod";

const PropertiesInput = z
  .object({})
  .catchall(z.union([BigNumberTransformSchema, z.unknown()]));

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(PropertiesInput), PropertiesInput])
  .optional();
