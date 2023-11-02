import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { AddressSchema, JsonSchema, RawDateSchema } from "./common";

export const AuthenticationPayloadDataSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  aud: z.string(),
  exp: RawDateSchema,
  nbf: RawDateSchema,
  iat: RawDateSchema,
  jti: z.string().default(() => uuidv4()),
  ctx: JsonSchema.optional(),
});

export const AuthenticationPayloadSchema = z.object({
  payload: AuthenticationPayloadDataSchema,
  signature: z.string(),
});

export const AuthenticateOptionsSchema = z.object({
  domain: z.string(),
  issuerAddress: AddressSchema.optional(),
  validateTokenId: z.function().args(z.string()).optional(),
});

export type AuthenticationPayloadDataInput = z.input<
  typeof AuthenticationPayloadDataSchema
>;

export type AuthenticationPayloadData = z.output<
  typeof AuthenticationPayloadDataSchema
>;

export type AuthenticationPayload = z.output<
  typeof AuthenticationPayloadSchema
>;

export type AuthenticateOptions = z.output<typeof AuthenticateOptionsSchema>;

export type AuthenticateOptionsWithOptionalDomain = Omit<
  AuthenticateOptions,
  "domain"
> & {
  domain?: string;
};
