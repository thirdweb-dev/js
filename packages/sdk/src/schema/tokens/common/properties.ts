import { BigNumberishSchema } from "../../shared";
import { z } from "zod";

const PropertiesInput = z
  .object({})
  .catchall(z.union([BigNumberishSchema, z.unknown()]));

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(PropertiesInput), PropertiesInput])
  .optional();
