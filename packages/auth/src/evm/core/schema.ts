import { utils, BigNumber } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const AddressSchema = z.string().refine(
  (arg) => utils.isAddress(arg),
  (out) => {
    return {
      message: `${out} is not a valid address`,
    };
  },
);

export const RawDateSchema = z.date().transform((i) => {
  return BigNumber.from(Math.floor(i.getTime() / 1000));
});

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
const JsonSchema: z.ZodType<Json> = z.lazy(
  () => z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]),
  { invalid_type_error: "Provided value was not valid JSON" },
);

/**
 * @internal
 */
export const LoginOptionsSchema = z
  .object({
    domain: z.string().optional(),
    /**
     * The optional nonce of the login request used to prevent replay attacks
     */
    nonce: z.string().optional(),
    /**
     * The optional time after which the login payload will be invalid
     */
    expirationTime: z.date().optional(),
    /**
     * The optional chain ID that the login request was intended for
     */
    chainId: z.number().optional(),
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
   * The address of the account that is logging in
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
  /**
   * The chain ID that the login request was intended for, defaults to none
   */
  chain_id: z.number().optional(),
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
export const VerifyOptionsSchema = z
  .object({
    domain: z.string().optional(),
    /**
     * The optional chain ID to expect the request to be for
     */
    chainId: z.number().optional(),
    /**
     * Function to check whether the nonce is valid
     */
    validateNonce: z.function().args(z.string()).optional(),
  })
  .optional();

/**
 * @internal
 */
export const GenerateOptionsSchema = z
  .object({
    domain: z.string().optional(),
    /**
     * The date before which the authentication payload is invalid
     */
    invalidBefore: z.date().optional(),
    /**
     * The date after which the authentication payload is invalid
     */
    expirationTime: z.date().optional(),
    /**
     * Optional context to include arbitrary data in the authentication payload
     */
    context: JsonSchema.optional(),
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
  exp: RawDateSchema.transform((b) => b.toNumber()),
  /**
   * The date after which the authentication payload is invalid
   */
  nbf: RawDateSchema.transform((b) => b.toNumber()),
  /**
   * The date on which the payload was issued
   */
  iat: RawDateSchema.transform((b) => b.toNumber()),
  /**
   * The unique identifier of the payload
   */
  jti: z.string().default(uuidv4()),
  /**
   * Optional context to include arbitrary data in the authentication payload
   */
  ctx: JsonSchema.optional(),
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
 * @internal
 */
export const AuthenticateOptionsSchema = z
  .object({
    domain: z.string().optional(),
  })
  .optional();

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
export type VerifyOptions = z.input<typeof VerifyOptionsSchema>;

/**
 * @public
 */
export type GenerateOptions = z.input<typeof GenerateOptionsSchema>;

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

/**
 * @public
 */
export type AuthenticateOptions = z.output<typeof AuthenticateOptionsSchema>;

/**
 * @public
 */
export type User<TContext extends Json = Json> = {
  address: string;
  context?: TContext;
  token: AuthenticationPayloadData;
};
