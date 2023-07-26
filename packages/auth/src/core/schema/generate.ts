import { z } from "zod";
import { VerifyOptionsSchema } from "./verify";
import { JsonSchema } from "./common";
import { THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS } from "../../constants";

export const GenerateOptionsSchema = z.object({
  domain: z.string(),
  tokenId: z.string().optional(),
  expirationTime: z
    .date()
    .default(
      () =>
        new Date(
          Date.now() + 1000 * THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
        ),
    ),
  invalidBefore: z.date().optional(),
  session: z.union([JsonSchema, z.function().args(z.string())]).optional(),
  verifyOptions: VerifyOptionsSchema.omit({
    domain: true,
  }).optional(),
});

export type GenerateOptions = z.input<typeof GenerateOptionsSchema>;

export type GenerateOptionsWithOptionalDomain = Omit<
  GenerateOptions,
  "domain"
> & {
  domain?: string;
};
