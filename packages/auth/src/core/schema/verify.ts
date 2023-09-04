import { z } from "zod";

export const VerifyOptionsSchema = z.object({
  domain: z.string(),
  statement: z.string().optional(),
  uri: z.string().optional(),
  version: z.string().optional(),
  chainId: z.string().optional(),
  validateNonce: z.function().args(z.string()).optional(),
  resources: z.array(z.string()).optional(),
});

export type VerifyOptions = z.input<typeof VerifyOptionsSchema>;

export type VerifyOptionsWithOptionalDomain = Omit<VerifyOptions, "domain"> & {
  domain?: string;
};
