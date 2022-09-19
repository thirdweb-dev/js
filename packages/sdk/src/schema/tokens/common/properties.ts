import { JsonObjectSchema } from "@thirdweb-dev/storage";
import { z } from "zod";

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(JsonObjectSchema), JsonObjectSchema])
  .optional();
