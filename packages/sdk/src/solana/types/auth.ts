import { AddressSchema, RawDateSchema } from "./common";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

/**
 * @internal
 */
export const LoginOptionsSchema = z
  .object({
    /**
     * The optional nonce of the login request used to prevent replay attacks
     */
    nonce: z.string().optional(),
    /**
     * The optional time after which the login payload will be invalid
     */
    expirationTime: z.date().optional(),
  })
  .optional();

/**
 * @internal
 */
export const LoginPayloadDataSchema = z.object({
  /**
   * The domain that the user is attempting to login to
   */
  domain: z.string(),
  /**
   * The public key of the account that is logging in
   */
  address: AddressSchema,
  /**
   * The nonce of the login request used to prevent replay attacks, defaults to a random UUID
   */
  nonce: z.string().default(uuidv4()),
  /**
   * The time after which the login payload will be invalid, defaults to 5 minutes from now
   */
  expiration_time: z.date().transform((d) => d.toISOString()),
});

/**
 * @internal
 */
export const LoginPayloadSchema = z.object({
  /**
   * The payload data used for login
   */
  payload: LoginPayloadDataSchema,
  /**
   * The signature of the login request used for verification
   */
  signature: z.string(),
});

/**
 * @internal
 */
export const AuthenticationOptionsSchema = z
  .object({
    /**
     * The date before which the authentication payload is invalid
     */
    invalidBefore: z.date().optional(),
    /**
     * The date after which the authentication payload is invalid
     */
    expirationTime: z.date().optional(),
  })
  .optional();

/**
 * @internal
 */
export const AuthenticationPayloadDataSchema = z.object({
  /**
   * The address of the wallet issuing the payload
   */
  iss: z.string(),
  /**
   * The address of the wallet requesting to authenticate
   */
  sub: z.string(),
  /**
   * The domain intended to receive the authentication payload
   */
  aud: z.string(),
  /**
   * The date before which the authentication payload is invalid
   */
  exp: RawDateSchema,
  /**
   * The date after which the authentication payload is invalid
   */
  nbf: RawDateSchema,
  /**
   * The date on which the payload was issued
   */
  iat: RawDateSchema,
  /**
   * The unique identifier of the payload
   */
  jti: z.string().default(uuidv4()),
});

/**
 * @internal
 */
export const AuthenticationPayloadSchema = z.object({
  /**
   * The payload data used for authentication
   */
  payload: AuthenticationPayloadDataSchema,
  /**
   * The signature of the authentication payload used for authentication
   */
  signature: z.string(),
});

/**
 * @public
 */
export type LoginOptions = z.input<typeof LoginOptionsSchema>;

/**
 * @public
 */
export type LoginPayloadData = z.output<typeof LoginPayloadDataSchema>;

/**
 * @public
 */
export type LoginPayload = z.output<typeof LoginPayloadSchema>;

/**
 * @public
 */
export type AuthenticationOptions = z.input<typeof AuthenticationOptionsSchema>;

/**
 * @public
 */
export type AuthenticationPayloadData = z.output<
  typeof AuthenticationPayloadDataSchema
>;

/**
 * @public
 */
export type AuthenticationPayload = z.output<
  typeof AuthenticationPayloadSchema
>;
