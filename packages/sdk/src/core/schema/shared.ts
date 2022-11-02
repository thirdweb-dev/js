import BN from "bn.js";
import { BigNumber } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const isBrowser = () => typeof window !== "undefined";
/**
 * @internal
 */
export const FileOrBufferUnionSchema = isBrowser()
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
    z.custom<BN>((data) => {
      return BN.isBN(data);
    }),
  ])
  .transform((arg) => {
    let str = BN.isBN(arg)
      ? new BN(arg).toString()
      : BigNumber.from(arg).toString();
    return BigNumber.from(str);
  });

export const BigNumberishSchema = BigNumberSchema.transform((arg) =>
  arg.toString(),
);

export const BigNumberTransformSchema = z
  .union([
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
    z.custom<BN>((data) => {
      return BN.isBN(data);
    }),
  ])
  .transform((arg) => {
    if (BN.isBN(arg)) {
      return new BN(arg).toString();
    }
    return BigNumber.from(arg).toString();
  });

export const BasisPointsSchema = z
  .number()
  .max(MAX_BPS, "Cannot exceed 100%")
  .min(0, "Cannot be below 0%");

export const PercentSchema = z
  .number()
  .max(100, "Cannot exceed 100%")
  .min(0, "Cannot be below 0%");

export const HexColor = z.union([
  z.string().regex(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .transform((val) => val.replace("#", "")),
  z.string().length(0),
]);

export const AmountSchema = z
  .union([
    z.string().regex(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/, "Invalid amount"),
    z.number().min(0, "Amount cannot be negative"),
  ])
  .transform((arg) => (typeof arg === "number" ? arg.toString() : arg));

/**
 * @internal
 */
export type Amount = z.input<typeof AmountSchema>;

/**
 * @internal
 */
export const QuantitySchema = z
  .union([AmountSchema, z.literal("unlimited")])
  .default("unlimited");

export type Quantity = z.output<typeof QuantitySchema>;

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
