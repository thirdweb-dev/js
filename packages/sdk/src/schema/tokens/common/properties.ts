import { JsonObjectSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(JsonObjectSchema), JsonObjectSchema])
  .optional();
