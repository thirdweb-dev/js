import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { AccountTypeSchema } from "./common";
import { THIRDWEB_AUTH_DEFAULT_LOGIN_PAYLOAD_DURATION_IN_SECONDS } from "../../constants";

export const LoginOptionsSchema = z.object({
  domain: z.string(),
  address: z.string().optional(),
  statement: z.string().optional(),
  uri: z.string().optional(),
  version: z.string().optional(),
  chainId: z.string().optional(),
  nonce: z.string().optional(),
  expirationTime: z
    .date()
    .default(
      () =>
        new Date(
          Date.now() +
            1000 * THIRDWEB_AUTH_DEFAULT_LOGIN_PAYLOAD_DURATION_IN_SECONDS,
        ),
    ),
  invalidBefore: z
    .date()
    .default(
      () =>
        new Date(
          Date.now() -
            1000 * THIRDWEB_AUTH_DEFAULT_LOGIN_PAYLOAD_DURATION_IN_SECONDS,
        ),
    ),
  resources: z.array(z.string()).optional(),
});

export const LoginPayloadDataSchema = z.object({
  type: AccountTypeSchema,
  domain: z.string(),
  address: z.string(),
  statement: z
    .string()
    .default(
      "Please ensure that the domain above matches the URL of the current website.",
    ),
  uri: z.string().optional(),
  version: z.string().default("1"),
  chain_id: z.string().optional(),
  nonce: z.string().default(() => uuidv4()),
  issued_at: z
    .date()
    .default(new Date())
    .transform((d) => d.toISOString()),
  expiration_time: z.date().transform((d) => d.toISOString()),
  invalid_before: z
    .date()
    .default(new Date())
    .transform((d) => d.toISOString()),
  resources: z.array(z.string()).optional(),
});

export const LoginPayloadSchema = z.object({
  payload: LoginPayloadDataSchema,
  signature: z.string(),
});

export const LoginPayloadOutputSchema = LoginPayloadSchema.extend({
  payload: LoginPayloadDataSchema.extend({
    issued_at: z.string(),
    expiration_time: z.string(),
    invalid_before: z.string(),
  }),
});

export type LoginOptions = z.input<typeof LoginOptionsSchema>;

export type LoginPayloadData = z.output<typeof LoginPayloadDataSchema>;

export type LoginPayload = z.output<typeof LoginPayloadSchema>;

export type LoginOptionsWithOptionalDomain = Omit<LoginOptions, "domain"> & {
  domain?: string;
};
