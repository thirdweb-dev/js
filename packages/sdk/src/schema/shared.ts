import { JsonOutput, JsonInput } from "../core/types";
import { BigNumber, CallOverrides, utils } from "ethers";
import { z, ZodTypeDef } from "zod";

export const MAX_BPS = 10000;

export const BytesLikeSchema = z.union([z.array(z.number()), z.string()]);

export const BigNumberSchema = z
  .union([
    z.string(),
    z.number(),
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
  ])
  .transform((arg) => BigNumber.from(arg));

export const BigNumberishSchema = BigNumberSchema.transform((arg) =>
  arg.toString(),
);

export const BasisPointsSchema = z
  .number()
  .max(MAX_BPS, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

export const PercentSchema = z
  .number()
  .max(100, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

export const HexColor = z.union([
  z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .transform((val) => val.replace("#", "")),
  z.string().length(0),
]);

export const AddressSchema = z.string().refine(
  (arg) => utils.isAddress(arg),
  (out) => {
    return {
      message: `${out} is not a valid address`,
    };
  },
);

export const JsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  BigNumberishSchema,
]);

export const JsonSchema: z.ZodSchema<JsonOutput, ZodTypeDef, JsonInput> =
  z.lazy(() => z.union([JsonLiteral, JsonObjectSchema, z.array(JsonSchema)]));
export const JsonObjectSchema = z.record(JsonSchema);

export const AmountSchema = z
  .union([
    z.string().regex(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/, "Invalid amount"),
    z.number().min(0, "Amount cannot be negative"),
  ])
  .transform((arg) => (typeof arg === "number" ? arg.toString() : arg));

export const RawDateSchema = z.date().transform((i) => {
  return BigNumber.from(Math.floor(i.getTime() / 1000));
});

/**
 * Default to now
 */
export const StartDateSchema = RawDateSchema.default(new Date(0));

/**
 * Default to 10 years from now
 */
export const EndDateSchema = RawDateSchema.default(
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
);

export const CallOverrideSchema: z.ZodType<CallOverrides> = z
  .object({
    gasLimit: BigNumberishSchema.optional(),
    gasPrice: BigNumberishSchema.optional(),
    maxFeePerGas: BigNumberishSchema.optional(),
    maxPriorityFeePerGas: BigNumberishSchema.optional(),
    nonce: BigNumberishSchema.optional(),
    value: BigNumberishSchema.optional(),
    blockTag: z.union([z.string(), z.number()]).optional(),
    from: AddressSchema.optional(),
    type: z.number().optional(),
  })
  .strict();

const isBrowser = () => typeof window !== "undefined";
const FileOrBufferUnionSchema = isBrowser()
  ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
  : (z.instanceof(Buffer) as z.ZodTypeAny); // @fixme, this is a hack to make browser happy for now

/**
 * @internal
 */
export const FileOrBufferSchema = z.union([
  FileOrBufferUnionSchema,
  z.object({
    data: z.union([FileOrBufferUnionSchema, z.string()]),
    name: z.string(),
  }),
]);

/**
 * @internal
 */
export const FileOrBufferOrStringSchema = z.union([
  FileOrBufferSchema,
  z.string(),
]);
