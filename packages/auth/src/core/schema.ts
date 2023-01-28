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

export const AccountTypeSchema = z.union([
  z.literal("evm"),
  z.literal("solana"),
]);

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
    statement: z.string().optional(),
    uri: z.string().optional(),
    version: z.string().optional(),
    chainId: z.string().optional(),
    nonce: z.string().optional(),
    expirationTime: z.date().optional(),
    invalidBefore: z.date().optional(),
    resources: z.array(z.string()).optional(),
  })
  .optional();

/**
 * @internal
 */
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
  nonce: z.string().default(uuidv4()),
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

/**
 * @internal
 */
export const LoginPayloadSchema = z.object({
  payload: LoginPayloadDataSchema,
  signature: z.string(),
});

/**
 * @internal
 */
const VerifyOptionsSchemaRequired = z.object({
  domain: z.string().optional(),
  statement: z.string().optional(),
  uri: z.string().optional(),
  version: z.string().optional(),
  chainId: z.string().optional(),
  validateNonce: z.function().args(z.string()).optional(),
  resources: z.array(z.string()).optional(),
});

/**
 * @internal
 */
export const VerifyOptionsSchema = VerifyOptionsSchemaRequired.optional();

/**
 * @internal
 */
export const GenerateOptionsSchema = z
  .object({
    domain: z.string().optional(),
    tokenId: z.string().optional(),
    expirationTime: z.date().optional(),
    invalidBefore: z.date().optional(),
    session: z.union([JsonSchema, z.function().args(z.string())]).optional(),
    verifyOptions: VerifyOptionsSchemaRequired.omit({
      domain: true,
    }).optional(),
  })
  .optional();

/**
 * @internal
 */
export const AuthenticationPayloadDataSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  aud: z.string(),
  exp: RawDateSchema.transform((b) => b.toNumber()),
  nbf: RawDateSchema.transform((b) => b.toNumber()),
  iat: RawDateSchema.transform((b) => b.toNumber()),
  jti: z.string().default(uuidv4()),
  ctx: JsonSchema.optional(),
});

/**
 * @internal
 */
export const AuthenticationPayloadSchema = z.object({
  payload: AuthenticationPayloadDataSchema,
  signature: z.string(),
});

/**
 * @internal
 */
export const AuthenticateOptionsSchema = z
  .object({
    domain: z.string().optional(),
    validateTokenId: z.function().args(z.string()).optional(),
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
  session?: TContext;
};

export const LoginPayloadOutputSchema = LoginPayloadSchema.extend({
  payload: LoginPayloadDataSchema.extend({
    issued_at: z.string(),
    expiration_time: z.string(),
    invalid_before: z.string(),
  }),
});
