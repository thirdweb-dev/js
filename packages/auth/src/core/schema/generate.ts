import { z } from "zod";
import { VerifyOptionsSchema } from "./verify";
import { JsonSchema } from "./common";

export const GenerateOptionsSchema = z
  .object({
    domain: z.string(),
    tokenId: z.string().optional(),
    expirationTime: z.date().optional(),
    invalidBefore: z.date().optional(),
    session: z.union([JsonSchema, z.function().args(z.string())]).optional(),
    verifyOptions: VerifyOptionsSchema.omit({
      domain: true,
    }).optional(),
  })
  .optional();

export type GenerateOptions = z.input<typeof GenerateOptionsSchema>;
